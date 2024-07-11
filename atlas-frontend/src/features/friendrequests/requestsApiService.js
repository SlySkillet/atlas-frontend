import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getCSRFToken from '../../utils/auth';
export const requestsApi = createApi({
    reducerPath: 'requestsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/api/friendrequests/',
        prepareHeaders: (headers) => {
            //
            // getState included but not currently used. Add csrf to store on
            // user login to simplify access to token for authenticated user.
            // Csrf token currently retrieved below.
            //
            const csrfToken = getCSRFToken();
            headers.set('Content-Type', 'application/json');
            if (csrfToken) {
                // return {
                //     ...headers,
                //     'X-CSRFToken': csrfToken,
                // };
                headers.set('X-CSRFToken', csrfToken);
            } else {
                console.error('token not found');
            }
            // headers.forEach((value, key) => {
            //     console.log('TEST --> ', `${key}: ${value}`);
            // });
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
        cancelSentRequest: builder.mutation({
            query: (reqId) => ({
                url: `${reqId}/`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetSentRequestsQuery,
    useGetReceivedRequestsQuery,
    useCancelSentRequestMutation,
} = requestsApi;
