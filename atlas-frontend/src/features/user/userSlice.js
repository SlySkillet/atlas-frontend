import { createSlice } from '@reduxjs/toolkit';
import { loginAndFetchProfile } from './thunks';

const savedUser = JSON.parse(localStorage.getItem('user'));

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: savedUser || null,
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem('user');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAndFetchProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginAndFetchProfile.fulfilled, (state, action) => {
                state.user = action.payload;
                state.status = 'succeeded';
            })
            .addCase(loginAndFetchProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
