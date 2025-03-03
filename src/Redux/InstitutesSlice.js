import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios"
// Ասինխրոն հարցում՝ ֆակուլտետների բեռնումը
export const fetchInstitutes = createAsyncThunk('institutes/fetchInstitutes', async () => {
  const response = await axios.get("http://localhost:5000/institutes");

   return response.data;
});

const institutesSlice = createSlice({
  name: 'institutes',
  initialState: {
    list: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstitutes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInstitutes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload
      })
      .addCase(fetchInstitutes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default institutesSlice.reducer;
