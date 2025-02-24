import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents, addStudent, updateStudent, deleteStudent } from "../../../Redux/StudentSlice";
import { FaPlus } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { MdDelete  } from "react-icons/md";
import { MdSave  } from "react-icons/md";
import { MdCancel  } from "react-icons/md";

import "./Student.css";

const Students = () => {
  const dispatch = useDispatch();
  const students = useSelector((state) => state.students?.list);
  const [studentData, setStudentData] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    patronymic: "",
    course: "",
    group_: "",
    subgroup: "",
    email: ""
  });
  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  useEffect(() => {
    setStudentData(sortStudents(students));
  }, [students]);

  // 🔹 Սորտավորման ֆունկցիա (նախ ազգանուն, ապա անուն)
  const sortStudents = (students) => {
    return [...students].sort((a, b) => {
      if (a.lastName[0] === b.lastName[0]) {
        return a.firstName.localeCompare(b.firstName);
      }
      return a.lastName.localeCompare(b.lastName);
    });
  };

  const handleChange = (id, field, value) => {
    setStudentData((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, [field]: value } : student
      )
    );
  };

  const handleSave = (id) => {
    const updatedStudent = studentData.find((student) => student.id === id);
    dispatch(updateStudent(updatedStudent));
    setEditMode(null);
  };

  const handleDelete = (id) => {
    dispatch(deleteStudent(id));
    setStudentData((prev) => prev.filter((student) => student.id !== id));
  };

  const handleNewStudentChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleAddStudent = () => {
    dispatch(addStudent(newStudent));
    setStudentData((prev) => [...prev, newStudent]);
    setNewStudent({
      firstName: "",
      lastName: "",
      patronymic: "",
      course: "",
      group_: "",
      subgroup: "",
      email: ""
    });
  };

  return (
    <div className="students-container">
      <h2>Student List</h2>
      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>Անուն</th>
            <th>ազգանուն</th>
            <th>Հայրանուն</th>
            <th></th>
            {/* <th>Course</th> */}
            <th>Խումբ</th>
            <th>Ենթախումբ</th>
            <th>Էլ. Հասցէ</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {studentData.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              {editMode === student.id ? (
                <>
                  <td><input value={student.firstName} onChange={(e) => handleChange(student.id, "firstName", e.target.value)} /></td>
                  <td><input value={student.lastName} onChange={(e) => handleChange(student.id, "lastName", e.target.value)} /></td>
                  <td><input value={student.patronymic} onChange={(e) => handleChange(student.id, "patronymic", e.target.value)} /></td>
                  <td><input value={student.course} onChange={(e) => handleChange(student.id, "course", e.target.value)} /></td>
                  <td><input value={student.group_} onChange={(e) => handleChange(student.id, "group_", e.target.value)} /></td>
                  <td><input value={student.subgroup} onChange={(e) => handleChange(student.id, "subgroup", e.target.value)} /></td>
                  <td><input value={student.email} onChange={(e) => handleChange(student.id, "email", e.target.value)} /></td>
                  <td>
                  
                    <button onClick={() => handleSave(student.id)}><MdSave/></button>
                    <button onClick={() => setEditMode(null)}><MdCancel/></button>
                  </td>
                </>
              ) : (
                <>
                  <td>{student.firstName}</td>
                  <td>{student.lastName}</td>
                  <td>{student.patronymic}</td>
                  <td>{student.course}</td>
                  <td>{student.group_}</td>
                  <td>{student.subgroup}</td>
                  <td>{student.email}</td>
                  <td>
                    <button onClick={() => setEditMode(student.id)}><FaPencil/></button>
                    <button style = {{fontSize: '13px'}}onClick={() => handleDelete(student.id)}><MdDelete/></button>
                  </td>
                </>
              )}
            </tr>
          ))}
          <tr>
            <td><FaPlus/></td>
            <td><input name="firstName" value={newStudent.firstName} onChange={handleNewStudentChange} placeholder="First Name" /></td>
            <td><input name="lastName" value={newStudent.lastName} onChange={handleNewStudentChange} placeholder="Last Name" /></td>
            <td><input name="patronymic" value={newStudent.patronymic} onChange={handleNewStudentChange} placeholder="Patronymic" /></td>
            <td><input name="course" value={newStudent.course} onChange={handleNewStudentChange} placeholder="Course" /></td>
            <td><input name="group_" value={newStudent.group_} onChange={handleNewStudentChange} placeholder="Group" /></td>
            <td><input name="subgroup" value={newStudent.subgroup} onChange={handleNewStudentChange} placeholder="Subgroup" /></td>
            <td><input name="email" value={newStudent.email} onChange={handleNewStudentChange} placeholder="Email" /></td>
            <td>
              <button onClick={handleAddStudent}><FaPlus/></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Students;
