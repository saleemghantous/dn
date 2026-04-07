import { createSlice } from "@reduxjs/toolkit";


const initialState={
    phone:"",
}


export const UserSlice =createSlice({
    name:"user",
    initialState,
    reducers:{
        setUserProp:(state,action)=>{
            state[action.payload.prop]=action.payload.value;
        },
        cleanUserSlice:(state)=>{
            state.phone=""
           
        }
    }
})

export const {setUserProp,cleanUserSlice} =UserSlice.actions
export default UserSlice.reducer