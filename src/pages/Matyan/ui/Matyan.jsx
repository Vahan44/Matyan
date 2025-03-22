import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendance, addAttendanceRecord, deleteAttendanceRecord, updateAttendanceRecord } from '../../../Redux/AttendanceSlice';
import { fetchSchedule } from "../../../Redux/SheduleSlice.js";
import { fetchStudents } from "../../../Redux/StudentSlice";
import { useParams } from 'react-router-dom';
import { fetchLessons, fetchFaculties } from "../../../Redux/LessonsSlice";
import { fetchAssignment, addAssignmentRecord, updateAssignmentRecord, deleteAssignmentRecord } from '../../../Redux/AssignmentsSlice.js';

import "./Matyan.css"; // Import the CSS file
import { RiFontFamily } from 'react-icons/ri';

const Matyan = () => {
    const { data } = useParams();
    const dispatch = useDispatch();
    const [position, setPosition] = useState(0)
    useEffect(() => {
        const handleScroll = () => {
            setPosition(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Վերականգնում ենք scroll դիրքը
    useEffect(() => {
        const savedScrollPosition = position;
        if (savedScrollPosition !== null) {
            setTimeout(() => {
                window.scrollTo(0, parseInt(savedScrollPosition, 10));
            }, 100); // Ավելացնում ենք մի փոքր ուշացում՝ բովանդակության բեռնմանը սպասելու համար
        }
    }, []);
    // Redux state-ները
    const lessons = useSelector((state) => state.lesson?.lessons);
    const attendanceList = useSelector((state) => state.attendance.attendanceList);
    const status = useSelector((state) => state.attendance.status);
    const error = useSelector((state) => state.attendance.error);
    const students = useSelector((state) => state.students?.list);
    const Employee = useSelector((state) => state.Employee);
    const schedule = useSelector((state) => state.schedule.schedule);
    const faculties = useSelector((state) => state.faculty?.list);
    const assignmentList = useSelector((state) => state.assignment.assignmentList)

    // State-եր
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [lesson, setLesson] = useState(null);
    const [attendanceData, setAttendanceData] = useState([])
//JSON.parse(localStorage.getItem('month'))


  

        
    useEffect(() => {
        
        dispatch(fetchFaculties());
        dispatch(fetchSchedule());
        dispatch(fetchStudents());
        
        dispatch(fetchLessons()); // Ավելացված fetch
        dispatch(fetchAttendance());

        
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
            day.periods.forEach((period, i) => {
                period.forEach((cls) => {
                    if (cls.professor === `${Employee.user.LastName} ${Employee.user.FirstName}`
                        && cls.course == faculties?.find(f => f.FacultyID === lesson?.FacultyID)?.Course
                        && cls.group_name === lesson?.group_) {
                            
                        dayOfWeek.add(day.day+' '+(i+1));
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
            for(let i = 0; i < dayOfWeek.length; i++) {
                if (dayOfWeek[i].split(' ')[0] == dayName) {
                    filteredDays.push(day+' '+dayOfWeek[i].split(' ')[1]);
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




    const attChange =  (studentId, year, month, day, userId, lessonId, newStatus) => {
        
            const attendance = attendanceData?.find((att) =>
                att.StudentID === studentId &&
                att.UserID === userId &&
                att.LessonID === lessonId &&
                att.year == year &&
                att.month == month + 1 &&
                att.day == day
            );
    
            if (!attendance) {
                // Եթե գրառում չկա, ավելացնում ենք
                setAttendanceData(
                    (prev) => [...prev, { 
                            StudentID: studentId,
                        UserID: userId,
                        LessonID: lessonId,
                        Status: newStatus,
                        year: year,
                        month: month + 1,
                        day: day
                    }]
                    )
            } else {
                // Եթե գրառումը կա, ապա փոխում ենք
                 
                    setAttendanceData((prev) =>
                        prev.map((att) =>{
                            
                            if(att.StudentID === studentId &&
                                att.UserID === userId &&
                                att.LessonID === lessonId &&
                                att.year == year &&
                                att.month == month + 1 &&
                                att.day == day){
                                    return { 
                                        StudentID: studentId,
                                    UserID: userId,
                                    LessonID: lessonId,
                                    Status: newStatus,
                                    year: year,
                                    month: month + 1,
                                    day: day
                                }
                                }else return att
                        }
                    )
                        
                        )
                
            }
    };


    const handleSave = async () => {
        debugger;
        
        const promises = attendanceData.map(async (attData) => {
            const attendance = attendanceList.find((att) =>
                att.StudentID == attData.StudentID &&
                att.UserID == attData.UserID &&
                att.LessonID == attData.LessonID &&
                att.year == attData.year &&
                att.month == attData.month + 1 &&
                att.day == +attData.day
            );
    
            try {
                if (!attendance && attData.Status !== "") {
                    // Եթե գրառում չկա, ավելացնում ենք
                    await dispatch(addAttendanceRecord({
                        StudentID: attData.StudentID,
                        UserID: attData.UserID,
                        LessonID: attData.LessonID,
                        Status: attData.Status,
                        year: attData.year,
                        month: attData.month + 1,
                        day: attData.day
                    })).unwrap();
                } else if (attendance) {
                    // Եթե գրառումը կա, ապա կամ փոխում ենք կամ ջնջում
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
                            day: attData.day
                        })).unwrap();
                    }
                }
            } catch (error) {
                console.error("Error updating attendance:", error);
            }
        });
    
        // Սպասում ենք բոլոր գործողությունների ավարտին
        await Promise.all(promises);
    
        // Վերջում բեռնում ենք թարմացված տվյալները
        await dispatch(fetchAttendance()).unwrap();
    };
    
    

    const filteredDays = getFilteredDays(year, month, days());
    
    return (
        <div className='container'>
            <div style={{ padding: "24px", borderRadius: "12px" }}>
                <h1 style={{ fontSize: "34px", fontWeight: "600", color: "#1f2937" }}>{lesson?.Name || "Loading..."}</h1>
                <p style={{ fontSize: "22px", color: "#4b5563", marginBottom: '-50px'}}>
                    Կուրս <span style={{ color: "#a855f7", fontWeight: "600" }}>
                        {faculties.find(fac => fac.FacultyID === lesson?.FacultyID)?.Course + '   ' + lesson?.group_}
                    </span>
                </p>
                <div style={{display: 'flex', justifyContent: 'end'}}>
                    
                <button className = 'savebut'onClick={handleSave}>Պահպանել</button>
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
                        <select value = {month} onChange={(e) =>{localStorage.setItem('month',JSON.stringify(e.target.value)); setMonth(parseInt(e.target.value))}} style={{ width: "100%", border: "1px solid #60a5fa", borderRadius: "8px", padding: "8px" }}>
                            <option value={2}>Փետրվար</option>
                            <option value={3}>Մարտ</option>
                            <option value={4}>Ապրիլ</option>
                            <option value={5}>Մայիս</option>
                            <option value={9}>Սեպտեմբեր</option>
                            <option value={10}>Հոկտեմբեր</option>
                            <option value={11}>Նոյեմբեր</option>
                            <option value={12}>Դեկտեմբեր</option>
                        </select>
                    </div>
                </div>
            </div>

            <table border="1">
                <thead>
                    <tr>
                        <th style={{ width: '20px' }}>№</th>
                        <th style={{ width: '250px' }}>Ազգանուն Անուն Հայրանուն</th>
                        {filteredDays.map((day) =>{
                            const jam = ['1/2', '3/4', '5/6', '7/8']
                            return (
                            <th key={day.split(' ')[0]}>{day.split(' ')[0]}/{month}/{year - 2000} <p style={{fontSize: '14px', marginTop: '0px',height: '0px'}}> {`\n` + jam[day.split(' ')[1]] }</p></th>
                        )})}
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => {
                        let count =  attendanceList.reduce((acc, attendance) => {
                            if (attendance.StudentID === student.id && attendance.Status === 'բացակա') {
                                return acc + 1;
                            }
                            return acc;
                        }, 0)
                        return (
                        student.course === faculties.find(fac => fac.FacultyID === lesson?.FacultyID)?.Course && filterStudents(student.group_, student.subgroup) && (
                            <tr key={student.recordNumber}>
                                <td style={{ textAlign: 'center', backgroundColor: count > 120 ? 'red' : '' }}>{student.recordNumber}</td>
                                <td>{student.firstName} {student.lastName} {student.patronymic} 
                                  {'    '+count  }
                                </td>
                                {filteredDays.map((day, index) => {
                                    
                                    let attendanceRecord = (attendanceData?.find((attData) =>{
                                        
                                        console.log(attData.StudentID === student.id &&
                                            attData.UserID === lesson?.UserID &&
                                            attData.LessonID === lesson.LessonID &&
                                            attData.year === year &&
                                            attData.month === month +1    &&
                                            attData.day == day.split(' ')[0] 
                                            )
                                        return(
                                        attData.StudentID === student.id &&
                                        attData.UserID === lesson?.UserID &&
                                        attData.LessonID === lesson.LessonID &&
                                        attData.year === year &&
                                        attData.month === month +1    &&
                                        attData.day == day.split(' ')[0] )}
                                    )) ??
                                    (attendanceList.find((attendanceL) =>{
                                        debugger
                                        console.log(
                                            attendanceL.StudentID === student.id &&
                                            attendanceL.UserID === lesson?.UserID &&
                                            attendanceL.LessonID === lesson.LessonID &&
                                            attendanceL.year === year &&
                                            attendanceL.month === month +2    &&
                                            attendanceL.day == day.split(' ')[0] 
                                        )
                                    return(
                                        attendanceL.StudentID === student.id &&
                                        attendanceL.UserID === lesson?.UserID &&
                                        attendanceL.LessonID === lesson.LessonID &&
                                        attendanceL.year === year &&
                                        attendanceL.month === month +2    &&
                                        attendanceL.day == day.split(' ')[0] 
                                    )}
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

                                                    attChange(student.id, year, month, day.split(' ')[0], lesson?.UserID, lesson.LessonID, newStatus);
                                                }}
                                                className='but'
                                                style={{
                                                    
                                                    backgroundColor: status1 === "ներկա" ? "rgb(50, 171, 13)" : status1 === "բացակա" ? "rgb(255, 27, 27)" : "rgb(193, 193, 193)"
                                                }}
                                            >
                                                {status1 == 'ներկա' ? '+' : status1 == 'բացակա' ? '-': '' } {/* Ցուցադրում է "?" եթե դատարկ է */}
                                            </button></div>

                                                
                                            
                                            
                                        </td>
                                    );
                                })}

                            </tr>
                        )
                    )})}
                </tbody>
            </table>
        </div>
    );
};

export default Matyan;