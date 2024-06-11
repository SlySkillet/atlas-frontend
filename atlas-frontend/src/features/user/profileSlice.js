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
    },
});

export const { setProfile } = profileSlice.actions;

export default profileSlice.reducer;
