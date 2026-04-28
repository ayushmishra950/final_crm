import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userList: [],
    userData: null,
    dashboardData: {
        stats: { totalBookings: 0, pendingBookings: 0, completedBookings: 0 },
        recentBookings: [],
        notifications: []
    },
    fullHistory: [],
    payments: [],
    favorites: []
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
        },
        setUserDashboard: (state, action) => {
            state.dashboardData = action.payload;
        },
        setFullHistory: (state, action) => {
            state.fullHistory = action.payload;
        },
        setPayments: (state, action) => {
            state.payments = action.payload;
        },
        setFavorites: (state, action) => {
            state.favorites = action.payload;
        }
    }
})

export const { setUserList, setUserData, setUserDashboard, setFullHistory, setPayments, setFavorites } = userSlice.actions;
export default userSlice.reducer;