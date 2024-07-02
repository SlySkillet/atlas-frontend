import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const profileApi = createApi({
    reducerPath: 'profileApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/api/profiles/',
    }),
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: (profile_id) => `${profile_id}/`,
        }),
        updateProfile: builder.mutation({
            query: ({ profile_id, profileData }) => ({
                url: `${profile_id}/`,
                method: 'PUT',
                body: profileData,
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        }),
    }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;
