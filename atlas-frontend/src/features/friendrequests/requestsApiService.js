import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getCSRFToken from '../../utils/auth';
export const requestsApi = createApi({
    reducerPath: 'requestsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/api/friendrequests/',
        prepareHeaders: (headers, { getState }) => {
            //
            // getState included but not currently used. Add csrf to store on
            // user login to simplify access to token for authenticated user.
            // Csrf token currently retrieved below.
            //
            const csrfToken = getCSRFToken();

            if (csrfToken) {
                headers.set('X-CSRFToken', csrfToken);
            }
            return headers;
        },
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        getSentRequests: builder.query({
            query: () => 'pending/',
        }),
        getReceivedRequests: builder.query({
            query: () => 'received/',
        }),
    }),
});

export const { useGetSentRequestsQuery, useGetReceivedRequestsQuery } =
    requestsApi;
