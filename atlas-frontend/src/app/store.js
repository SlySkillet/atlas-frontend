import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import profileReducer from '../features/user/profileSlice';
import { profileApi } from '../features/user/profileApiService';

export default configureStore({
    reducer: {
        user: userReducer,
        [profileApi.reducerPath]: profileApi.reducer,
        profile: profileReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(profileApi.middleware),
});
