import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
  error: null,
};

// ✅ FIX: Added default empty object {} to safely handle no params
export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams = {}, sortParams = "price-lowtohigh" } = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams({
        ...filterParams,
        sortBy: sortParams,
      });

      const response = await axios.get(
        `http://localhost:5000/api/user/products/get?${query}`
      );

      // ✅ Ensure the backend returns expected data structure
      if (response.data?.success) {
        return response.data;
      } else {
        return rejectWithValue(response.data?.message || "Failed to fetch products.");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Network Error");
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/user/products/get/${id}`
      );

      if (response.data?.success) {
        return response.data;
      } else {
        return rejectWithValue(response.data?.message || "Failed to fetch product details.");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Network Error");
    }
  }
);

const userProductSlice = createSlice({
  name: "userProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data || [];
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
        state.error = action.payload || "Failed to fetch products.";
      })
      
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data || null;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.productDetails = null;
        state.error = action.payload || "Failed to fetch product details.";
      });
  },
});

export const { setProductDetails } = userProductSlice.actions;

export default userProductSlice.reducer;
