import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendance, addAttendanceRecord, deleteAttendanceRecord, updateAttendanceRecord } from '../../../Redux/AttendanceSlice';
import { fetchSchedule } from "../../../Redux/SheduleSlice.js";
import { fetchStudents } from "../../../Redux/StudentSlice";
import { useParams } from 'react-router-dom';
import { fetchLessons, fetchFaculties } from "../../../Redux/LessonsSlice";
import "./Matyan.css"; // Import the CSS file

const Matyan = () => {
    const { data } = useParams();
    const dispatch = useDispatch();

    // Redux state-ները
    const lessons = useSelector((state) => state.lesson?.lessons);
    const attendanceList = useSelector((state) => state.attendance.attendanceList);
    const status = useSelector((state) => state.attendance.status);
    const error = useSelector((state) => state.attendance.error);
    const students = useSelector((state) => state.students?.list);
    const Employee = useSelector((state) => state.Employee);
    const schedule = useSelector((state) => state.schedule.schedule);
    const faculties = useSelector((state) => state.faculty?.list);

    // State-եր
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(1);
    const [lesson, setLesson] = useState(null);

    const course = "ՏՏ119";

    useEffect(() => {
        dispatch(fetchAttendance());
        dispatch(fetchFaculties());
        dispatch(fetchSchedule());
        dispatch(fetchStudents());
        dispatch(fetchLessons()); // Ավելացված fetch
    }, [dispatch]);

    useEffect(() => {
        if (lessons.length > 0) {
            const selectedLesson = lessons.find(lesson => lesson.LessonID == data);
            setLesson(selectedLesson || {});
        }
    }, [lessons, data]); // Ավելացված dependency

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



    console.log(attendanceList)


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






    const toggleStatus = (studentId, year, month, day, userId, lessonId, newStatus) => {

        const attendance = attendanceList.find((attendance) => {


            debugger
            return (
                attendance.StudentID == studentId &&
                attendance.UserID == userId &&
                attendance.LessonID == lessonId &&
                attendance.year == year &&
                attendance.month == month + 1 &&
                attendance.day == day
            )
        })



        if (!attendance) {
            // Եթե գրառում չկա, ավելացնում ենք
            dispatch(addAttendanceRecord({
                StudentID: studentId,
                UserID: userId,
                LessonID: lessonId,
                Status: newStatus,
                year: year,
                month: month + 1,
                day: day
            }));
        } else {
            // Եթե գրառումը կա, ապա կամ փոխում ենք կամ ջնջում
            if (newStatus === "") {
                dispatch(deleteAttendanceRecord(attendance.AttID));
            } else {
                dispatch(updateAttendanceRecord({ // Թարմացնում ենք առկա գրառումը
                    id: attendance.AttID, 
                    StudentID: studentId,
                    UserID: userId,
                    LessonID: lessonId,
                    Status: newStatus,
                    year: year,
                    month: month + 1,
                    day: day
                }));
            }
        
        }
        window.location.reload();

    };


    const filteredDays = getFilteredDays(year, month, days());

    return (
        <div className='container'>
            <div style={{ padding: "24px", borderRadius: "12px" }}>
                <h1 style={{ fontSize: "34px", fontWeight: "600", color: "#1f2937" }}>{lesson?.Name || "Loading..."}</h1>
                <p style={{ fontSize: "22px", color: "#4b5563", marginBottom: '-50px' }}>
                    Կուրս <span style={{ color: "#a855f7", fontWeight: "600" }}>
                        {faculties.find(fac => fac.FacultyID === lesson?.FacultyID)?.Course}
                    </span>
                </p>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <button className="save" onClick={() => { }} style={{ display: 'flex', justifyContent: 'center ', width: '400px', cursor: 'pointer', textAlign: 'center', fontSize: '15px', color: 'white', background: "#a855f7", borderRadius: '10px', padding: '15px', }} >Պահպանել </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "24px" }}>
                    <div style={{ backgroundColor: "white", padding: "16px", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>



                        <label style={{ display: "block", color: "#374151", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>
                            Տարի
                        </label>
                        <select onChange={(e) => setYear(parseInt(e.target.value))} style={{ width: "100%", border: "1px solid #60a5fa", borderRadius: "8px", padding: "8px" }}>
                            <option value={2025}>2025</option>
                            <option value={2024}>2024</option>
                        </select>
                    </div>
                    <div style={{ backgroundColor: "white", padding: "16px", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
                        <label style={{ display: "block", color: "#374151", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>
                            Ամիս
                        </label>
                        <select onChange={(e) => setMonth(parseInt(e.target.value))} style={{ width: "100%", border: "1px solid #60a5fa", borderRadius: "8px", padding: "8px" }}>
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
            </div>

            <table border="1">
                <thead>
                    <tr>
                        <th style={{ width: '20px' }}>№</th>
                        <th style={{ width: '250px' }}>Ազգանուն Անուն Հայրանուն</th>
                        {filteredDays.map((day) => (
                            <th key={day}>{day}/{month + 1}/{year - 2000}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        student.course === course && filterStudents(student.group_, student.subgroup) && (
                            <tr key={student.recordNumber}>
                                <td style={{ textAlign: 'center' }}>{student.recordNumber}</td>
                                <td>{student.firstName} {student.lastName} {student.patronymic}</td>
                                {filteredDays.map((day, index) => {
                                    let attendanceRecord = attendanceList.find((attendance) =>
                                        attendance.StudentID === student.id &&
                                        attendance.UserID === lesson?.UserID &&
                                        attendance.LessonID === lesson.LessonID &&
                                        attendance.year === year &&
                                        attendance.month === month+1 &&
                                        attendance.day === day
                                    );

                                    let status1 = attendanceRecord?.Status || ""; // Եթե չկա գրառում, թող լինի ""

                                    return (
                                        <td key={index}>
                                            <button
                                                onClick={() => {
                                                    let newStatus;
                                                    if (status1 === "") newStatus = "բացակա";
                                                    else if (status1 === "բացակա") newStatus = "ներկա";
                                                    else newStatus = "";

                                                    toggleStatus(student.id, year, month, day, lesson?.UserID, lesson.LessonID, newStatus);
                                                }}
                                                style={{
                                                    width: '40px', // Ավելի հարմար չափ
                                                    height: '40px',
                                                    padding: "10px",
                                                    fontSize: "16px",
                                                    fontWeight: "bold",
                                                    border: "none",
                                                    borderRadius: "8px",
                                                    cursor: "pointer",
                                                    color: "white",
                                                    backgroundColor: status1 === "ներկա" ? "green" : status1 === "բացակա" ? "red" : "gray"
                                                }}
                                            >
                                                {status1 == 'ներկա' ? '+' : status1 == 'բացակա' ? '*': '' } {/* Ցուցադրում է "?" եթե դատարկ է */}
                                            </button>
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
