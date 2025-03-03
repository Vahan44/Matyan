// LessonSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  lessons: [],
  users: [],
  faculties: [],
  status: "idle",
  error: null,
};

// Fetch Lessons
export const fetchLessons = createAsyncThunk("lessons/fetchLessons", async () => {
  const response = await axios.get("http://localhost:5000/lessons");
  return response.data;
});

// Fetch Users
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get("http://localhost:5000/employees");
  return response.data;
});

// Fetch Faculties
export const fetchFaculties = createAsyncThunk("faculties/fetchFaculties", async () => {
  const response = await axios.get("http://localhost:5000/faculty");
  return response.data;
});

// Add Lesson
export const addLesson = createAsyncThunk("lessons/addLesson", async (lesson) => {
  debugger
  const response = await axios.post("http://localhost:5000/lessons", lesson);
  return response.data;
});

// Update Lesson
export const updateLesson = createAsyncThunk("lessons/updateLesson", async (lesson) => {
  
  const response = await axios.put(`http://localhost:5000/lessons/${lesson.id}`, lesson);
  debugger
  return response.data;
});

// Delete Lesson
export const deleteLesson = createAsyncThunk("lessons/deleteLesson", async (id) => {
  await axios.delete(`http://localhost:5000/lessons/${id}`);
  return id;
});

const lessonSlice = createSlice({
  name: "lessons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLessons.fulfilled, (state, action) => {
        state.lessons = action.payload;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(fetchFaculties.fulfilled, (state, action) => {
        state.faculties = action.payload;
      })
      .addCase(addLesson.fulfilled, (state, action) => {
        state.lessons.push(action.payload);
      })
      .addCase(updateLesson.fulfilled, (state, action) => {
        const index = state.lessons.findIndex(l => l.LessonID === action.payload.LessonID);
        if (index !== -1) {
          state.lessons[index] = action.payload;
        }
      })
      .addCase(deleteLesson.fulfilled, (state, action) => {
        state.lessons = state.lessons.filter(l => l.LessonID !== action.payload);
      });
  },
});

export default lessonSlice.reducer;
