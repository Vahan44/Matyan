import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchEmployees = createAsyncThunk("employees/fetchEmployees", async () => {
  const response = await axios.get("http://localhost:5000/employees");

  return response.data;
});

export const addEmployee = createAsyncThunk("employees/addEmployee", async (employee) => {
  const response = await axios.post("http://localhost:5000/employees", employee);
  return response.data;
});

export const updateEmployee = createAsyncThunk("employees/updateEmployee", async (employee) => {
  const response = await axios.put(`http://localhost:5000/employees/${employee.UserID}`, employee);
  return response.data;
});

export const deleteEmployee = createAsyncThunk("employees/deleteEmployee", async (id) => {
  await axios.delete(`http://localhost:5000/employees/${id}`);
  return id;
});

const employeeSlice = createSlice({
  name: "employees",
  initialState: { list: [], status: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.list.findIndex((e) => e.UserID === action.payload.UserID);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export default employeeSlice.reducer;
