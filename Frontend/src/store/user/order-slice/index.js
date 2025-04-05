import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
  esewaVerificationStatus: null, // To track eSewa payment status
  error: null,
};

// 1. Creating a New Order (Now Handling eSewa Integration)
export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData) => {
    const response = await axios.post(
      "http://localhost:5000/api/user/order/create",
      orderData
    );
    return response.data;
  }
);


export const capturePayment = createAsyncThunk(
  "/order/capturePayment",
  async ({ paymentId, payerId, orderId }) => {
    const response = await axios.post(
      "http://localhost:5000/api/user/order/capture",
      {
        paymentId,
        payerId,
        orderId,
      }
    );
    return response.data;
  }
);


export const verifyEsewaPayment = createAsyncThunk(
  "/order/verifyEsewaPayment",
  async ({ amt, rid, pid, scd }) => {
    const response = await axios.post(
      "http://localhost:5000/api/user/order/verify-esewa",
      { amt, rid, pid, scd }
    );
    return response.data;
  }
);


export const getAllOrdersByUserId = createAsyncThunk(
  "/order/getAllOrdersByUserId",
  async (userId) => {
    const response = await axios.get(
      `http://localhost:5000/api/user/order/list/${userId}`
    );
    return response.data;
  }
);


export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (id) => {
    const response = await axios.get(
      `http://localhost:5000/api/user/order/details/${id}`
    );
    return response.data;
  }
);

const UserOrderSlice = createSlice({
  name: "userOrder",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
      state.esewaVerificationStatus = null;
      state.error = null;
    },
    resetApprovalURL: (state) => {
      state.approvalURL = null; // Clear approval URL after redirection
    },
  },
  extraReducers: (builder) => {
    builder
      // Creating a new order (Handles eSewa URL)
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURL = action.payload.approvalURL || null; // URL for eSewa Payment
        state.orderId = action.payload.orderId;
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(action.payload.orderId)
        );
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Capture Payment (For Paypal)
      .addCase(capturePayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })

      // Verify eSewa Payment (New Case)
      .addCase(verifyEsewaPayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyEsewaPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.esewaVerificationStatus = action.payload.success ? "Success" : "Failed";
      })
      .addCase(verifyEsewaPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.esewaVerificationStatus = "Failed";
        state.error = action.error.message;
      })

      // Fetching All Orders by User
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data || [];
      })

      // Fetching Order Details
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      });
  },
});

export const { resetOrderDetails, resetApprovalURL } = UserOrderSlice.actions;

export default UserOrderSlice.reducer;
