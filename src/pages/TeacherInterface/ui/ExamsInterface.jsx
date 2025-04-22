import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { fetchLessons, fetchFaculties } from "../../../Redux/LessonsSlice";
import { fetchdaysofexams, adddaysofexams, updatedaysofexams, deletedaysofexams } from "../../../Redux/Daysofexams";

import styles from './TeacherInterface.module.css';

const ExamInterface = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const Employee = useSelector((state) => state.Employee);
    const daysofexams = useSelector((state) => state.daysofexams?.daysofexams);
    const faculties = useSelector((state) => state.faculty?.list); 
    const [lessonsData, setLessonsData] = useState([]);


    useEffect(() => {
        dispatch(fetchFaculties())
        dispatch(fetchdaysofexams())
    }, [dispatch]);
    
    useEffect(() => {
        setLessonsData(daysofexams.filter(day => day.UserID === Employee.user.UserID));
    }, [daysofexams, Employee]);


    const filterStudents = (group) => {
        switch (group?.[0]) {
            case 'Դ':
                return "Կիսամյակային քննություն";
            case 'Լ':
                return "Միջանկյալ քննություն";
            
            default:
                return false;
        }
    };
    const examTypes = ['Կիսամյակային քննություն','Առաջին միջանկյալ քննություն', 'Երկրորդ միջանկյալ քննություն']



    function isInCurrentWeek(day, month, year) {
        const inputDate = new Date(year, month - 1, day);
    
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
                />
                <p>{Employee.user.FirstName} {Employee.user.LastName} {Employee.user.Role === "Ադմինիստրատոր" ? "Ադմինիստրատոր" : "Դասախոս"}</p>
            </div>
            <h4 className={styles.h4}>Քննություններ</h4>
            <hr />
            <ul className={styles.boards}>
                {lessonsData.map(( {id, day, month, year,UserID, Name, FacultyID, group_, midNum} ) =>(
                    <>
                        {semester(day, month, year) ?
                        <li key = {id} className={styles.Bli} style={{backgroundColor: isInCurrentWeek(day, month, year) ? '': '#98b1d5'}}onClick={() => isInCurrentWeek(day, month, year) ? navigate(`/Exam/${id}`) : navigate(`/Exam/${id}`)}>
                            
                            <div className={styles.board} >
                                <h3>{Name}</h3>
                                <h4>{`${day}/${month}/${year}`}</h4>
                                <h4>{ faculties.find(fac => fac.FacultyID === FacultyID)?.Course +  (group_!=0?'-'+group_:'')+' '+ examTypes[+midNum] }
                              
                                </h4>
                                {!isInCurrentWeek(day, month, year) ? <h1 style={{position: "absolute", color: 'black', paddingTop: '20px', fontSize: '35px'}}>Հասանելի չէ</h1> : <></>}
                            </div>
                        </li> : <></>
}
                    </>
                ) )}
                
            </ul>
        </div>
    );
};

export default ExamInterface;