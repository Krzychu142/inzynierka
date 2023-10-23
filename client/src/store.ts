import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import { productsApi } from './features/productsApi';
import { employeesApi } from './features/employeesApi';

const store = configureStore({
    reducer: {
        auth: authReducer,
        [productsApi.reducerPath]: productsApi.reducer,
        [employeesApi.reducerPath]: employeesApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(productsApi.middleware)
    .concat(employeesApi.middleware)
});

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch