import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orderList: [],
  orderDetails: null,
  isLoading: false,
  error: null,
};

export const getAllOrdersForAdmin = createAsyncThunk(
  "adminOrder/getAllOrdersForAdmin",
  async () => {
    const response = await axios.get(`http://localhost:5000/api/admin/orders/get`);
    return response.data; // Ensure this matches your backend response structure
  }
);

export const getOrderDetailsForAdmin = createAsyncThunk(
  "adminOrder/getOrderDetailsForAdmin",
  async (id) => {
    const response = await axios.get(`http://localhost:5000/api/admin/orders/details/${id}`);
    return response.data; // Ensure this matches your backend response structure
  }
);

export const updateOrderStatus = createAsyncThunk(
  "adminOrder/updateOrderStatus",
  async ({ id, orderStatus }) => {
    const response = await axios.put(
      `http://localhost:5000/api/admin/orders/update/${id}`,
      { orderStatus }
    );
    return response.data; // Ensure this matches your backend response structure
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrder", // Make sure this matches what you use in the store
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      console.log("resetOrderDetails");
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Orders
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data || []; // Ensure it’s an array
      })
      .addCase(getAllOrdersForAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.orderList = [];
        state.error = action.error.message;
      })

      // Fetch Order Details
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data || null;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.orderDetails = null;
        state.error = action.error.message;
      })

      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetOrderDetails } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
