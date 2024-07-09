import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    friends: [],
    loading: false,
    error: null,
};

export const friendsSlice = createSlice({
    name: 'friends',
    initialState,
    reducers: {
        setFriends: (state, action) => {
            state.friends = action.payload;
        },
    },
});

export const { setFriends } = friendsSlice.actions;

export default friendsSlice.reducer;
