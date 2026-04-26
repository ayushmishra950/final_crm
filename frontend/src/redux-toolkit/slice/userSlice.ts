import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userList: [],
    userData: null,

}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserList: (state, action) => {
            state.userList = action.payload;
        },
        setUserData: (state, action) => {
            state.userData = action.payload;
        }
    }
})

export const { setUserList, setUserData } = userSlice.actions;
export default userSlice.reducer;