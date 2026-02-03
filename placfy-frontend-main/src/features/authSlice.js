import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/client';

export const loginWithGoogle = createAsyncThunk('auth/loginWithGoogle', async (credential, thunkAPI) => {
	try {
		const { data } = await api.post('/auth/google', { credential });
		return data.user;
	} catch (err) {
		return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
	}
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, thunkAPI) => {
	try {
		const { data } = await api.get('/auth/me');
		return data.user;
	} catch (err) {
		return thunkAPI.rejectWithValue(null);
	}
});

export const logout = createAsyncThunk('auth/logout', async () => {
	await api.post('/auth/logout');
	return null;
});

const initialState = { user: null, status: 'idle', error: null };

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(loginWithGoogle.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(loginWithGoogle.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.user = action.payload;
			})
			.addCase(loginWithGoogle.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload || 'Login failed';
			})
			.addCase(fetchMe.fulfilled, (state, action) => {
				state.user = action.payload;
				state.status = 'succeeded';
			})
			.addCase(fetchMe.rejected, (state) => {
				state.user = null;
				state.status = 'idle';
			})
			.addCase(logout.fulfilled, (state) => {
				state.user = null;
				state.status = 'idle';
			});
	},
});

export default authSlice.reducer;
