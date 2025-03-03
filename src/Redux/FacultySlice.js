import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios"
// Ասինխրոն հարցում՝ ֆակուլտետների բեռնումը
export const fetchFaculties = createAsyncThunk('faculties/fetchFaculties', async () => {
  const response = await axios.get("http://localhost:5000/faculty");
   if (!response.ok) throw new Error('Failed to fetch faculties');
  // debugger
  return response.data;
});

const facultySlice = createSlice({
  name: 'faculties',
  initialState: {
    list: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {}, // Եթե տեղական աքշններ են պետք, ավելացրեք այստեղ
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaculties.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFaculties.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload
      })
      .addCase(fetchFaculties.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default facultySlice.reducer;
