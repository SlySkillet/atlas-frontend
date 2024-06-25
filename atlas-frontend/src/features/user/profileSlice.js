import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    profile: null,
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
        },
    },
});

export const { setProfile, clearProfile } = profileSlice.actions;

export default profileSlice.reducer;
