import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    stats: { totalUsers: 0, totalProviders: 0, activeListings: 0, revenue: 0 },
    providers: [],
    users: [],
    reviews: [],
    categories: [],
    adminData: null
}

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        setAdminStats: (state, action) => {
            state.stats = action.payload;
        },
        setAdminProviders: (state, action) => {
            state.providers = action.payload;
        },
        setAdminUsers: (state, action) => {
            state.users = action.payload;
        },
        setAdminReviews: (state, action) => {
            state.reviews = action.payload;
        },
        setAdminCategories: (state, action) => {
            state.categories = action.payload;
        },
        setAdminData: (state, action) => {
            state.adminData = action.payload;
        }
    }
})

export const { setAdminStats, setAdminProviders, setAdminUsers, setAdminReviews, setAdminCategories, setAdminData } = adminSlice.actions;
export default adminSlice.reducer;
