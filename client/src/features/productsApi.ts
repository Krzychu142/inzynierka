import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

let baseUrl = import.meta.env.VITE_BASE_BACKEND_URL;

if (!baseUrl) {
    baseUrl = "http://localhost:3001/"
}

export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({
		baseUrl: baseUrl + "products",
	}),
    endpoints: (builder) => ({
        getAllProducts: builder.query({
            query: () => ("getAllProducts"),
        })
    })
})

export const { useGetAllProductsQuery } = productsApi;