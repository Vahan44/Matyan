import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import scheduleSlice from "./SheduleSlice";
import students  from "./StudentSlice";
import EmployeeSlice from "./Employees"
import lessonReducer from "./LessonsSlice";
import facultySlice from "./FacultySlice";
//import blogSlice from "./blogSlice";

export const store = configureStore({
    reducer: {
        user: userSlice ,
        schedule: scheduleSlice,
        Employee: userSlice,
        students: students,
        employees: EmployeeSlice,
        lesson: lessonReducer,
        faculty: facultySlice
    }
});
