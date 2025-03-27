import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendance, addAttendanceRecord, deleteAttendanceRecord, updateAttendanceRecord } from '../../../Redux/AttendanceSlice';
import { fetchSchedule } from "../../../Redux/SheduleSlice.js";
import { fetchStudents } from "../../../Redux/StudentSlice";
import { useParams } from 'react-router-dom';
import { fetchLessons, fetchFaculties } from "../../../Redux/LessonsSlice";
import { fetchAssignment, addAssignmentRecord, updateAssignmentRecord, deleteAssignmentRecord } from '../../../Redux/AssignmentsSlice.js';
import { CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import "./Matyan.css"; // Import the CSS file
import { RiFontFamily } from 'react-icons/ri';

const Matyan = () => {
    const { data } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate()


    const lessons = useSelector((state) => state.lesson?.lessons);
    const attendanceList = useSelector((state) => state.attendance.attendanceList);
    const status = useSelector((state) => state.attendance.status);
    const error = useSelector((state) => state.attendance.error);
    const students = useSelector((state) => state.students?.list);
    const Employee = useSelector((state) => state.Employee);
    const schedule = useSelector((state) => state.schedule.schedule);
    const faculties = useSelector((state) => state.faculty?.list);
    const assignmentList = useSelector((state) => state.assignment.assignmentList)

    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [lesson, setLesson] = useState(null);
    const [attendanceData, setAttendanceData] = useState([])
    //JSON.parse(localStorage.getItem('month'))





    useEffect(() => {

        dispatch(fetchFaculties());
        dispatch(fetchSchedule());
        dispatch(fetchStudents());

        dispatch(fetchLessons());
        dispatch(fetchAttendance());
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
            day.periods.forEach((period, i) => {
                period.forEach((cls) => {
                    if (cls.professor === `${Employee.user.LastName} ${Employee.user.FirstName}`
                        && cls.course == faculties?.find(f => f.FacultyID === lesson?.FacultyID)?.Course
                        && cls.group_name === lesson?.group_) {

                        dayOfWeek.add(day.day + ' ' + (i + 1) + ' ' + cls.audience);
                    }
                });
            });
        });
        return [...dayOfWeek];
    };

    if (status === 'loading') return <p>Loading...</p>;
    if (status === 'failed') return <p>Error: {error}</p>;


    console.log(assignmentList)



    const getFilteredDays = (year, month, dayOfWeek) => {
        const filteredDays = [];
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const weekDays = ['Կիրակի', 'Երկուշաբթի', 'Երեքշաբթի', 'Չորեքշաբթի', 'Հինգշաբթի', 'Ուրբաթ', 'Շաբաթ'];

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayName = weekDays[date.getDay() - 3 < 0 ? date.getDay() + 4 : date.getDay() - 3];
            for (let i = 0; i < dayOfWeek.length; i++) {
                if (dayOfWeek[i].split(' ')[0] == dayName && (dayOfWeek[i].split(' ')[2] === 'Ամբողջական' || getWeekType(day, month, year) === dayOfWeek[i].split(' ')[2])) {

                    filteredDays.push(day + ' ' + dayOfWeek[i].split(' ')[1]);
                }
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




    const attChange = (studentId, year, month, day, periud, userId, lessonId, newStatus) => {

        const attendance = attendanceData?.find((att) =>
            att.StudentID === studentId &&
            att.UserID === userId &&
            att.LessonID === lessonId &&
            att.year == year &&
            att.month == month + 1 &&
            att.day == day &&
            att.periud == periud
        );

        if (!attendance) {

            setAttendanceData(
                (prev) => [...prev, {
                    StudentID: studentId,
                    UserID: userId,
                    LessonID: lessonId,
                    Status: newStatus,
                    year: year,
                    month: month + 1,
                    day: day,
                    periud: periud
                }]
            )
        } else {


            setAttendanceData((prev) =>
                prev.map((att) => {

                    if (att.StudentID === studentId &&
                        att.UserID === userId &&
                        att.LessonID === lessonId &&
                        att.year == year &&
                        att.month == month + 1 &&
                        att.day == day &&
                        att.periud == periud) {
                        return {
                            StudentID: studentId,
                            UserID: userId,
                            LessonID: lessonId,
                            Status: newStatus,
                            year: year,
                            month: month + 1,
                            day: day,
                            periud: periud
                        }
                    } else return att
                }
                )

            )

        }
    };


    const handleSave = async () => {


        const promises = attendanceData.map(async (attData) => {
            const attendance = attendanceList.find((att) => {
                return (
                    att.StudentID == attData.StudentID &&
                    att.UserID == attData.UserID &&
                    att.LessonID == attData.LessonID &&
                    att.year == attData.year &&
                    att.month == attData.month + 1 &&
                    att.day == +attData.day &&
                    att.periud == attData.periud)
            }
            );

            try {
                if (!attendance && attData.Status !== "") {

                    await dispatch(addAttendanceRecord({
                        StudentID: attData.StudentID,
                        UserID: attData.UserID,
                        LessonID: attData.LessonID,
                        Status: attData.Status,
                        year: attData.year,
                        month: attData.month + 1,
                        day: +attData.day,
                        periud: +attData.periud
                    })).unwrap();
                } else if (attendance) {

                    if (attData.Status === "") {
                        await dispatch(deleteAttendanceRecord(attendance.AttID)).unwrap();
                    } else {
                        await dispatch(updateAttendanceRecord({
                            id: attendance.AttID,
                            StudentID: attData.StudentID,
                            UserID: attData.UserID,
                            LessonID: attData.LessonID,
                            Status: attData.Status,
                            year: attData.year,
                            month: attData.month + 1,
                            day: +attData.day,
                            periud: +attData.periud
                        })).unwrap();
                    }
                }
            } catch (error) {
                console.error("Error updating attendance:", error);
            }
        });


        await Promise.all(promises);


        await dispatch(fetchAttendance()).unwrap();
    };

    function getWeekType(day, month, year) {

        const startDates = [
            new Date(year, 8, 1),
            new Date(year, 1, 10)
        ];
        const endDates = [
            new Date(year, 11, 30),
            new Date(year, 4, 30)
        ];

        const targetDate = new Date(year, month - 1, day);

        for (let i = 0; i < startDates.length; i++) {
            if (targetDate >= startDates[i] && targetDate <= endDates[i]) {
                const weekNumber = Math.floor((targetDate - startDates[i]) / (7 * 24 * 60 * 60 * 1000));
                return weekNumber % 2 === 0 ? "Համարիչ" : "Հայտարար";
            }
        }

        return "Ուսումնական շրջանից դուրս";
    }


    const semester = (day, month, year) => {

        const yearNow = new Date().getFullYear()
        const monthNow = new Date().getMonth()

        if (yearNow == year) {

            if (monthNow <= 4) {
                if (month <= 4 && month >= 1) {
                    if (month === 1) {
                        if (day >= 10) {
                            return true
                        }
                    }

                    return true
                }
            }
            else if (monthNow >= 8) {
                if (month <= 11 && month >= 8) {

                    return true

                }
            }
        }
        return false
    }

    console.log(semester(9, 3, 2025));
    const filteredDays = getFilteredDays(year, month, days());

    return (
        <div className='container'>
            <div style={{ padding: "24px", borderRadius: "12px" }}>
                <h1 style={{ fontSize: "34px", fontWeight: "600", color: "#121265" }}>{lesson?.Name || "Loading..."}</h1>
                <p style={{ fontSize: "22px", color: "#4b5563", marginBottom: '-50px' }}>
                    Կուրս <span style={{ color: "#5983bd", fontWeight: "600" }}>
                        {faculties.find(fac => fac.FacultyID === lesson?.FacultyID)?.Course + '   ' + lesson?.group_}
                    </span>
                </p>
                <div style={{ display: 'flex', justifyContent: 'end' }}>

                    <button className='savebut' onClick={handleSave}>Պահպանել</button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "24px" }}>
                    <div style={{ backgroundColor: "white", padding: "16px", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>



                        <label style={{ display: "block", color: "#374151", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>
                            Տարի
                        </label>
                        <select onChange={(e) => setYear(parseInt(e.target.value))} style={{ width: "100%", border: "1px solid #60a5fa", borderRadius: "8px", padding: "8px" }}>
                            <option value={year}>{year}</option>

                        </select>
                    </div>
                    <div style={{ backgroundColor: "white", padding: "16px", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
                        <label style={{ display: "block", color: "#374151", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>
                            Ամիս
                        </label>
                        <select value={month} onChange={(e) => { setMonth(parseInt(e.target.value)) }} style={{ width: "100%", border: "1px solid #60a5fa", borderRadius: "8px", padding: "8px" }}>
                            {semester(15, 1, year) ? <option value={2}>Փետրվար</option> : <></>}
                            {semester(15, 2, year) ? <option value={3}>Մարտ</option> : <></>}
                            {semester(15, 3, year) ? <option value={4}>Ապրիլ</option> : <></>}
                            {semester(15, 4, year) ? <option value={5}>Մայիս</option> : <></>}
                            {semester(15, 8, year) ? <option value={9}>Սեպտեմբեր</option> : <></>}
                            {semester(15, 9, year) ? <option value={10}>Հոկտեմբեր</option> : <></>}
                            {semester(15, 10, year) ? <option value={11}>Նոյեմբեր</option> : <></>}
                            {semester(15, 11, year) ? <option value={12}>Դեկտեմբեր</option> : <></>}
                        </select>
                    </div>
                </div>
            </div>

            <table border="1">
                <thead>
                    <tr>
                        <th style={{ width: '20px' }}>№</th>
                        <th style={{ width: '250px' }}>Ազգանուն Անուն Հայրանուն</th>
                        {filteredDays.map((day) => {

                            const jam = [0, '1/2', '3/4', '5/6', '7/8']

                            if (semester(Number(day.split(' ')[0]), month - 1, year)) {
                                return (
                                    <th key={day.split(' ')[0]}>{day.split(' ')[0]}/{month}/{year - 2000} <p style={{ fontSize: '14px', marginTop: '0px', height: '0px' }}> {`\n` + jam[day.split(' ')[1]]}</p></th>
                                )
                            }
                            else { navigate('not_found') }
                        })}
                        <th style={{ width: '10px', backgroundColor: 'rgb(192, 192, 192)', borderLeft: '2px solid black' }}>Ընդ. բաց.</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => {
                        let count = attendanceList.reduce((acc, attendance) => {
                            if (attendance.StudentID === student.id && attendance.Status === 'բացակա') {
                                return acc + 1;
                            }
                            return acc;
                        }, 0)
                        return (
                            student.course === faculties.find(fac => fac.FacultyID === lesson?.FacultyID)?.Course && filterStudents(student.group_, student.subgroup) && (
                                <tr key={student.recordNumber}>
                                    <td style={{ textAlign: 'center' }}>{student.recordNumber}</td>
                                    <td style={{ paddingLeft: '15px' }}>{student.firstName} {student.lastName} {student.patronymic}  </td>
                                    {filteredDays.map((day, index) => {
                                        if (semester(Number(day.split(' ')[0]), month - 1, year)) {

                                            let attendanceRecord = (attendanceData?.find((attData) => {


                                                return (
                                                    attData.StudentID === student.id &&
                                                    attData.UserID === lesson?.UserID &&
                                                    attData.LessonID === lesson.LessonID &&
                                                    attData.year === year &&
                                                    attData.month === month + 1 &&
                                                    attData.day == day.split(' ')[0] &&
                                                    attData.periud == 1 + Number(day.split(' ')[1])
                                                )
                                            }
                                            )) ??
                                                (attendanceList.find((attendanceL) => {



                                                    return (
                                                        attendanceL.StudentID === student.id &&
                                                        attendanceL.UserID === lesson?.UserID &&
                                                        attendanceL.LessonID === lesson.LessonID &&
                                                        attendanceL.year === year &&
                                                        attendanceL.month === month + 2 &&
                                                        attendanceL.day == day.split(' ')[0] &&
                                                        attendanceL.periud == 1 + Number(day.split(' ')[1])

                                                    )
                                                }
                                                ))

                                            let status1 = attendanceRecord?.Status || ""; // Եթե չկա գրառում, թող լինի ""

                                            return (
                                                <td key={index}>
                                                    <div className='box'>
                                                        <button
                                                            onClick={() => {
                                                                let newStatus;
                                                                if (status1 === "") newStatus = "բացակա";
                                                                else if (status1 === "բացակա") newStatus = "ներկա";
                                                                else newStatus = "";

                                                                attChange(student.id, year, month, day.split(' ')[0], 1 + Number(day.split(' ')[1]), lesson?.UserID, lesson.LessonID, newStatus);
                                                            }}
                                                            className='but'
                                                            style={{
                                                                fontSize: '15px',
                                                                backgroundColor: status1 === "ներկա" ? "rgb(50, 171, 13)" : status1 === "բացակա" ? "rgb(255, 27, 27)" : "rgb(193, 193, 193)"
                                                            }}
                                                        >
                                                            {status1 == 'ներկա' ? 'Ն' : status1 == 'բացակա' ? 'Բ' : ''} {/* Ցուցադրում է "?" եթե դատարկ է */}
                                                            {/* <CheckCircle />                 <XCircle /> */}
                                                        </button></div>




                                                </td>
                                            );
                                        }
                                    })}
                                    <td style={{ borderLeft: '2px solid black', fontWeight: 'bold', textAlign: 'center', backgroundColor: count * 2 > 120 ? 'red' : (count * 2 > 100 ? 'rgb(244, 79, 145)' : (count * 2 > 80 ? 'rgb(186, 92, 92)' : (count * 2 > 60 ? 'rgb(49, 108, 244)' : 'rgb(192, 192, 192)'))) }}>{2 * count}</td>
                                </tr>
                            )
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Matyan;