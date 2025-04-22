import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import scheduleSlice from "./SheduleSlice";
import students  from "./StudentSlice";
import EmployeeSlice from "./Employees"
import lessonReducer from "./LessonsSlice";
import facultySlice from "./FacultySlice";
import institutesSlice from "./InstitutesSlice";
import AttendanceSlice from "./AttendanceSlice"; 
import AssignmentsSlice from "./AssignmentsSlice";
import ExamGradeSlice from "./ExamGrade"
import daysofexamsSlice  from "./Daysofexams";
//import blogSlice from "./blogSlice";

export const store = configureStore({
    reducer: {
        user: userSlice ,
        schedule: scheduleSlice,
        Employee: userSlice,
        students: students,
        employees: EmployeeSlice,
        lesson: lessonReducer,
        faculty: facultySlice,
        institutes: institutesSlice,
        attendance: AttendanceSlice,
        assignment: AssignmentsSlice,
        ExamGrade: ExamGradeSlice,
        daysofexams: daysofexamsSlice
        
    }
});
