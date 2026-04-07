import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./UserSlice";
import ConfigSlice from "./ConfigSlice";

export const Store = configureStore({
    reducer:{
        user:UserSlice,
        config:ConfigSlice
    }
})