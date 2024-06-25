import { createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginAction, logout as logoutAction } from './userSlice';
import { setProfile, clearProfile } from './profileSlice';
import { profileApi } from './profileApiService';

export const loginAndFetchProfile = createAsyncThunk(
    'user/loginAndFetchProfile',
    async (userCredentials, { dispatch }) => {
        const response = await fetch('http://localhost:8000/api/login/', {
            method: 'POST',
            body: JSON.stringify(userCredentials),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const userData = await response.json();

        dispatch(loginAction(userData));

        const profileResponse = await dispatch(
            profileApi.endpoints.getProfile.initiate(userData.profile_id),
        );

        if (profileResponse.data) {
            dispatch(setProfile(profileResponse.data));
        }
        return userData;
    },
);

export const logoutAndClearProfile = createAsyncThunk(
    'user/logoutAndClearProfile',
    async (_, { dispatch }) => {
        const response = await fetch('http://localhost:8000/api/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            console.log('Logged out successfully');
            dispatch(logoutAction());
            dispatch(clearProfile());
        }
    },
);
