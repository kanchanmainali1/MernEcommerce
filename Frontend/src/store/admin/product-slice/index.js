import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"; // 1) Make sure axios is imported

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
    return result?.data;
  }
);

// Fetch all products
export const fetchAllProducts = createAsyncThunk(
  "adminProduct/fetchAllProducts",
  async () => {
    // 2) Remove formData from GET request
    const result = await axios.get(
      "http://localhost:5000/api/admin/products/get",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result?.data;
  }
);

// Edit a product
export const editProduct = createAsyncThunk(
  "adminProduct/editProduct",
  // 3) Destructure the payload to match how you're dispatching { id, formData }
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
        // If your backend returns { success: true, data: [ ... ] }, this will store the array
        state.productList = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      });
    // You can also add .addCase for addNewProduct, editProduct, deleteProduct as needed
  },
});

export default adminProductsSlice.reducer;
