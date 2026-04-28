import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slice/userSlice";
import vendorReducer from "../slice/vendorSlice";
import adminReducer from "../slice/adminSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        vendor: vendorReducer,
        admin: adminReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
