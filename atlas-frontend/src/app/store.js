import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../pages/userSlice';

export default configureStore({
    reducer: {
        user: userReducer,
    },
});
