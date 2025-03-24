import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { fetchSchedule, saveSchedule, updateClass, addClass, removeClass } from "../../../Redux/SheduleSlice.js";
import { fetchFaculties } from "../../../Redux/LessonsSlice";

const Schedules = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchSchedule());
    dispatch(fetchFaculties());
  }, [dispatch]);
  // Օգտագործում ենք schedule աղյուսակից course դաշտը
  const schedule = useSelector((state) => state.schedule.schedule);
  const faculties = useSelector((state) => state.faculty?.list);
  const Employee = useSelector((state) => state.Employee)

  const uniqueCourses = getUniqueCourses(schedule)
function getUniqueCourses(schedule) {
    const courses = new Set();

    schedule.forEach(day => {
        day.periods.forEach(period => {
            period.forEach(lesson => {
                if (lesson.course) {
                    courses.add(lesson.course);
                }
            });
        });
    });

    return Array.from(courses);
}




  const [addingCourse, setAddingCourse] = useState(false);
  const [newCourse, setNewCourse] = useState("");

  const handleAddCourse = () => {
    if (newCourse.trim() && !uniqueCourses.includes(newCourse)) {
      
      navigate(`/Schedule/${newCourse}`); // Նոր կուրսի էջ
    }
    setNewCourse("");
    setAddingCourse(false);
  };

  return (
    <div className="course-container">
            <h1 className="workspaceHeader">Ընտրեք կուրսը</h1>

      <div className="course-list">
        {uniqueCourses.map((course) => (
          <div key={course} className="course-item" onClick={() => Employee.isAuthenticated ? navigate(`/Schedule/${course}`) : navigate(`/PublicSchedule/${course}`)}>
              <h4>{course}</h4>
          </div>
        ))}
      </div>
      <div className="course-add">
        {Employee.isAuthenticated ? (addingCourse ? (
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
            Ավելացնել նոր կուրս <FaPlus className="plus-icon" />
          </button>
        )) : null}
      </div>
    </div>
  );
};

export default Schedules;
