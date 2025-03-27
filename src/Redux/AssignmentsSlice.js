import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAssignment = createAsyncThunk(
    'assignment/fetchAssignment',
    async () => {
      
      const response = await fetch('http://localhost:5000/api/assignment');
      
      const text = await response.text(); 
      
      try {
        const data = JSON.parse(text); 
        return data;
      } catch (err) {
        console.error("Response is not valid JSON:", text); 
        throw new Error("Response is not valid JSON");
      }
    }
  );



export const addAssignmentRecord = createAsyncThunk(
  'attendance/addAttendanceRecord',
  async (assignmentData) => {
    const response = await fetch('http://localhost:5000/api/assignment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assignmentData),
    });
    const data = await response.json();
    return data;
  }
);

export const updateAssignmentRecord = createAsyncThunk(
  'attendance/updateAttendanceRecord',
  async (assignmentData) => {
    const response = await fetch(`http://localhost:5000/api/assignment/${assignmentData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assignmentData),
    });
    const data = await response.json();
    return data;
  }
);

export const deleteAssignmentRecord = createAsyncThunk(
  'attendance/deleteAttendanceRecord',
  async (assignmentId) => {
    const response = await fetch(`http://localhost:5000/api/assignment/${assignmentId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data;
  }
);

const initialState = {
    assignmentList: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const assignmentSlice = createSlice({
  name: 'assignment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Ստանալ բոլոր presentները
      .addCase(fetchAssignment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAssignment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.assignmentList = action.payload;
      })
      .addCase(fetchAssignment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      

      // ✅ Ավելացնել նոր present
      .addCase(addAssignmentRecord.fulfilled, (state, action) => {
        state.assignmentList.push(action.payload);
      })

      // ✅ Թարմացնել presentը
      .addCase(updateAssignmentRecord.fulfilled, (state, action) => {
        const index = state.assignmentList.findIndex(
          (a) => a.AssignmentID === action.payload.id
        );
        if (index !== -1) {
          state.assignmentList[index] = action.payload;
        }
      })

      // ✅ Ջնջել presentը
      .addCase(deleteAssignmentRecord.fulfilled, (state, action) => {
        const index = state.assignmentList.findIndex(
          (a) => a.AssignmentID === action.payload.id
        );
        if (index !== -1) {
          state.assignmentList.splice(index, 1);
        }
      });
  },
});

// Default export
export default assignmentSlice.reducer;
