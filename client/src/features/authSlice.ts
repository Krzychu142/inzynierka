import { createAsyncThunk, createSlice, createAction  } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

export const initialState = {
    token: localStorage.getItem('token') || null,
    error: null as string | null,
    isAuthenticated: localStorage.getItem('token') ? true : false
};

export const login = createAsyncThunk< { token: string }, { email: string, password: string }, { rejectValue: string }>(
    'auth/login',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(`http://localhost:3001/auth/login`, data);
            return response.data;
        } catch (error) {
            
            let errorMessage = "Failed to login user";
            if (error instanceof AxiosError && error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            return rejectWithValue(errorMessage);
        }
    }
);

export const logout = createAction<void>('auth/logout');


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state, action) => {
            state.token = null;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem('token', state.token)
        });        
        builder.addCase(login.rejected, (state, action) => {
            state.token = null;
            state.error = action.payload || null;
        });
        builder.addCase(logout, (state) => {
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        });
    },
});

export default authSlice.reducer;
