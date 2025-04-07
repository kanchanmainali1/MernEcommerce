import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  approvalURL: null, // Not used for COD
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
  error: null,
};

// Creating a New Order (Using COD, no external payment integration)
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
      state.error = null;
    },
    resetApprovalURL: (state) => {
      state.approvalURL = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Creating a new order (COD)
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = action.payload.orderId;
        sessionStorage.setItem("currentOrderId", JSON.stringify(action.payload.orderId));
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.isLoading = false;
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
