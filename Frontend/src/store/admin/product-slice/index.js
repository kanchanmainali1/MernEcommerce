import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
};

// Add a new product
export const addNewProduct = createAsyncThunk(
  "adminProduct/addNewProduct",
  async (formData) => {
    const result = await axios.post(
      "http://localhost:5000/api/admin/products/add",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result?.data; // result?.data might contain { success, data, message }
  }
);

// Fetch all products
export const fetchAllProducts = createAsyncThunk(
  "adminProduct/fetchAllProducts",
  async () => {
    const result = await axios.get(
      "http://localhost:5000/api/admin/products/get",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result?.data; // e.g. { success: true, data: [...] }
  }
);

// Edit a product
export const editProduct = createAsyncThunk(
  "adminProduct/editProduct",
  async ({ id, formData }) => {
    const result = await axios.put(
      `http://localhost:5000/api/admin/products/edit/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result?.data;
  }
);

// Delete a product
export const deleteProduct = createAsyncThunk(
  "adminProduct/deleteProduct",
  async (id) => {
    const result = await axios.delete(
      `http://localhost:5000/api/admin/products/delete/${id}`
    );
    return result?.data;
  }
);

const adminProductsSlice = createSlice({
  name: "adminProduct",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Products
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        // If your backend returns { success: true, data: [ ... ] }, store that array
        state.productList = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      });
    // You could add .addCase for addNewProduct, editProduct, deleteProduct if needed
  },
});

export default adminProductsSlice.reducer;
