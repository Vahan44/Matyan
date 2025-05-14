import React, { lazy, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents } from "../../../Redux/StudentSlice";
import { useParams } from 'react-router-dom';
import { fetchLessons, fetchFaculties } from "../../../Redux/LessonsSlice";
import { fetchAssignment } from '../../../Redux/AssignmentsSlice.js';
import { fetchAttendance } from '../../../Redux/AttendanceSlice.js';
import { useNavigate } from 'react-router-dom';
import { fetchExamGrade, addExamGradeRecord, updateExamGradeRecord, deleteExamGradeRecord } from '../../../Redux/ExamGrade.js';
import { fetchdaysofexams } from '../../../Redux/Daysofexams.js';
import "./Qnnutyunner.css"; // Import the CSS file

const Qnnutyun = () => {
    const { data } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate()


    const lessons = useSelector((state) => state.lesson?.lessons);
    const daysofexams = useSelector((state) => state.daysofexams?.daysofexams);
    const students = useSelector((state) => state.students?.list);
    const faculties = useSelector((state) => state.faculty?.list);
    const assignmentList = useSelector((state) => state.assignment.assignmentList)
    const attendanceList = useSelector((state) => state.attendance.attendanceList);
    const ExamGradeList = useSelector((state) => state.ExamGrade.ExamGradeList)
    const user = useSelector((state) => {
        return state.Employee
      })
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [lesson, setLesson] = useState(null);
    const [assignmentData, setAssignmentData] = useState([])
    





    useEffect(() => {

        dispatch(fetchFaculties());
        dispatch(fetchStudents());
        dispatch(fetchExamGrade())
        dispatch(fetchLessons());
        dispatch(fetchAssignment())
        dispatch(fetchAttendance())
        dispatch(fetchdaysofexams())

    }, [dispatch]);

    useEffect(() => {
        if (daysofexams.length > 0) {
            const selectedLesson = daysofexams.find(d => d.id == data);
            setLesson(selectedLesson || {});
        }

    }, [daysofexams, data]);





    const assChange2 = (studentId, dayID, Grade) => {
        
        if (lesson.group_ != 0 ? Grade >= 0 && Grade <= 4 : Grade >= 0 && Grade <= 60) {
            const assignment = assignmentData?.find((ass) =>
                ass.StudentID === studentId &&
                ass.DayID === dayID

            );

            if (!assignment) {

                setAssignmentData(
                    (prev) => [...prev, {
                        StudentID: studentId,
                        DayID: dayID,
                        Grade: +Grade

                    }]
                )
            } else {


                setAssignmentData((prev) =>
                    prev.map((ass) => {

                        if (ass.StudentID === studentId &&
                            ass.DayID === dayID) {
                            return {
                                StudentID: studentId,
                                DayID: dayID,
                                Grade: +Grade,
                            }
                        } else return ass
                    }
                    )

                )

            }
        } else (alert(`Գնահատականը կարող է լինել ${lesson.grade_ == 0 ? '0 - 60' : '0 - 4'}`))
    };


    const handleSave = async () => {

        const assignmentPromises2 = assignmentData.map(async (assData) => {
            const assignment = ExamGradeList.find((ass) => {
                return (
                    ass.StudentID == assData.StudentID &&
                    ass.DayID == assData.DayID
                )
            }
            );

            try {
                if (!assignment) {

                    await dispatch(addExamGradeRecord({
                        StudentID: assData.StudentID,
                        DayID: assData.DayID,
                        Grade: +assData?.Grade

                    })).unwrap();
                } else if (assignment) {


                    await dispatch(updateExamGradeRecord({
                        id: assignment.ExapmGradeID,
                        StudentID: assData.StudentID,
                        DayID: assData.DayID,
                        Grade: +assData?.Grade
                    })).unwrap();

                }
            } catch (error) {
                console.error("Error updating ExamGrade:", error);
            }
        }
        );

        await Promise.all([...assignmentPromises2]);

        await dispatch(fetchExamGrade()).unwrap();
    };




    console.log(ExamGradeList)

    // const filterStudents = (group) => {
    //     switch (group?.[0]) {
    //         case 'Դ':
    //             return "Կիսամյակային քննություն";
    //         case 'Լ':
    //             return "Միջանկյալ քննություն";

    //         default:
    //             return false;
    //     }
    // };
    const examTypes = ['Կիսամյակային քննություն', 'Առաջին միջանկյալ քննություն', 'Երկրորդ միջանկյալ քննություն']

    function isInCurrentWeek(data) {

        const inputDate = new Date(lesson?.year, lesson?.month - 1, lesson?.day);

        const now = new Date();

        // Get the current week's start (Monday) and end (Sunday)
        const currentDay = now.getDay();
        const diffToMonday = (currentDay + 6) % 7; // because Sunday is 0, Monday is 1, ...
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - diffToMonday);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        return inputDate >= startOfWeek && inputDate <= endOfWeek;
    }
    const prevGrades = (studentid) => {
        
        if (lesson.month >= 2 && lesson.month <= 8) {
            if (lesson.midNum == 1) {
                return assignmentList.reduce((acc, ass) => {
                    
                    if (ass.StudentID === studentid &&
                        lessons.find((l) => l.LessonID === ass.LessonID).Name === lesson.Name &&
                        ass.Status == 'հանձնված'
                    ) {
                        if (ass.month - 1 >= 2 && ass.month - 1 <= lesson.month && ass.year == lesson.year) {
                            if (ass.month - 1 == 2) {
                                if (ass.day >= 10) {
                                    return acc + Number(ass.Grade)
                                }
                                return acc
                            }
                            else if (ass.month - 1 == lesson.month) {
                                if (ass.day <= lesson.day) {
                                    return acc + Number(ass.Grade)
                                }
                                return acc
                            }
                            else {
                                return acc + Number(ass.Grade)
                            }
                        }else return acc

                    } else return acc
                }, 0)
            }
            else if (lesson.midNum == 2) {
                return assignmentList.reduce((acc, ass) => {
                    
                    if (ass.StudentID == studentid &&
                        lessons.find((l) => l.LessonID === ass.LessonID).Name === lesson.Name &&
                        ass.Status == 'հանձնված'
                    ) {
                        
                        let lesson1 = daysofexams.find((day => day.year == lesson.year &&
                            day.month >= 2 && day.month <= 5 &&
                            day.Name === lesson.Name &&
                            day.FacultyID === lesson.FacultyID &&
                            day.UserID === lesson.UserID &&
                            day.midNum == 1
                        ))
                        if (ass.month - 1 >= lesson1.month && ass.month - 1 <= lesson.month && ass.year == lesson.year) {
                            if (ass.month - 1 == lesson1.month) {
                                if (ass.day >= lesson1.day) {
                                    
                                    return acc + Number(ass.Grade)
                                }
                                return acc

                            }
                            else if (ass.month - 1 == lesson.month) {
                                if (ass.day <= lesson.day) {
                                    return acc + Number(ass.Grade)
                                }
                                return acc

                            }
                            else {
                                return acc + Number(ass.Grade)
                            }
                        }else return acc

                    } else return acc
                }, 0)
            }
            else if (lesson.midNum == 0) {
                let lesson1 = daysofexams.find((day => day.year == lesson.year &&
                    day.month >= 2 && day.month <= 8 &&
                    day.Name === lesson.Name &&
                    day.FacultyID === lesson.FacultyID &&
                    day.UserID === lesson.UserID &&
                    day.midNum == 1
                ))

                let lesson2 = daysofexams.find((day => day.year == lesson.year &&
                    day.month >= 2 && day.month <= 8 &&
                    day.Name === lesson.Name &&
                    day.FacultyID === lesson.FacultyID &&
                    day.UserID === lesson.UserID &&
                    day.midNum == 2
                ))

                const mid1 = assignmentList.reduce((acc, ass) => {
                    
                    if (ass.StudentID === studentid &&
                        lessons.find((l) => l.LessonID === ass.LessonID).Name === lesson1.Name &&
                        ass.Status == 'հանձնված'
                    ) {
                        if (ass.month - 1 >= 2 && ass.month - 1 <= lesson1.month && ass.year == lesson1.year) {
                            if (ass.month - 1 == 2) {
                                if (ass.day >= 10) {
                                    return acc + Number(ass.Grade)
                                }
                                return acc
                            }
                            else if (ass.month - 1 == lesson1.month) {
                                if (ass.day <= lesson1.day) {
                                    return acc + Number(ass.Grade)
                                }
                                return acc
                            }
                            else {
                                return acc + Number(ass.Grade)
                            }
                        }else return acc

                    } else return acc
                }, 0)

                const mid2 = assignmentList.reduce((acc, ass) => {
                    
                    if (ass.StudentID == studentid &&
                        lessons.find((l) => l.LessonID === ass.LessonID).Name === lesson2.Name &&
                        ass.Status == 'հանձնված'
                    ) {
                        
                        if (ass.month - 1 >= lesson1.month && ass.month - 1 <= lesson2.month && ass.year == lesson2.year) {
                            if (ass.month - 1 == lesson1.month) {
                                if (ass.day >= lesson1.day) {
                                    
                                    return acc + Number(ass.Grade)
                                }
                                return acc

                            }
                            else if (ass.month - 1 == lesson2.month) {
                                if (ass.day <= lesson2.day) {
                                    return acc + Number(ass.Grade)
                                }
                                return acc

                            }
                            else {
                                return acc + Number(ass.Grade)
                            }
                        }else return acc

                    } else return acc
                }, 0)

                let grade11 = ExamGradeList.find(grade => grade.DayID == lesson1.id && grade.StudentID == studentid)?.Grade || 0
                let grade12 = ExamGradeList.find(grade => grade.DayID == lesson2.id && grade.StudentID == studentid)?.Grade || 0
                return Number(grade11) + mid1 + Number(grade12) + mid2
            }
        } else if ((lesson.month >= 9 && lesson.month <= 12) || lesson.month == 1) {
            //     երկրորդ սեմեստր
            if (lesson.midNum == 1) {
                return assignmentList.reduce((acc, ass) => {
                    if (ass.StudentID === studentid &&
                        lessons.find((l) => l.LessonID === ass.LessonID).Name === lesson.Name &&
                        ass.Status == 'հանձնված'
                    ) {
                        if (ass.month - 1 >= 9 && ass.month - 1 <= lesson.month && ass.year == lesson.year) {
                            if (ass.month - 1 == lesson.month) {
                                if (ass.day <= lesson.day) {
                                    return acc + Number(ass.Grade)
                                }
                                return acc
                            }
                            else {
                                return acc + Number(ass.Grade)
                            }
                        }else return acc

                    } else return acc
                }, 0)
            }
            else if (lesson.midNum == 2) {
                return assignmentList.reduce((acc, ass) => {
                    if (ass.StudentID === studentid &&
                        lessons.find((l) => l.LessonID === ass.LessonID).Name === lesson.Name &&
                        ass.Status == 'հանձնված'
                    ) {

                        let lesson1 = daysofexams.find((day => day.year == lesson.year &&
                            ((day.month >= 9 && day.month <= 12) || day.month == 1) &&
                            day.Name === lesson.Name &&
                            day.FacultyID === lesson.FacultyID &&
                            day.UserID === lesson.UserID &&
                            day.midNum == 1
                        ))
                        if (ass.month - 1 >= lesson1.month && ass.month - 1 <= lesson.month && ass.year == lesson.year) {
                            if (ass.month - 1 == lesson1.month) {
                                if (ass.day >= lesson1.day) {
                                    return acc + Number(ass.Grade)
                                }
                                return acc
                            }
                            else if (ass.month - 1 == lesson.month) {
                                if (ass.day <= lesson.day) {
                                    return acc + Number(ass.Grade)
                                }
                                return acc
                            }
                            else {
                                return acc + Number(ass.Grade)
                            }
                        }else return acc

                    } else return acc
                }, 0)
            }
            else if (lesson.midNum == 0) {
                let lesson1 = daysofexams.find((day => day.year == lesson.year &&
                    ((day.month >= 9 && day.month <= 12) || day.month == 1) &&
                    day.Name === lesson.Name &&
                    day.FacultyID === lesson.FacultyID &&
                    day.UserID === lesson.UserID &&
                    day.midNum == 1
                ))

                let lesson2 = daysofexams.find((day => day.year == lesson.year &&
                    ((day.month >= 9 && day.month <= 12) || day.month == 1) &&
                    day.Name === lesson.Name &&
                    day.FacultyID === lesson.FacultyID &&
                    day.UserID === lesson.UserID &&
                    day.midNum == 2
                ))

                const mid1 = assignmentList.reduce((acc, ass) => {
                    if (ass.StudentID === studentid &&
                        lessons.find((l) => l.LessonID === ass.LessonID).Name === lesson1.Name &&
                        ass.Status == 'հանձնված'
                    ) {
                        if (ass.month - 1 >= 9 && ass.month - 1 <= lesson1.month && ass.year == lesson1.year) {
                            if (ass.month - 1 == lesson1.month) {
                                if (ass.day <= lesson1.day) {
                                    return acc + Number(ass.Grade)
                                }
                                return acc
                            }
                            else {
                                return acc + Number(ass.Grade)
                            }
                        }else return acc

                    } else return acc
                }, 0)

                const mid2 = assignmentList.reduce((acc, ass) => {
                    if (ass.StudentID === studentid &&
                        lessons.find((l) => l.LessonID === ass.LessonID).Name === lesson2.Name &&
                        ass.Status == 'հանձնված'
                    ) {

                        
                        if (ass.month - 1 >= lesson1.month && ass.month - 1 <= lesson2.month && ass.year == lesson2.year) {
                            if (ass.month - 1 == lesson1.month) {
                                if (ass.day >= lesson1.day) {
                                    return acc + Number(ass.Grade)
                                }
                                return acc
                            }
                            else if (ass.month - 1 == lesson2.month) {
                                if (ass.day <= lesson2.day) {
                                    return acc + Number(ass.Grade)
                                }
                                return acc
                            }
                            else {
                                return acc + Number(ass.Grade)
                            }
                        }else return acc

                    } else return acc
                }, 0)

                let grade1 = ExamGradeList.find(grade => grade.DayID == lesson1.id)?.Grade || 0
                let grade2 = ExamGradeList.find(grade => grade.DayID == lesson2.id)?.Grade || 0
                return Number(grade1) + mid1 + Number(grade2) + mid2
            }

        }
        else {
            console.error('Քննության օրերը ոչ աշխատանքային է')
            return 'else'
        }

    }


    const prevGrades2 = (studentid) => {
        
        if (lesson.month >= 2 && lesson.month <= 8) {
            if (lesson.midNum == 1) {
                return assignmentList.reduce((acc, ass) => {
                    
                    
                    if (ass.StudentID === studentid &&
                        lessons.find((l) => l.LessonID === ass.LessonID).Name === lesson.Name &&
                        ass.Status == 'կատարված'
                    ) {
                        if (ass.month - 1 >= 2 && ass.month - 1 <= lesson.month && ass.year == lesson.year) {
                            if (ass.month - 1 == 2) {
                                if (ass.day >= 10) {
                                    return acc += 1
                                }
                                return acc
                            }
                            else if (ass.month - 1 == lesson.month) {
                                if (ass.day <= lesson.day) {
                                    return acc += 1
                                }
                                return acc
                            }
                            else {
                                return acc += 1
                            }
                        }else return acc

                    } else return acc
                }, 0)
            }
            else if (lesson.midNum == 2) {
                return assignmentList.reduce((acc, ass) => {
                    
                    if (ass.StudentID == studentid &&
                        lessons.find((l) => l.LessonID === ass.LessonID).Name === lesson.Name &&
                        ass.Status == 'կատարված'
                    ) {
                        
                        let lesson1 = daysofexams.find((day => day.year == lesson.year &&
                            day.month >= 2 && day.month <= 5 &&
                            day.Name === lesson.Name &&
                            day.FacultyID === lesson.FacultyID &&
                            day.UserID === lesson.UserID &&
                            day.midNum == 1
                        ))
                        if (ass.month - 1 >= lesson1.month && ass.month - 1 <= lesson.month && ass.year == lesson.year) {
                            if (ass.month - 1 == lesson1.month) {
                                if (ass.day >= lesson1.day) {
                                    
                                    return acc += 1
                                }
                                return acc

                            }
                            else if (ass.month - 1 == lesson.month) {
                                if (ass.day <= lesson.day) {
                                    return acc += 1
                                }
                                return acc

                            }
                            else {
                                return acc += 1
                            }
                        }else return acc

                    } else return acc
                }, 0)
            }
            
        } 
        else if ((lesson.month >= 9 && lesson.month <= 12) || lesson.month == 1) {
            //     երկրորդ սեմեստր
            if (lesson.midNum == 1) {
                return assignmentList.reduce((acc, ass) => {
                    if (ass.StudentID === studentid &&
                        lessons.find((l) => l.LessonID === ass.LessonID).Name === lesson.Name &&
                        ass.Status == 'կատարված'
                    ) {
                        if (ass.month - 1 >= 9 && ass.month - 1 <= lesson.month && ass.year == lesson.year) {
                            if (ass.month - 1 == lesson.month) {
                                if (ass.day <= lesson.day) {
                                    return acc += 1
                                }
                                return acc
                            }
                            else {
                                return acc += 1
                            }
                        }else return acc

                    } else return acc
                }, 0)
            }
            else if (lesson.midNum == 2) {
                return assignmentList.reduce((acc, ass) => {
                    if (ass.StudentID === studentid &&
                        lessons.find((l) => l.LessonID === ass.LessonID).Name === lesson.Name &&
                        ass.Status == 'կատարված'
                    ) {

                        let lesson1 = daysofexams.find((day => day.year == lesson.year &&
                            ((day.month >= 9 && day.month <= 12) || day.month == 1) &&
                            day.Name === lesson.Name &&
                            day.FacultyID === lesson.FacultyID &&
                            day.UserID === lesson.UserID &&
                            day.midNum == 1
                        ))
                        if (ass.month - 1 >= lesson1.month && ass.month - 1 <= lesson.month && ass.year == lesson.year) {
                            if (ass.month - 1 == lesson1.month) {
                                if (ass.day >= lesson1.day) {
                                    return acc += 1
                                }
                                return acc
                            }
                            else if (ass.month - 1 == lesson.month) {
                                if (ass.day <= lesson.day) {
                                    return acc += 1
                                }
                                return acc
                            }
                            else {
                                return acc += 1
                            }
                        }else return acc

                    } else return acc
                }, 0)
            }
            
        }
        else {
            console.error('Քննության օրերը ոչ աշխատանքային է')
            return 'else'
        }

    }


    return (
        <div className='container' >
            {isInCurrentWeek(data) || user.user.Role === "Ադմինիստրատոր" ? (<>
                <div style={{ padding: "24px", borderRadius: "12px" }}>
                    <h1 style={{ fontSize: "34px", fontWeight: "600", color: "#121265" }}>{lesson?.Name || "Loading..."}</h1>
                    <h2 style={{ color: "#223f6f", fontWeight: "600" }}>{`${lesson?.day}/${lesson?.month}/${lesson?.year}`}</h2>
                    <p style={{ fontSize: "22px", color: "#4b5563", marginBottom: '-50px' }}>
                        <span style={{ color: "#5983bd", fontWeight: "600" }}>
                            {faculties.find(fac => fac.FacultyID === lesson?.FacultyID)?.Course + (lesson?.group_ != 0 ? '-' + lesson?.group_ : '') + ' ' + examTypes[lesson?.midNum]}
                        </span>
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                        <button className='savebut' onClick={handleSave}>Պահպանել</button>
                    </div>


                </div>

                <table border="1" >
                    <thead>
                        <tr>
                            <th style={{ width: '20px' }}>№</th>
                            <th style={{ width: '250px' }}>Ազգանուն Անուն Հայրանուն</th>
                            <th>{lesson?.midNum == 0 ? 'Միջ. քնն. գնահատականներ' : `Լաբ. աշխ. հանձնում.`}</th>
                            {lesson?.midNum != 0 ? <th>{"Լաբ. աշխ. կատարումների քանակ"}</th> : <></>}
                            {[1].map(() => {
                                const Day = daysofexams.find((d) => {

                                    return d.id == data
                                })
                                return (<th>
                                    <p>{lesson?.midNum != 0 ? "Միջանկյալ քննության գնահատականներ":"Կիսամյակային քննության գնահատականներ"}</p>
                                </th>)
                            })}
                            {user.user.Role === "Ադմինիստրատոր"?<th style={{ width: '100px' }}>Ընդհանուր գնահատական</th> : <></>}
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
                                student.course === faculties.find(fac => fac.FacultyID === lesson?.FacultyID)?.Course && (lesson?.group_ != 0 ? student.subgroup == lesson?.group_ : true) && (
                                    <tr key={student.recordNumber}>
                                        <td style={{ textAlign: 'center' }}>{student.recordNumber}</td>
                                        <td style={{ paddingLeft: '15px' }}>{student.firstName} {student.lastName} {student.patronymic}  </td>
                                        {[1].map((day, index) => {



                                            let handznumRecord = assignmentData.find((assData) => {
                                                return (
                                                    assData.StudentID === student.id &&
                                                    assData.DayID == data
                                                )
                                            }) ??
                                                ExamGradeList.find((assList) => {
                                                    return (
                                                        assList.StudentID === student.id &&
                                                        assList.DayID == data

                                                    )
                                                })





                                            return (
                                                <>
                                                    <td>
                                                        <div style={{ textAlign: 'center' }}>{prevGrades(student.id)}</div>
                                                    </td>

                                                    {lesson?.midNum != 0 ? 
                                                    <td style={{ textAlign: 'center' }}>{prevGrades2(student.id)}</td> : <></>}

                                                    <td >
                                                        <div className='box'>
                                                            {handznumRecord?.Grade && user.user.Role === "Դասախոս" ? <p style={{marginRight: '-28px', zIndex: '100', fontSize: '15px'}}>{lesson.group_ == 0 ? '60' : '4'}/</p> : <></>}
                                                            {user.user.Role === "Ադմինիստրատոր" ? <p>{handznumRecord?.Grade || ''}</p> : <input
                                                                style={{ margin: '3px', fontSize: '12px' , textAlign: 'end'}}
                                                                className='grade2'
                                                                min='0' max={lesson.group_ == 0 ? '60' : '4'}
                                                                type='number'
                                                                value={handznumRecord?.Grade}
                                                                onChange={(e) => {
                                                                    assChange2(student.id, lesson.id, e.target.value);
                                                                }}
                                                            >

                                                            </input>}
                                                        </div>

                                                    </td>

                                                    {user.user.Role === "Ադմինիստրատոր"? handznumRecord?.Grade ? <td style={{textAlign: 'center'}}>
                                                        {Number(prevGrades(student.id)) + Number(handznumRecord?.Grade || 0)}
                                                    </td> : <td></td> : <></>}

                                                </>
                                            );

                                        })}
                                        <td style={{ borderLeft: '2px solid black', fontWeight: 'bold', textAlign: 'center', backgroundColor: count * 2 > 120 ? 'red' : (count * 2 > 100 ? 'rgb(244, 79, 145)' : (count * 2 > 80 ? 'rgb(186, 92, 92)' : (count * 2 > 60 ? 'rgb(49, 108, 244)' : 'rgb(192, 192, 192)'))) }}>{2 * count}</td>
                                    </tr>
                                )
                            )
                        })}
                    </tbody>
                </table></>) : <h1>Դուք չեք կարող գնհատել այսօր !</h1>}
        </div>
    );
};

export default Qnnutyun;