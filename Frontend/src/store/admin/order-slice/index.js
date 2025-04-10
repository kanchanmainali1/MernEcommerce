// src/store/admin/order-slice.js
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
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/orders/get");
      return response.data; // Expecting { success: true, data: orders }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getOrderDetailsForAdmin = createAsyncThunk(
  "adminOrder/getOrderDetailsForAdmin",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/orders/details/${id}`);
      return response.data; // Expecting { success: true, data: order }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "adminOrder/updateOrderStatus",
  async ({ id, orderStatus }, thunkAPI) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/admin/orders/update/${id}`, { orderStatus });
      return response.data; // Expecting { success: true, message: ..., data: updatedOrder }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrder",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data || [];
      })
      .addCase(getAllOrdersForAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.orderList = [];
        state.error = action.payload ? action.payload.message : action.error.message;
      })
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
        state.error = action.payload ? action.payload.message : action.error.message;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ? action.payload.message : action.error.message;
      });
  },
});

export const { resetOrderDetails } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
