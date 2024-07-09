import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    sentRequests: [],
    receivedRequests: [],
    loading: false,
    error: null,
};

export const friendRequestsSlice = createSlice({
    name: 'friendRequests',
    initialState,
    reducers: {
        setSentRequests: (state, action) => {
            state.sentRequests = action.payload;
        },
        setReceivedRequests: (state, action) => {
            state.receivedRequests = action.payload;
        },
    },
});

export const { setSentRequests, setReceivedRequests } =
    friendRequestsSlice.actions;

export default friendRequestsSlice.reducer;
