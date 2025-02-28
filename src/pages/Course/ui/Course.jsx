import { useState, useEffect } from "react";
import { useSelector , useDispatch} from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { fetchStudents } from "../../../Redux/StudentSlice";
import "./Course.css"
const Courses = () => {
  const navigate = useNavigate();
  
  const students = useSelector((state) => state.students?.list);
  const dispatch = useDispatch();
  useEffect(() => {
      dispatch(fetchStudents());
    }, [dispatch]);
  // Ստանում ենք առկա կուրսերի ցանկը
  const uniqueCourses = [...new Set(students.map(student => student.course))].sort((a, b) => a - b);
  
  const [addingCourse, setAddingCourse] = useState(false);
  const [newCourse, setNewCourse] = useState("");

  const handleAddCourse = () => {
    if (newCourse.trim() && !uniqueCourses.includes(parseInt(newCourse))) {
      navigate(`/Students/${newCourse}`); // Տեղափոխում ենք նոր կուրսի էջը
    }
    setNewCourse("");
    setAddingCourse(false);
  };

  return (
    <div className="course-container">
     
      <div className="course-list">
        {uniqueCourses.map((course) => (
          <div key={course} className="course-item">
            <Link className="course-link" to={`/Students/${course}`}>
              <h4>{course}</h4>
            </Link>
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
            Ավելացնել նոր կուրս<FaPlus className="plus-icon" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Courses;
