import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { fetchStudents } from "../../../Redux/StudentSlice";
import { fetchFaculties } from "../../../Redux/LessonsSlice";
import { fetchLessons } from "../../../Redux/LessonsSlice";
import { fetchdaysofexams } from "../../../Redux/Daysofexams";
import "./Course.css"
const Courses = () => {
  const navigate = useNavigate();
  const { page } = useParams()
  const students = useSelector((state) => state.students?.list);
  const faculties = useSelector((state) => state.faculty?.list);
  const lessons = useSelector((state) => state.lesson?.lessons);
  const daysofexams = useSelector((state) => state.daysofexams?.daysofexams);
  const dispatch = useDispatch();
 
  
  const uniqueCourses = (page === "Students" ? [...new Set(students.map(student => student.course))].sort((a, b) => a - b) : (page === "Lessons" ?
    [...new Set(lessons.map(lesson => faculties.find(fac => fac.FacultyID === lesson.FacultyID)?.Course))].sort((a, b) => a - b)
    : [...new Set(daysofexams.map(day => faculties.find(fac => fac.FacultyID === day.FacultyID)?.Course))].sort((a, b) => a - b)))

  const [addingCourse, setAddingCourse] = useState(false);
  const [newCourse, setNewCourse] = useState("");


 useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchFaculties());
    dispatch(fetchLessons());
    dispatch(fetchdaysofexams())

  }, [dispatch]);


  const handleAddCourse = () => {
    if (newCourse.trim() && !uniqueCourses.includes(parseInt(newCourse))) {
if(!(page === "daysofexams" && !(lessons.find((l) => l.FacultyID === faculties.find((f => f.Course === newCourse.trim())).FacultyID)))){
      page === 'Students' ? navigate(`/Students/${newCourse}`) : (page === "Lessons" ? navigate(`/Lessons/${newCourse}`) : navigate(`/daysofexams/${newCourse}`)) 
    }
    else{alert(newCourse.trim()+' կուրսը չունի գրանցված դասաժամ')}
    }
    setNewCourse("");
    setAddingCourse(false);
  };

  return (
    <div className="course-container">
      <h1 className="workspaceHeader">Ընտրեք կուրսը</h1>
      <div className="course-list">
        {uniqueCourses.map((course) => {
          return(
          <div key={course} className="course-item" onClick={() => page === 'Students' ? navigate(`/Students/${course}`) : (page === "Lessons" ? navigate(`/Lessons/${course}`) : navigate(`/Daysofexams/${course}`))}>
            <h4>{course}</h4>

          </div>
        )})}

        <div className="course-add">
          {addingCourse ? (
            <div className="course-add-form">

              <select onChange={(e) => setNewCourse(e.target.value)} className="course-input">
                <option value="">Կուրս</option>
                {faculties.map(fac => {

                  return(
                  !uniqueCourses.includes(fac.Course) ? <option key={fac.FacultyID} value={fac.Course}>{fac.Course}</option> : <></>
                )
                  
                  })}
              </select>
              <button className="add-btn" onClick={handleAddCourse}>
                Հաստատել
              </button>
              <button className="cancel-btn" onClick={() => setAddingCourse(false)}>
                Չեղարկել
              </button>
            </div>
          ) : (
            <button className="create-btn" onClick={() => setAddingCourse(true)}>
              Ավելացնել նոր կուրս<FaPlus className="plus-icon" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default Courses;
