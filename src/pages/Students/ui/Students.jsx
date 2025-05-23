import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents, addStudent, updateStudent, deleteStudent } from "../../../Redux/StudentSlice";
import { FaPlus } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { MdSave } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import { useParams } from "react-router-dom";
import validator from "validator";
import "./Student.css";

const Students = () => {
  const { course } = useParams();
  const dispatch = useDispatch();
  const students = useSelector((state) => state.students?.list);
  const faculties = useSelector((state) => state.faculty?.list);

  const [studentData, setStudentData] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [newStudent, setNewStudent] = useState({
    recordNumber: "",
    firstName: "",
    lastName: "",
    patronymic: "",
    course: "",
    group_: "",
    subgroup: "",
    email: ""
  });
  const [emailError, setEmailError] = useState(true);
  const [emailError1, setEmailError1] = useState(true);


  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  // useEffect(() => {
  //   setNewStudent(prevState => {
  //     const index = studentData.findIndex(student => student.id === prevState.id);
  //     return { ...prevState, recordNumber: index !== -1 ? index : null };
  //   });
  // }, [studentData]);


  useEffect(() => {

    setStudentData(sortStudents(students).filter((s) => s.course === course));
    if (course) {
      setNewStudent(prevState => ({ ...prevState, course: course }));
    }
  }, [students, course]);


  const sortStudents = (students) => {

    return [...students].sort((a, b) => {
      return a.recordNumber - (b.recordNumber);

    });
  };

  const handleChange = (id, field, value) => {

    if (field === 'email') {
      const email = value

      if (validator.isEmail(email) || email === '') {
        setEmailError1(true);
      }
      else {
        setEmailError1(false);
      }
    }

    setStudentData((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, [field]: value } : student
      )
    );
  };

  const handleSave = (id) => {
    const updatedStudent = studentData.find((student) => student.id === id);
    if (isObjectComplete(updatedStudent)) {
      if (emailError1) {
        if (studentData.find((student) => student.recordNumber === updatedStudent.recordNumber)) {
          dispatch(updateStudent(updatedStudent));
          setEditMode(null);
        } else alert(updatedStudent.recordNumber, "համարով ուսանող արդեն կա")
      } else alert("Ներմուծեք գործող էլ. հասցէ")
    }
    else {
      alert("Լռացրեք ուսանողի բոլոր տվյալները")
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteStudent(id));
    setStudentData((prev) => prev.filter((student) => student.id !== id));
  };

  const handleNewStudentChange = (e) => {
    if (e.target.name === 'email') {
      const email = e.target.value;

      if (validator.isEmail(email) || email === '') {
        setEmailError(true);
      }
      else {
        setEmailError(false);
      }
    }
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };
  const isObjectComplete = (obj) => {
    return Object.values(obj).every(value => value !== null && value !== undefined && value !== "");
  };

   const handleAddStudent = () => {

    const updatedStudent = { ...newStudent, recordNumber: newStudent.recordNumber || (studentData?.length || 0) + 1 };
    if (isObjectComplete(updatedStudent)) {
      if (emailError) {
        dispatch(addStudent(updatedStudent));
        setStudentData((prev) => [...prev, updatedStudent]);
        setNewStudent({
          recordNumber: "",
          firstName: "",
          lastName: "",
          patronymic: "",
          course: course,
          group_: "",
          subgroup: "",
          email: ""
        });
        setEmailError(true)
      } else alert("Ներմուծեք գործող էլ. հասցէ")
    }
    else alert("Լռացրեք ուսանողի բոլոր տվյալները")

  };





  return (
    <div className="students-container">
      <h2>{course}</h2>
      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>Անուն</th>
            <th>Ազգանուն</th>
            <th>Հայրանուն</th>
            <th>Խումբ</th>
            <th>Ենթախումբ</th>
            <th>Էլ. Հասցէ</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {studentData.map((student) => (

            <tr >
              {/* <td>{student.recordNumber }</td> */}
              {editMode === student.id ? (
                <>
                  <td><input type="number" value={student.recordNumber} onChange={(e) => handleChange(student.id, "recordNumber", e.target.value)} /></td>
                  <td><input value={student.firstName} onChange={(e) => handleChange(student.id, "firstName", e.target.value)} /></td>
                  <td><input value={student.lastName} onChange={(e) => handleChange(student.id, "lastName", e.target.value)} /></td>
                  <td><input value={student.patronymic} onChange={(e) => handleChange(student.id, "patronymic", e.target.value)} /></td>
                  <td><input type="number" value={student.group_} onChange={(e) => handleChange(student.id, "group_", e.target.value)} /></td>
                  <td><input type="number" value={student.subgroup} onChange={(e) => handleChange(student.id, "subgroup", e.target.value)} /></td>
                  <td><input type='email' style={{ border: !emailError1 ? '2px solid red' : '' }} value={student.email} onChange={(e) => handleChange(student.id, "email", e.target.value)} /></td>
                  <td>

                    <button onClick={() => handleSave(student.id)}><MdSave /></button>
                    <button onClick={() => setEditMode(null)}><MdCancel /></button>
                  </td>
                </>
              ) : (
                <>
                  <td>{student.recordNumber}</td>
                  <td>{student.firstName}</td>
                  <td>{student.lastName}</td>
                  <td>{student.patronymic}</td>
                  <td>{student.group_}</td>
                  <td>{student.subgroup}</td>
                  <td>{student.email}</td>
                  <td>
                    <button onClick={() => setEditMode(student.id)}><FaPencil /></button>
                    <button style={{ fontSize: '13px' }} onClick={() => handleDelete(student.id)}><MdDelete /></button>
                  </td>
                </>
              )}
            </tr>
          ))}
          <tr>
            <td><input type="number" name="recordNumber" style={{minWidth: '20px'}} value={newStudent.recordNumber || (studentData?.length || 0) + 1} onChange={handleNewStudentChange} /></td>
            <td><input name="firstName" value={newStudent.firstName} onChange={handleNewStudentChange} placeholder="First Name" /></td>
            <td><input name="lastName" value={newStudent.lastName} onChange={handleNewStudentChange} placeholder="Last Name" /></td>
            <td><input name="patronymic" value={newStudent.patronymic} onChange={handleNewStudentChange} placeholder="Patronymic" /></td>
            <td><input type="number" name="group_" value={newStudent.group_} onChange={handleNewStudentChange} placeholder="Group" /></td>
            <td><input type="number" name="subgroup" value={newStudent.subgroup} onChange={handleNewStudentChange} placeholder="Subgroup" /></td>
            <td>
              <input name="email" type='email' style={{ border: !emailError ? '2px solid red' : '' }} value={newStudent.email} onChange={handleNewStudentChange} placeholder="Email" />
            </td>
            <td>
              <button className="b" onClick={handleAddStudent}><FaPlus /></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Students;
