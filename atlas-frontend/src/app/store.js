import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import profileReducer from '../features/user/profileSlice';
import { profileApi } from '../features/user/profileApiService';
import { requestsApi } from '../features/friendrequests/requestsApiService';

export default configureStore({
    reducer: {
        user: userReducer,
        [profileApi.reducerPath]: profileApi.reducer,
        profile: profileReducer,
        [requestsApi.reducerPath]: requestsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            profileApi.middleware,
            requestsApi.middleware,
        ),
});
