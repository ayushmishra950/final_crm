import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userList: [],
    
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserList: (state, action) => {
            state.userList = action.payload;
        }
    }
})

export const { setUserList } = userSlice.actions;
export default userSlice.reducer;