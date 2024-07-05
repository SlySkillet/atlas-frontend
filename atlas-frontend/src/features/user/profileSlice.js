import { createSlice } from '@reduxjs/toolkit';

const savedProfile = localStorage.getItem('profile');

const initialState = {
    profile: savedProfile || null,
    loading: false,
    error: null,
};

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfile: (state, action) => {
            state.profile = action.payload;
        },
        clearProfile: (state) => {
            state.profile = null;
            localStorage.removeItem('profile');
        },
    },
});

export const { setProfile, clearProfile } = profileSlice.actions;

export default profileSlice.reducer;
