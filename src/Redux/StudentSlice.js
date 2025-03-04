import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchStudents = createAsyncThunk("students/fetchStudents", async () => {
  const response = await axios.get("http://localhost:5000/students");
  
  return response.data;
});

export const addStudent = createAsyncThunk("students/addStudent", async (student) => {
  const response = await axios.post("http://localhost:5000/students", student);
  return response.data;
});

export const updateStudent = createAsyncThunk("students/updateStudent", async (student) => {
  const response = await axios.put(`http://localhost:5000/students/${student.id}`, student);
  return response.data;
});

export const deleteStudent = createAsyncThunk("students/deleteStudent", async (id) => {
    await axios.delete(`http://localhost:5000/students/${id}`);
    return id;  
  });

const studentSlice = createSlice({
  name: "students",
  initialState: { list: [], status: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.list.push(action.payload);  // ✅ Ավելացնում ենք Redux state-ի մեջ
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        const index = state.list.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export default studentSlice.reducer;
