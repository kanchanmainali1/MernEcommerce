import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/product-slice";
import userProductsSlice from "./user/product-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts:adminProductsSlice,
    userProducts:userProductsSlice,
  },
});

export default store;
