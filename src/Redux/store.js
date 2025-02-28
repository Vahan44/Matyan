import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import scheduleReducer from "./SheduleSlice";
import students  from "./StudentSlice";
import EmployeeSlice from "./Employees"
//import blogSlice from "./blogSlice";

export const store = configureStore({
    reducer: {
        user: userSlice ,
        schedule: scheduleReducer,
        Employee: userSlice,
        students: students,
        employees: EmployeeSlice,
    }
});
