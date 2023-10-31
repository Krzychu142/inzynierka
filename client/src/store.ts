import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import { productsApi } from './features/productsApi';
import { employeesApi } from './features/employeesApi';
import { operationsApi } from './features/operationsSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        [productsApi.reducerPath]: productsApi.reducer,
        [employeesApi.reducerPath]: employeesApi.reducer,
        [operationsApi.reducerPath]: operationsApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(productsApi.middleware)
    .concat(employeesApi.middleware)
    .concat(operationsApi.middleware)
});

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch