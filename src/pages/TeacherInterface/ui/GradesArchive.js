import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { fetchLessons, fetchFaculties } from "../../../Redux/LessonsSlice";
import { fetchdaysofexams, adddaysofexams, updatedaysofexams, deletedaysofexams } from "../../../Redux/Daysofexams";
import { fetchEmployees } from "../../../Redux/Employees";
import { fetchExamGrade } from "../../../Redux/ExamGrade";
import styles from './TeacherInterface.module.css';

const GradeArchive = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const Employee = useSelector((state) => state.Employee);
    const daysofexams = useSelector((state) => state.daysofexams?.daysofexams);
    const ExamGradeList = useSelector((state) => state.ExamGrade.ExamGradeList)
      const employees = useSelector((state) => state.employees?.list);
    
    const faculties = useSelector((state) => state.faculty?.list);
    const [lessonsData, setLessonsData] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear())
    useEffect(() => {
        dispatch(fetchFaculties())
        dispatch(fetchdaysofexams())
        dispatch(fetchExamGrade())
        dispatch(fetchEmployees())

    }, [dispatch]);

    useEffect(() => {
        setLessonsData(daysofexams.filter(day => day.year == year && day.midNum == 0 && ExamGradeList.find(grade => grade.DayID === day.id)));

    }, [ExamGradeList, daysofexams, year]);





    console.log(year)
    
    const examTypes = ['Կիսամյակային քննություն', 'Առաջին միջանկյալ քննություն', 'Երկրորդ միջանկյալ քննություն']



    
    const semester = (day, month, year) => {

        const yearNow = new Date().getFullYear()
        const monthNow = new Date().getMonth()

        if (yearNow == year) {

            if (monthNow <= 5) {
                if (month <= 5 && month >= 2) {
                    if (month === 2) {
                        if (day >= 10) {
                            return true
                        }
                    }

                    return true
                }
            }
            else if (monthNow >= 9) {
                if (month <= 12 && month >= 9) {

                    return true

                }
            }
        }
        return false
    }



    return (
        <div className={styles.workspaces}>
            <div className={styles.workspaceHeader}>
                <img
                    src={'https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg'}
                    alt=''
                    loading="lazy"
                />
                <p>{Employee.user.FirstName} {Employee.user.LastName} {Employee.user.Role === "Ադմինիստրատոր" ? "Ադմինիստրատոր" : "Դասախոս"}</p>
            </div>
            <h4 className={styles.h4}>Քննություններ</h4>
            <hr />
            <div style={{ backgroundColor: "white", padding: "16px", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>



                <label style={{ display: "block", color: "#374151", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>
                    Տարի
                </label>
                <select value={year} onChange={(e) => setYear(parseInt(e.target.value))} style={{ width: "100%", border: "1px solid #60a5fa", borderRadius: "8px", padding: "8px" }}>
                    {
                        [2024, 2025, 2026, 2027, 2028, 2029, 2030].map((i) => {
                            
                            if (i <= +(new Date().getFullYear())) {
                                return <option value={i}>{i}</option>
                            }
                            return <></>
                        })
                    }

                </select>
            </div>
            <ul className={styles.boards}>
                {lessonsData.map(({ id, day, month, year, UserID, Name, FacultyID, group_, midNum }) => (
                    <>
                        {semester(day, month, year) ?
                            <li key={id} className={styles.Bli} onClick={() => navigate(`/Exam/${id}`)}>

                                <div className={styles.board} >
                                    <h3 style={{height: '5px'}}>{Name}</h3>
                                    <h4 style={{height: '5px'}}>{`${day}/${month}/${year}`}</h4>
                                    <h4 style={{height: '5px'}}>{employees.find(e => e.UserID === UserID)?.FirstName + ' ' + employees.find(e => e.UserID === UserID)?.LastName}</h4>
                                    <h4 >{faculties.find(fac => fac.FacultyID === FacultyID)?.Course + (group_ != 0 ? '-' + group_ : '') + ' ' + examTypes[+midNum]}</h4>
                                </div>
                            </li> : <></>
                        }
                    </>
                ))}

            </ul>
        </div>
    );
};

export default GradeArchive;