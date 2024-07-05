import { createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginAction, logout as logoutAction } from './userSlice';
import { setProfile, clearProfile } from './profileSlice';
import { profileApi } from './profileApiService';
import getCSRFToken from '../../utils/auth';

export const loginAndFetchProfile = createAsyncThunk(
    'user/loginAndFetchProfile',
    async (userCredentials, { dispatch }) => {
        const csrfToken = getCSRFToken();
        console.log('token', csrfToken);
        const response = await fetch('http://localhost:8000/api/login/', {
            method: 'POST',
            body: JSON.stringify(userCredentials),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': `${csrfToken}`,
            },
            credentials: 'include',
        });
        const userData = await response.json();

        // add authenticated user to store and localStorage
        dispatch(loginAction(userData));
        localStorage.setItem('user', JSON.stringify(userData));

        // retrieve authenticated user profile
        const profileResponse = await dispatch(
            profileApi.endpoints.getProfile.initiate(userData.profile_id),
        );

        // add user profile to store and localStorage
        if (profileResponse.data) {
            dispatch(setProfile(profileResponse.data));
        }
        localStorage.setItem('profile', JSON.stringify(profileResponse.data));

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
