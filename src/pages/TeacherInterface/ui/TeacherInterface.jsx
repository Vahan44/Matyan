import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RiArrowDropDownLine } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { useState, useEffect } from "react";
import { fetchLessons, addLesson, updateLesson, deleteLesson, fetchFaculties } from "../../../Redux/LessonsSlice";
import styles from './TeacherInterface.module.css';

const TeacherInterface = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const Employee = useSelector((state) => state.Employee);
    const lessons = useSelector((state) => state.lesson?.lessons);
    const employees = useSelector((state) => state.employees?.list);
    const faculties = useSelector((state) => state.faculty?.list); 
    const [lessonsData, setLessonsData] = useState([]);
    const [addingLesson, setAddingLesson] = useState(false);
    const [newLessonName, setNewLessonName] = useState("");

    useEffect(() => {
        dispatch(fetchLessons());
        dispatch(fetchFaculties())
    }, [dispatch]);
    
    useEffect(() => {
        setLessonsData(lessons.filter(lesson => lesson.UserID === Employee.user.UserID));
    }, [lessons, Employee]);





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
            <h4 className={styles.h4}>Ձեր առարկաները</h4>
            <hr />
            <ul className={styles.boards}>
                {lessonsData.map(( {LessonID,UserID, Name, FacultyID, group_} ) => (
                    <>
                        
                        <li key = {LessonID} className={styles.Bli} onClick={() => navigate(`/Matyan/${LessonID}`)}>
                            
                            <div className={styles.board} >
                                <h3>{Name}</h3>
                                <h4>{faculties.find(fac => fac.FacultyID === FacultyID)?.Course + '   ' + group_}    
                              
                                </h4>
                            </div>
                        </li>
                    </>
                ))}
                
            </ul>
        </div>
    );
};

export default TeacherInterface;