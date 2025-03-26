import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};

// ✅ FIX: Added default empty object {} to safely handle no params
export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams = {}, sortParams = "price-lowtohigh" } = {}) => {
    // Optional: Debug log
    console.log("Fetching products with:", filterParams, sortParams);

    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    });

    const result = await axios.get(
      `http://localhost:5000/api/user/products/get?${query}`
    );

    return result?.data;
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const result = await axios.get(
      `http://localhost:5000/api/user/products/get/${id}`
    );
    return result?.data;
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
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })

    .addCase(fetchProductDetails.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(fetchProductDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.productDetails = action.payload.data;
    })
    .addCase(fetchProductDetails.rejected, (state) => {
      state.isLoading = false;
      state.productDetails = null;
    })
  },
});

export const { setProductDetails } = userProductSlice.actions;

export default userProductSlice.reducer;
