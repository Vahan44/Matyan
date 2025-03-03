import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { fetchSchedule, saveSchedule, updateClass, addClass, removeClass } from "../../../Redux/SheduleSlice.js";

import "./Schedules.css";

const Schedules = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchSchedule());
  }, [dispatch]);
  // Օգտագործում ենք schedule աղյուսակից course դաշտը
  const schedule = useSelector((state) => state.schedule.schedule);

 console.log('asdasdasdasd', schedule)

  const uniqueCourses = getUniqueCourses(schedule)
console.log('unique courses', uniqueCourses)
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




  console.log(uniqueCourses)
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
      <div className="course-list">
        {uniqueCourses.map((course) => (
          <div key={course} className="course-item" onClick={() => navigate(`/Schedule/${course}`)}>
              <h4>{course}</h4>
          </div>
        ))}
      </div>
      <div className="course-add">
        {addingCourse ? (
          <div className="course-add-form">
            <input
              type="text"
              className="course-input"
              value={newCourse}
              onChange={(e) => setNewCourse(e.target.value)}
              placeholder="Նոր կուրսի անուն"
            />
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
        )}
      </div>
    </div>
  );
};

export default Schedules;
