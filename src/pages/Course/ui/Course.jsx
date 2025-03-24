import { useState, useEffect } from "react";
import { useSelector , useDispatch} from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { fetchStudents } from "../../../Redux/StudentSlice";
import { fetchFaculties } from "../../../Redux/LessonsSlice";
import { fetchLessons } from "../../../Redux/LessonsSlice";

import "./Course.css"
const Courses = () => {
  const navigate = useNavigate();
  const {page} = useParams()
  const students = useSelector((state) => state.students?.list);
  const faculties = useSelector((state) => state.faculty?.list);
  const lessons = useSelector((state) => state.lesson?.lessons);
  const dispatch = useDispatch();
  useEffect(() => {
      dispatch(fetchStudents());
      dispatch(fetchFaculties());
      dispatch(fetchLessons());
    }, [dispatch]);
  // Ստանում ենք առկա կուրսերի ցանկը
  const uniqueCourses =( page === "Students" ? [...new Set(students.map(student => student.course))].sort((a, b) => a - b):
  [...new Set(lessons.map(lesson => faculties.find(fac => fac.FacultyID === lesson.FacultyID)?.Course))].sort((a, b) => a - b))
  
  const [addingCourse, setAddingCourse] = useState(false);
  const [newCourse, setNewCourse] = useState("");

  const handleAddCourse = () => {
    if (newCourse.trim() && !uniqueCourses.includes(parseInt(newCourse))) {
      page === 'Students' ?  navigate(`/Students/${newCourse}`) : navigate(`/Lessons/${newCourse}`) // Տեղափոխում ենք նոր կուրսի էջը
    }
    setNewCourse("");
    setAddingCourse(false);
  };

  return (
    <div className="course-container">
      <h1 className="workspaceHeader">Ընտրեք կուրսը</h1>
      <div className="course-list">
        {uniqueCourses.map((course) => (
          <div key={course} className="course-item" onClick={() => page === 'Students' ?  navigate(`/Students/${course}`) : navigate(`/Lessons/${course}`)}>
              <h4>{course}</h4>
            
          </div>
        ))}
      </div>
      <div className="course-add">
        {addingCourse ? (
          <div className="course-add-form">
            
            <select onChange={(e) => setNewCourse(e.target.value)} className="course-input">
                      <option value="">Կուրս</option>
                      {faculties.map(fac => (
                        <option key={fac.FacultyID} value={fac.Course}>{fac.Course}</option>
                      ))}
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
  );
};

export default Courses;
