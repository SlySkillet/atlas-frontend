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
    }),
});

export const { useGetProfileQuery } = profileApi;
