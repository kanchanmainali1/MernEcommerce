import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/product-slice";
import userProductsSlice from "./user/product-slice";
import userCartSlice from "./user/cart-slice";
import userAddressSlice from "./user/address-slice";
import userOrderSlice from "./user/order-slice";
import userSearchSlice from "./user/search-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts:adminProductsSlice,
    userProducts:userProductsSlice,
    userCart:userCartSlice,
    userAddress:userAddressSlice,
    userOrder:userOrderSlice,
    userSearch:userSearchSlice,
  },
});

export default store;
