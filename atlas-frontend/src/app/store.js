import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import profileReducer from '../features/user/profileSlice';
import { profileApi } from '../features/user/profileApiService';
import { requestsApi } from '../features/friendrequests/requestsApiService';
import { friendsApi } from '../features/user/friendsApiService';
import friendsReducer from '../features/user/friendsSlice';
import friendRequestsReducer from '../features/friendrequests/friendRequestsSlice';

export default configureStore({
    reducer: {
        user: userReducer,
        [profileApi.reducerPath]: profileApi.reducer,
        profile: profileReducer,
        [friendsApi.reducerPath]: friendsApi.reducer,
        friends: friendsReducer,
        [requestsApi.reducerPath]: requestsApi.reducer,
        friendRequests: friendRequestsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            profileApi.middleware,
            requestsApi.middleware,
            friendsApi.middleware,
        ),
});
