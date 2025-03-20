import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Ստանալ բոլոր ներկայությունները
export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAttendance',
  async () => {
    const response = await axios.get('http://localhost:5000/api/attendance');
    return response.data;
  }
);

// Ստանալ տվյալ ուսանողի ներկայությունները
export const fetchStudentAttendance = createAsyncThunk(
  'attendance/fetchStudentAttendance',
  async (studentId) => {
    const response = await axios.get(`/api/attendance/${studentId}`);
    return response.data;
  }
);

// Ավելացնել նոր ներկայություն
export const addAttendanceRecord = createAsyncThunk(
  'attendance/addAttendanceRecord',
  async (attendanceData) => {
    const response = await axios.post('http://localhost:5000/api/attendance', attendanceData);
    return response.data;
  }
);

// Թարմացնել ներկայությունը
export const updateAttendanceRecord = createAsyncThunk(
  'attendance/updateAttendanceRecord',
  async (attendanceData) => {
    const response = await axios.put(`http://localhost:5000/api/attendance/${attendanceData.id}`, attendanceData);
    return response.data;
  }
);

// Ջնջել ներկայությունը
export const deleteAttendanceRecord = createAsyncThunk(
  'attendance/deleteAttendanceRecord',
  async (attendanceId) => {
    const response = await axios.delete(`http://localhost:5000/api/attendance/${attendanceId}`);
    return response.data;
  }
);

const initialState = {
  attendanceList: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Ստանալ բոլոր presentները
      .addCase(fetchAttendance.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.attendanceList = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // ✅ Ստանալ տվյալ ուսանողի presentները
      .addCase(fetchStudentAttendance.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStudentAttendance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.attendanceList = action.payload;
      })
      .addCase(fetchStudentAttendance.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // ✅ Ավելացնել նոր present
      .addCase(addAttendanceRecord.fulfilled, (state, action) => {
        state.attendanceList.push(action.payload);
      })

      // ✅ Թարմացնել presentը
      .addCase(updateAttendanceRecord.fulfilled, (state, action) => {
        const index = state.attendanceList.findIndex(
          (attendance) => attendance.AttID === action.payload.id
        );
        if (index !== -1) {
          state.attendanceList[index] = action.payload;
        }
      })

      // ✅ Ջնջել presentը
      .addCase(deleteAttendanceRecord.fulfilled, (state, action) => {
        const index = state.attendanceList.findIndex(
          (attendance) => attendance.AttID === action.payload.id
        );
        if (index !== -1) {
          state.attendanceList.splice(index, 1);
        }
      });
  },
});

// Default export
export default attendanceSlice.reducer;
