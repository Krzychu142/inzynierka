import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

let baseUrl = import.meta.env.VITE_BASE_BACKEND_URL;

if (!baseUrl) {
    baseUrl = "http://localhost:3001/";
}

export const employeesApi = createApi({
    reducerPath: 'employeesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl + "employees",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getAllEmployees: builder.query({
            query: () => ("get"),
        })
    })
})

export const { useGetAllEmployeesQuery } = employeesApi;
