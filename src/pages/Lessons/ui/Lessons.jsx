import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLessons, addLesson, updateLesson, deleteLesson, fetchFaculties } from "../../../Redux/LessonsSlice";
import { FaPlus, FaPencil } from "react-icons/fa6";
import { MdDelete, MdSave, MdCancel } from "react-icons/md";
import { fetchEmployees } from "../../../Redux/Employees";
import {  useParams } from "react-router-dom";

import "./Lessons.css";

const Lesson = () => {
  const {course} = useParams()
  const dispatch = useDispatch();
  const lessons = useSelector((state) => state.lesson?.lessons);
  const employees = useSelector((state) => state.employees?.list);
  const faculties = useSelector((state) => state.faculty?.list);

  const [lessonData, setLessonData] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [newLesson, setNewLesson] = useState({
    Name: "",
    UserID: 0,
    FacultyID: 0,
    group_: ""
  });

  const groups = ["Դաս", "Լաբ 1", "Լաբ 2", "Լաբ 3", "Լաբ 4", "Լաբ 5", "Լաբ 6", "Գործ 1", "Գործ 2", "Գործ 3", "Գործ 4", "ԿԱ 1", "ԿԱ 2", "ԿԱ 3", "ԿԱ 4"];

  useEffect(() => {
    dispatch(fetchLessons());
    dispatch(fetchEmployees());
    dispatch(fetchFaculties());
  }, [dispatch]);

  useEffect(() => {
    setLessonData(lessons.filter(lesson => faculties.find(fac => fac.FacultyID === lesson.FacultyID)?.Course == course));
  }, [course, faculties, lessons]);

  const handleChange = (id, field, value) => {
    setLessonData((prev) =>
      prev.map((lesson) =>
        lesson.LessonID === id ? { ...lesson, [field]: field.includes("ID") ? parseInt(value, 10) || 0 : value } : lesson
      )
    );
  };

  const handleSave = (id) => {
    const updatedLesson = lessonData.find((lesson) => lesson.LessonID === id);
    dispatch(updateLesson(updatedLesson));
    setEditMode(null);
  };

  const handleDelete = (id) => {
    dispatch(deleteLesson(id));
    setLessonData((prev) => prev.filter((lesson) => lesson.LessonID !== id));
  };

  const handleNewLessonChange = (e) => {
    
    const { name, value } = e.target;
    setNewLesson({ ...newLesson, [name]: name.includes("ID") ? parseInt(value, 10) || 0 : value });
  };

  const handleAddLesson = () => {
    
    dispatch(addLesson(newLesson));
    setNewLesson({ Name: "", UserID: 0, FacultyID: 0, group_: "" });
  };

  return (
    <div className="Lessons-container">
      <h2>Դասաժամեր</h2>
      <table>
        <thead>
          <tr>
            <th>Առարկա</th>
            <th>Դասախոս</th>
            <th>Կուրս</th>
            <th>Խումբ</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {lessonData.map((lesson) => (
            <tr key={lesson.LessonID}>
              {editMode === lesson.LessonID ? (
                <>
                  <td><input value={lesson.Name} placeholder="Առարկայի անվանում" onChange={(e) => handleChange(lesson.LessonID, "Name", e.target.value)} /></td>
                  <td>
                    <select onChange={(e) => handleChange(lesson.LessonID, "UserID", e.target.value)}>
                      <option key="op1" value="">Դասախոս</option>
                      {employees.map(emp => (
                        <option key={emp.UserID} value={emp.UserID}>{emp.FirstName} {emp.LastName}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select onChange={(e) => handleChange(lesson.LessonID, "FacultyID", e.target.value)}>
                      <option value="">Կուրս</option>
                      {faculties.map(fac => (
                        <option key={fac.FacultyID} value={fac.FacultyID}>{fac.Course}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select onChange={(e) => handleChange(lesson.LessonID, "group_", e.target.value)}>
                      <option value="">Խումբ</option>
                      {groups.map((group) => (
                                <option key={group} value={group}>
                                  {group}
                                </option>
                              ))}
                    </select>
                  </td>
                  <td>
                    <button onClick={() => handleSave(lesson.LessonID)}><MdSave /></button>
                    <button onClick={() => setEditMode(null)}><MdCancel /></button>
                  </td>
                </>
              ) : (
                <>
                  <td>{lesson.Name}</td>
                  <td>{employees.find(emp => emp.UserID === lesson.UserID)?.FirstName} {employees.find(emp => emp.UserID === lesson.UserID)?.LastName}</td>
                  <td>{faculties.find(fac => fac.FacultyID === lesson.FacultyID)?.Course}</td>
                  <td>{lesson.group_}</td>
                  <td>
                    <button onClick={() => setEditMode(lesson.LessonID)}><FaPencil /></button>
                    <button onClick={() => handleDelete(lesson.LessonID)}><MdDelete /></button>
                  </td>
                </>
              )}
            </tr>
          ))}
          <tr>
            <td><input name="Name" placeholder="Առարկայի անվանում" value={newLesson.Name} onChange={handleNewLessonChange} /></td>
            <td>
              <select name="UserID" onChange={handleNewLessonChange}>
                <option key="op1" value="">Դասախոս</option>
                {employees.map(emp => (
                  <option key={emp.UserID} value={emp.UserID}>{emp.FirstName} {emp.LastName}</option>
                ))}
              </select>
            </td>
            <td>
              <select name="FacultyID" onChange={handleNewLessonChange} >
                <option value="">Կուրս</option>
                {faculties.map(fac => (
                  <option key={fac.FacultyID} value={fac.FacultyID}>{fac.Course}</option>
                ))}
              </select>
            </td>
            <td>
            <select name="group_" onChange={handleNewLessonChange} >
                <option value="">Խումբ</option>
                {groups.map((group) => (
                                <option key={group} value={group}>
                                  {group}
                                </option>
                              ))}
              </select>
            </td>
            <td>
              <button className="pls" onClick={handleAddLesson}><FaPlus /></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Lesson;
