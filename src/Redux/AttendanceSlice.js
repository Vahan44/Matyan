import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Ստանալ բոլոր ներկայությունները
export const fetchAttendance = createAsyncThunk(
    'attendance/fetchAttendance',
    async () => {
      const response = await fetch('http://localhost:5000/api/attendance');
      
      const text = await response.text(); // Ստանալու ամբողջ պատասխան
      
      try {
        const data = JSON.parse(text); // Փորձում ենք JSON-ով parse անել
        return data;
      } catch (err) {
        console.error("Response is not valid JSON:", text); // Դիտել HTML կամ այլ պատասխան
        throw new Error("Response is not valid JSON");
      }
    }
  );

// Ստանալ տվյալ ուսանողի ներկայությունները
export const fetchStudentAttendance = createAsyncThunk(
  'attendance/fetchStudentAttendance',
  async (studentId) => {
    const response = await fetch(`/api/attendance/${studentId}`);
    const data = await response.json();
    return data;
  }
);

// Ավելացնել նոր ներկայություն
export const addAttendanceRecord = createAsyncThunk(
  'attendance/addAttendanceRecord',
  async (attendanceData) => {
    const response = await fetch('http://localhost:5000/api/attendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(attendanceData),
    });
    const data = await response.json();
    return data;
  }
);

// Թարմացնել ներկայությունը
export const updateAttendanceRecord = createAsyncThunk(
  'attendance/updateAttendanceRecord',
  async (attendanceData) => {
    const response = await fetch(`http://localhost:5000/api/attendance/${attendanceData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(attendanceData),
    });
    const data = await response.json();
    return data;
  }
);

// Ջնջել ներկայությունը
export const deleteAttendanceRecord = createAsyncThunk(
  'attendance/deleteAttendanceRecord',
  async (attendanceId) => {
    const response = await fetch(`http://localhost:5000/api/attendance/${attendanceId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data;
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
