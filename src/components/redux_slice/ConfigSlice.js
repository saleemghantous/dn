import { createSlice } from "@reduxjs/toolkit";


const initialState={
    baseUrl:"http://127.0.0.1:5050" //developing env
    // baseUrl:"" //production env
}


export const ConfigSlice =createSlice({
    name:"config",
    initialState,
    reducers:{
        
    }
})

export const {} =ConfigSlice.actions
export default ConfigSlice.reducer