import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

let baseUrl = import.meta.env.VITE_BASE_BACKEND_URL;

if (!baseUrl) {
    baseUrl = "http://localhost:3001/"
}

export const ordersApi = createApi({
    reducerPath: 'ordersApi',
    baseQuery: fetchBaseQuery({
		baseUrl: baseUrl + "orders",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
	}),
    endpoints: (builder) => ({
        getAllOrders: builder.query({
            query: () => ("get"),
        })
    })
})

export const { useGetAllOrdersQuery } = ordersApi;