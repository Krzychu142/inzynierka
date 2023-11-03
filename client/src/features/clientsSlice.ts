import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

let baseUrl = import.meta.env.VITE_BASE_BACKEND_URL;

if (!baseUrl) {
    baseUrl = "http://localhost:3001/";
}

export const clientsApi = createApi({
    reducerPath: 'clientsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl + "clients",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getAllClients: builder.query({
            query: () => ("get"),
        })
    })
})

export const { useGetAllClientsQuery } = clientsApi;
