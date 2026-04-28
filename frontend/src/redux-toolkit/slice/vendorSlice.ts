import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    vendorUser: {
        fullName: '',
        mobile: '',
        about: '',
        businessName: '',
        category: '',
        operatingRadius: 10,
        address: ''
    },
    dashboardData: {
        stats: {
            totalBookings: 0,
            pendingBookings: 0,
            acceptedBookings: 0,
            totalEarnings: 0
        },
        recentBookings: [],
        reviews: []
    },
    myServices: []
}

const vendorSlice = createSlice({
    name: "vendor",
    initialState,
    reducers: {
        setVendorUser: (state, action) => {
            state.vendorUser = action.payload;
        },
        setVendorDashboard: (state, action) => {
            state.dashboardData = action.payload;
        },
        setMyServices: (state, action) => {
            state.myServices = action.payload;
        }
    }
})

export const { setVendorUser, setVendorDashboard, setMyServices } = vendorSlice.actions;
export default vendorSlice.reducer;
