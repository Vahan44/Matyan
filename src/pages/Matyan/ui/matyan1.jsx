import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendance, addAttendanceRecord, deleteAttendanceRecord, updateAttendanceRecord } from '../../../Redux/AttendanceSlice';
import { fetchSchedule } from "../../../Redux/SheduleSlice.js";
import { fetchStudents } from "../../../Redux/StudentSlice";
import { useParams } from 'react-router-dom';
import { fetchLessons, fetchFaculties } from "../../../Redux/LessonsSlice";
import { fetchAssignment, addAssignmentRecord, updateAssignmentRecord, deleteAssignmentRecord } from '../../../Redux/AssignmentsSlice.js';
import "./Matyan.css"; 

const Matyan = () => {
    const { data } = useParams();
    const dispatch = useDispatch();


    const lessons = useSelector((state) => state.lesson?.lessons);
    const status = useSelector((state) => state.attendance.status);
    const error = useSelector((state) => state.attendance.error);
    const students = useSelector((state) => state.students?.list);
    const Employee = useSelector((state) => state.Employee);
    const schedule = useSelector((state) => state.schedule.schedule);
    const faculties = useSelector((state) => state.faculty?.list);
    const assignmentList = useSelector((state) => state.assignment.assignmentList)

    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(1);
    const [lesson, setLesson] = useState(null);

    const course = "ՏՏ119";

    useEffect(() => {
        dispatch(fetchFaculties());
        dispatch(fetchSchedule());
        dispatch(fetchStudents());
        dispatch(fetchLessons());
        dispatch(fetchAssignment())
    }, [dispatch]);

    useEffect(() => {
        if (lessons.length > 0) {
            const selectedLesson = lessons.find(lesson => lesson.LessonID == data);
            setLesson(selectedLesson || {});
        }
    }, [lessons, data]);

    const days = () => {
        let dayOfWeek = new Set();
        schedule.forEach((day) => {
            day.periods.forEach((period) => {
                period.forEach((cls) => {
                    if (cls.professor === `${Employee.user.LastName} ${Employee.user.FirstName}`
                        && cls.course === course
                        && cls.group_name === lesson?.group_) {
                        dayOfWeek.add(day.day);
                    }
                });
            });
        });
        return [...dayOfWeek];
    };

    if (status === 'loading') return <p>Loading...</p>;
    if (status === 'failed') return <p>Error: {error}</p>;





    const getFilteredDays = (year, month, dayOfWeek) => {
        const filteredDays = [];
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const weekDays = ['Կիրակի', 'Երկուշաբթի', 'Երեքշաբթի', 'Չորեքշաբթի', 'Հինգշաբթի', 'Ուրբաթ', 'Շաբաթ'];

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayName = weekDays[date.getDay()];
            if (dayOfWeek.includes(dayName)) {
                filteredDays.push(day);
            }
        }
        return filteredDays;
    };

    const filterStudents = (group, subgroup) => {
        if (!lesson) return false;
        switch (lesson?.group_?.[0]) {
            case 'Դ':
                return true;
            case 'Լ':
                return subgroup == lesson.group_[4];
            case 'Կ':
                return group == lesson.group_[4];
            case 'Գ':
                return group == lesson.group_[5]
            default:
                return false;
        }
    };



    const toggleAssStatus = (studentId, year, month, day, userId, lessonId, grade, newStatus) => {

        const attendance = assignmentList.find((attendance) => {
            return (
                attendance.StudentID === studentId &&
                attendance.UserID === userId &&
                attendance.LessonID === lessonId &&
                attendance.year === year &&
                attendance.month === month &&
                attendance.day === day
            );
        });
    
        if (!attendance) {

            dispatch(addAssignmentRecord({
                StudentID: studentId,
                UserID: userId,
                LessonID: lessonId,
                Status: newStatus,
                Grade: grade,
                year: year,
                month: month,
                day: day
            }));
        } else {

            if (0) {
                dispatch(deleteAttendanceRecord(attendance.AttID));
            } else {
                dispatch(updateAssignmentRecord({
                    id: attendance.AttID,
                    StudentID: studentId,
                    UserID: userId,
                    LessonID: lessonId,
                    Status: newStatus,
                    Grade: grade,
                    year: year,
                    month: month,
                    day: day
                }));
            }
        }
    

        setTimeout(() => {
            dispatch(fetchAssignment());
        }, 500);
    };
    


    const filteredDays = getFilteredDays(year, month, days());

    return (
        <div className="matyan-container">
        <h1 className="matyan-title">{lesson?.Name || "Loading..."}</h1>
        <p className="matyan-subtitle">
            Կուրս <span style={{ color: "#a855f7", fontWeight: "600" }}>
                {faculties.find(fac => fac.FacultyID === lesson?.FacultyID)?.Course}
            </span>
        </p>
    
        <div className="matyan-select-container">
            <div className="matyan-select-wrapper">
                <label className="matyan-label">Տարի</label>
                <select className="matyan-select" onChange={(e) => setYear(parseInt(e.target.value))}>
                    <option value={2025}>2025</option>
                    <option value={2024}>2024</option>
                </select>
            </div>
            <div className="matyan-select-wrapper">
                <label className="matyan-label">Ամիս</label>
                <select className="matyan-select" onChange={(e) => setMonth(parseInt(e.target.value))}>
                    <option value={1}>Փետրվար</option>
                    <option value={2}>Մարտ</option>
                    <option value={3}>Ապրիլ</option>
                    <option value={4}>Մայիս</option>
                    <option value={8}>Սեպտեմբեր</option>
                    <option value={9}>Հոկտեմբեր</option>
                    <option value={10}>Նոյեմբեր</option>
                    <option value={11}>Դեկտեմբեր</option>
                </select>
            </div>
        </div>
    
        <table className="matyan-table">
            <thead>
                <tr className="matyan-tr">
                    <th className="matyan-th">№</th>
                    <th className="matyan-th">Ազգանուն Անուն Հայրանուն</th>
                    {filteredDays.map((day) => (
                        <th key={day} className="matyan-th">{day}/{month + 1}/{year - 2000}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {students.map((student) => (
                    student.course === course && filterStudents(student.group_, student.subgroup) && (
                        <tr key={student.recordNumber} className="matyan-tr">
                            <td className="matyan-td">{student.recordNumber}</td>
                            <td className="matyan-td">{student.firstName} {student.lastName} {student.patronymic}</td>
                            {filteredDays.map((day, index) => {
                                let attendanceRecord = assignmentList.find((attendance) =>
                                    attendance.StudentID === student.id &&
                                    attendance.UserID === lesson?.UserID &&
                                    attendance.LessonID === lesson.LessonID &&
                                    attendance.year === year &&
                                    attendance.month === month + 1 &&
                                    attendance.day === day
                                );
    
                                let status1 = attendanceRecord?.Status || "";
                                let Grade = attendanceRecord?.Grade || '';
    
                                return (
                                    <td key={index} className="matyan-td">
                                        <input
                                            type="number"
                                            className="matyan-input"
                                            value={Grade}
                                            onChange={(e) => {
                                                toggleAssStatus(student.id, year, month, day, lesson?.UserID, lesson.LessonID, e.target.value, 'հանձնված');
                                            }}
                                        />
                                        <button
                                            className={`matyan-button`}
                                            style={{
                                                backgroundColor: status1 === "կատարված"
                                                    ? "rgb(50, 171, 13)"
                                                    : status1 === "հանձնված"
                                                        ? "rgb(27, 42, 255)"
                                                        : "rgb(193, 193, 193)"
                                            }}
                                            onClick={() => {
                                                let newStatus;
                                                if (status1 === "") newStatus = "կատարված";
                                                else if (status1 === "կատարված") newStatus = "հանձնված";
                                                else newStatus = "";
    
                                                toggleAssStatus(student.id, year, month, day, lesson?.UserID, lesson.LessonID, Grade, newStatus);
                                            }}
                                        >պահպանել</button>
    
                                        
                                    </td>
                                );
                            })}
                        </tr>
                    )
                ))}
            </tbody>
        </table>
    </div>
    );
};

export default Matyan;
