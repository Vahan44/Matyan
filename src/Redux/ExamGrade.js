import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchExamGrade = createAsyncThunk(
    'ExamGrade/fetchExamGrade',
    async () => {
        
      const response = await fetch('http://localhost:5000/api/ExamGrade');
      
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



export const addExamGradeRecord = createAsyncThunk(
  'ExamGrade/addExamGradeRecord',
  async (ExamGradeData) => {
    
    const response = await fetch('http://localhost:5000/api/ExamGrade', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ExamGradeData),
    });
    const data = await response.json();
    return data;
  }
);

export const updateExamGradeRecord = createAsyncThunk(
  'ExamGrade/updateExamGradeRecord',
  async (ExamGradeData) => {
    debugger
    const response = await fetch(`http://localhost:5000/api/ExamGrade/${ExamGradeData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ExamGradeData),
    });
    const data = await response.json();
    return data;
  }
);

export const deleteExamGradeRecord = createAsyncThunk(
  'ExamGrade/deleteExamGradeRecord',
  async (ExamGradeID) => {
    const response = await fetch(`http://localhost:5000/api/ExamGrade/${ExamGradeID}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data;
  }
);

const initialState = {
    ExamGradeList: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const ExamGradeSlice = createSlice({
  name: 'ExamGrade',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Ստանալ բոլոր presentները
      .addCase(fetchExamGrade.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExamGrade.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ExamGradeList = action.payload;
      })
      .addCase(fetchExamGrade.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      

      // ✅ Ավելացնել նոր present
      .addCase(addExamGradeRecord.fulfilled, (state, action) => {
        state.ExamGradeList.push(action.payload);
      })

      // ✅ Թարմացնել presentը
      .addCase(updateExamGradeRecord.fulfilled, (state, action) => {
        const index = state.ExamGradeList.findIndex(
          (a) => a.ExapmGradeID === action.payload.id
        );
        if (index !== -1) {
          state.ExamGradeList[index] = action.payload;
        }
      })

      // ✅ Ջնջել presentը
      .addCase(deleteExamGradeRecord.fulfilled, (state, action) => {
        const index = state.ExamGradeList.findIndex(
          (a) => a.ExapmGradeID === action.payload.id
        );
        if (index !== -1) {
          state.ExamGradeList.splice(index, 1);
        }
      });
  },
});

// Default export
export default ExamGradeSlice.reducer;
