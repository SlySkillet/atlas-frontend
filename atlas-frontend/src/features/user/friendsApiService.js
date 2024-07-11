import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getCSRFToken from '../../utils/auth';

export const friendsApi = createApi({
    reducerPath: 'friendsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/api/',
        prepareHeaders: (headers) => {
            const csrfToken = getCSRFToken();
            headers.set('Content-Type', 'application/json');
            if (csrfToken) {
                headers.set('X-CSRFToken', csrfToken);
            } else {
                console.error('token not found');
            }
            return headers;
        },
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        getFriends: builder.query({
            query: () => ({
                url: 'friends/',
            }),
        }),
        requestFriend: builder.mutation({
            query: (profileId) => ({
                url: `profiles/${profileId}/request-friend/`,
                method: 'POST',
            }),
        }),
        // test this
        removeFriend: builder.mutation({
            query: (profileId) => ({
                url: `friends/remove/${profileId}`,
                method: 'POST',
            }),
        }),
    }),
    // add additional endpoints for loading, error, etc.
});

export const { useGetFriendsQuery, useRequestFriendMutation } = friendsApi;
