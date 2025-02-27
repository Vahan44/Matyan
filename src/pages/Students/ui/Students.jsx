import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents, addStudent, updateStudent, deleteStudent } from "../../../Redux/StudentSlice";
import { FaPlus } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { MdDelete  } from "react-icons/md";
import { MdSave  } from "react-icons/md";
import { MdCancel  } from "react-icons/md";
import { useParams } from "react-router-dom";
import "./Student.css";

const Students = () => {
  const { course } = useParams();
  const dispatch = useDispatch();
  const students = useSelector((state) => state.students?.list);
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


  console.log(students)
  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  useEffect(() => {
    setNewStudent(prevState => {
      const index = studentData.findIndex(student => student.id === prevState.id);
      return { ...prevState, recordNumber: index !== -1 ? index : null };
    });
  }, [studentData]); // ✅ Ավելացրու կախվածության մեջ
  

  useEffect(() => {
    
    setStudentData(sortStudents(students).filter((s) => s.course === course));
    if (course) {
      setNewStudent(prevState => ({ ...prevState, course: course }));
    }  }, [students, course]);

  // 🔹 Սորտավորման ֆունկցիա (նախ ազգանուն, ապա անուն)
  const sortStudents = (students) => {
    
    return [...students].sort((a, b) => {
        return a.recordNumber - (b.recordNumber);
      
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
    if(studentData.find((student)=> student.recordNumber === updatedStudent.recordNumber)){
      dispatch(updateStudent(updatedStudent));
      setEditMode(null);
    }else alert(updatedStudent.recordNumber,"համարով ուսանող արդեն կա")
    
  };

  const handleDelete = (id) => {
    dispatch(deleteStudent(id));
    setStudentData((prev) => prev.filter((student) => student.id !== id));
  };

  const handleNewStudentChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };
  const isObjectComplete = (obj) => {
    return Object.values(obj).every(value => value !== null && value !== undefined && value !== "");
  };
  
  const handleAddStudent = () => {
    
    const updatedStudent = { ...newStudent, recordNumber: (studentData?.length || 0) + 1 };
    if(isObjectComplete(updatedStudent)){
      
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
            <th>ազգանուն</th>
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
                  <td><input value={student.recordNumber} onChange={(e) => handleChange(student.id, "recordNumber", e.target.value)} /></td>
                  <td><input value={student.firstName} onChange={(e) => handleChange(student.id, "firstName", e.target.value)} /></td>
                  <td><input value={student.lastName} onChange={(e) => handleChange(student.id, "lastName", e.target.value)} /></td>
                  <td><input value={student.patronymic} onChange={(e) => handleChange(student.id, "patronymic", e.target.value)} /></td>
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
                   <td>{student.recordNumber}</td>
                  <td>{student.firstName}</td>
                  <td>{student.lastName}</td>
                  <td>{student.patronymic}</td>
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
            <td><input name="group_" value={newStudent.group_} onChange={handleNewStudentChange} placeholder="Group" /></td>
            <td><input name="subgroup" value={newStudent.subgroup} onChange={handleNewStudentChange} placeholder="Subgroup" /></td>
            <td><input name="email" value={newStudent.email} onChange={handleNewStudentChange} placeholder="Email" /></td>
            <td>
              <button className="b" onClick={handleAddStudent}><FaPlus/></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Students;
