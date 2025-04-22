import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    daysofexams: [],
  users: [],
  faculties: [],
  status: "idle",
  error: null,
};

// Fetch daysofexams
export const fetchdaysofexams = createAsyncThunk("daysofexams/fetchdaysofexams", async () => {
  const response = await axios.get("http://localhost:5000/daysofexams");
  return response.data;
});



// Add daysofexams
export const adddaysofexams = createAsyncThunk("daysofexams/adddaysofexams", async (daysofexams) => {
  debugger
  const response = await axios.post("http://localhost:5000/daysofexams", daysofexams);
  return response.data;
});
export const updatedaysofexams = createAsyncThunk("daysofexams/updatedaysofexams", async (daysofexams) => {

  const response = await axios.put(`http://localhost:5000/daysofexams/${daysofexams.id}`, daysofexams);
  return response.data;
});


// Delete daysofexams
export const deletedaysofexams = createAsyncThunk("daysofexams/deletedaysofexams", async (id) => {
  await axios.delete(`http://localhost:5000/daysofexams/${id}`);
  return id;
});

const daysofexamsSlice = createSlice({
  name: "daysofexams",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchdaysofexams.fulfilled, (state, action) => {
        state.daysofexams = action.payload;
      })
    
      .addCase(adddaysofexams.fulfilled, (state, action) => {
        state.daysofexams.push(action.payload);
      })
      .addCase(updatedaysofexams.fulfilled, (state, action) => {
        const index = state.daysofexams.findIndex(l => l.id === action.payload.id);
        if (index !== -1) {
          state.daysofexams[index] = action.payload;
        }
      })
      .addCase(deletedaysofexams.fulfilled, (state, action) => {
        state.daysofexams = state.daysofexams.filter(l => l.id !== action.payload);
      });
  },
});

export default daysofexamsSlice.reducer;
