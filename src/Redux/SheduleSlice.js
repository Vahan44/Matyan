import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/schedule";

// ✅ Բեռնել դասացուցակը
export const fetchSchedule = createAsyncThunk("schedule/fetchSchedule", async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

// ✅ Պահպանել դասացուցակը
export const saveSchedule = createAsyncThunk("schedule/saveSchedule", async (schedule) => {
  await axios.post(API_URL, schedule);
  return schedule;
});

const scheduleSlice = createSlice({
  name: "schedule",
  initialState: {
    schedule: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateClass: (state, action) => {
      const { dayIndex, periodIndex, subIndex, field, value } = action.payload;
      state.schedule[dayIndex].periods[periodIndex][subIndex][field] = value;
    },
    addClass: (state, action) => {
      const { dayIndex, periodIndex } = action.payload;
      state.schedule[dayIndex].periods[periodIndex].push({ name: "", group: "", professor: "", audience: "", classroom: ""});
    },
    removeClass: (state, action) => {
      const { dayIndex, periodIndex, subIndex } = action.payload;
      state.schedule[dayIndex].periods[periodIndex].splice(subIndex, 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedule.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.schedule = transformSchedule(action.payload);
      })
      .addCase(fetchSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(saveSchedule.fulfilled, (state) => {
        console.log("✅ Schedule saved successfully!");
      });
  },
});

// ✅ Վերափոխում MySQL-ի տվյալները
function transformSchedule(data) {
  const defaultSchedule = [
    { day: "Երկուշաբթի", periods: [[], [], [], []] },
    { day: "Երեքշաբթի", periods: [[], [], [], []] },
    { day: "Չորեքշաբթի", periods: [[], [], [], []] },
    { day: "Հինգշաբթի", periods: [[], [], [], []] },
    { day: "Ուրբաթ", periods: [[], [], [], []] },
  ];

  data.forEach((item) => {
    const dayEntry = defaultSchedule.find((d) => d.day === item.day);
    if (dayEntry && item.period >= 0 && item.period < 4) {
      dayEntry.periods[item.period].push({
        name: item.name || "",
        group: item.group_name || "",
        professor: item.professor || "",
        audience: item.audience || "",
        classroom: item.classroom || "",
      });
    }
  });

  return defaultSchedule;
}

export const { updateClass, addClass, removeClass } = scheduleSlice.actions;
export default scheduleSlice.reducer;
