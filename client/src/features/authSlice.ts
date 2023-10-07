import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

export const initialState = {
    token: null as string | null | undefined,
    error: null as string | null,
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
        });        
        builder.addCase(login.rejected, (state, action) => {
            state.token = null;
            state.error = action.payload || null;
        });   
    },
});

export default authSlice.reducer;
