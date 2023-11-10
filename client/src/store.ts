import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import { productsApi } from './features/productsApi';
import { employeesApi } from './features/employeesApi';
import { operationsApi } from './features/operationsSlice';
import { clientsApi } from './features/clientsSlice';
import { ordersApi } from './features/orderSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        [productsApi.reducerPath]: productsApi.reducer,
        [employeesApi.reducerPath]: employeesApi.reducer,
        [operationsApi.reducerPath]: operationsApi.reducer,
        [clientsApi.reducerPath]: clientsApi.reducer,
        [ordersApi.reducerPath] : ordersApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(productsApi.middleware)
    .concat(employeesApi.middleware)
    .concat(operationsApi.middleware)
    .concat(clientsApi.middleware)
    .concat(ordersApi.middleware)
});

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch