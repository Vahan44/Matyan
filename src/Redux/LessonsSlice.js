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
export const updateLesson = createAsyncThunk("lessons/updateLesson", async (lesson) => {
  // օգտագործենք lesson.LessonID
  const response = await axios.put(`http://localhost:5000/lessons/${lesson.LessonID}`, lesson);
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
