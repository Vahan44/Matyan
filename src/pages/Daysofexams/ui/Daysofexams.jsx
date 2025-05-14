import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLessons, fetchFaculties } from "../../../Redux/LessonsSlice";
import { FaPlus, FaPencil } from "react-icons/fa6";
import { MdDelete, MdSave, MdCancel } from "react-icons/md";
import { fetchEmployees } from "../../../Redux/Employees";
import {  useParams } from "react-router-dom";
import { fetchdaysofexams, adddaysofexams, updatedaysofexams, deletedaysofexams } from "../../../Redux/Daysofexams";
import "../../Lessons/ui/Lessons.css";

const Daysofexams = () => {
  const {course} = useParams()
  const dispatch = useDispatch();
  const daysofexams = useSelector((state) => state.daysofexams?.daysofexams);
  const lessons = useSelector((state) => state.lesson?.lessons);
  const faculties = useSelector((state) => state.faculty?.list);
  const employees = useSelector((state) => state.employees?.list);

  const [daysofexamsData, setdaysofexamsData] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [newdaysofexams, setNewdaysofexams] = useState({
    Name: "",
    month: '',
    day: '',
    year: '',
    UserID: 0,
    FacultyID: 0,
    group_: 0,
    midNum:0
  });


  useEffect(() => {
    dispatch(fetchLessons());
    dispatch(fetchEmployees());
    dispatch(fetchFaculties());
    dispatch(fetchdaysofexams())
  }, [dispatch]);

  useEffect(() => {
    setdaysofexamsData(daysofexams.filter(day => faculties.find(fac => fac.FacultyID === day.FacultyID)?.Course === course));
    if (course) {
      setNewdaysofexams(prevState => ({ ...prevState, FacultyID: faculties.find(fac => fac.Course === course)?.FacultyID }));
    } 
  }, [course, faculties, daysofexams]);

  const handleChange = (id, field, value) => {
    setdaysofexamsData((prev) =>
      prev.map((day) =>
        day.id === id ? { ...day, [field]: field.includes("ID") ? parseInt(value, 10) || 0 : value } : day
      )
    );
  };

  const handleSave = (id) => {
    const Daydata = daysofexamsData.find((day) => day.id === id);
    dispatch(updatedaysofexams(Daydata));
    setEditMode(null);
  };
  

  const handleDelete = (id) => {
    dispatch(deletedaysofexams(id));
    setdaysofexamsData((prev) => prev.filter((day) => day.id !== id));
  };

  const handleNewLessonChange = (e) => {
    
    const { name, value } = e.target;
    setNewdaysofexams({ ...newdaysofexams, [name]: name.includes("ID") ? parseInt(value, 10) || 0 : value });
  };

  const handleAddLesson = async () => {
    
    await dispatch(adddaysofexams(newdaysofexams));
    setNewdaysofexams({ Name: '', month: 0, day: 0, year: 0,UserID: 0, FacultyID: course, group_: 0, midNum: 0 });
      dispatch(fetchdaysofexams())

  };
  const groups = ['Ամբողջական կուրս \n'+course, course+' Առաջին կիսախումբ', course+' Երկրորդ կիսախումբ',course+' Երորդ կիսախումբ', course+' Չորորդ կիսախումբ', course+' Հինգերորդ կիսախումբ',course+' Վեցերորդ կիսախումբ',]
  const monts = ['0','0', 'Փետրվար', 'Մարտ', 'Ապրիլ', 'Մայիս','0', '0', '0', 'Սեպտեմբեր', 'Հոգտեմբեր', 'Նոյեմբեր', 'Դեկտեմբեր']
  const examTypes = ['Կիսամյակային քննություն','Առաջին միջանկյալ քննություն', 'Երկրորդ միջանկյալ քննություն']
  return (
    <div className="Lessons-container">
      <h2>{course} Քննությունների օրերը</h2>
      <table>
        <thead>
          <tr>
            <th>Առարկա</th>
            <th>Օր</th>
            <th>Ամիս</th>
            <th>Տարի</th>
            <th>Դասախոս</th>
            <th>Խումբ</th>
            <th>Քննություն</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {daysofexamsData.map((Day) => (
            <tr key={Day.id}>
              {editMode === Day.id ? (
                <>
                <td>
                    <select onChange={(e) => handleChange(Day.id, "Name", e.target.value)} value={Day.Name}>
                      <option key="op1" value="">Ընտրեք առարկան</option>
                      {lessons.reduce((acc, lesson) => {
                                
                                if (!acc.includes(lesson.Name) && lesson.FacultyID == faculties.find(fac => fac.Course === course)?.FacultyID) {
                                  acc.push(lesson.Name)
                                  return acc
                                }
                                return acc
                              }, []).map((name) => (
                                <option key={name} value={name}>
                                  {name}
                                </option>
                              ))}
                    </select>
                  </td>

                  <td>
              <select name="day" onChange={(e)=>handleChange(Day.id, "day", e.target.value)} value={Day.day}>
                  <option value="">օր</option>
                  {[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1].map((a, i) => (
                    <option value={i+1} >{i+1}</option>))}
              </select>
              
            </td>
            <td>
            <select name="month" onChange={(e)=>handleChange(Day.id, "month", e.target.value)} value={Day.month}>
                  <option value="">ամիս</option>
                  {monts.map((a, i) => a!=='0'?(
                    <option value={i} >{a}</option>
                    ):(<></>))}
              </select>            
              </td>
            <td>
            <select name="year" onChange={(e)=>handleChange(Day.id, "year", e.target.value)} value={Day.year}>
                  <option value="">տարի</option>
                  {[2024, 2025, 2026, 2027, 2028].map((a, i) => {
                    let yearI = new Date().getFullYear()
                    
                    return(
                    <option value={a} style={{backgroundColor: a == yearI ? '#1d84b0' : ''}}>{a}</option>)})}
              </select>               </td>
            
                  <td>
                  <select onChange={(e) => handleChange(Day.id, "UserID", e.target.value)} value={Day.UserID}>
                      <option key="op1" value="">Ընտրեք դասախոսին</option>
                      {employees.map(emp => (
                                <option key={emp.UserID} value={emp.UserID}>{emp.LastName + ' ' + emp.FirstName}</option>
                              ))}
                    </select>
                  </td>
                  <td>
                    <select onChange={(e) => handleChange(Day.id, "group_", e.target.value)} value={Day.group_}>
                      <option value="">Քննություն</option>
                      {groups.map((a, i) => (
                        <option key={i} value={i}>
                                {a}
                                </option>
                      ))}
                                

                    </select>
                  </td>
                  <td>
                  <select onChange={(e) => handleChange(Day.id, "midNum", e.target.value)} value={Day.midNum}>
                      <option value="">Քննություն</option>
                        <option key={1} value={0}>
                                Կիսամյակային քննություն
                        </option>
                        <option key={2} value={1}>
                                Առաջի միջանկյալ քննություն
                        </option>
                        <option key={3} value={2}>
                                Երկրորդ միջանկյալ քննություն
                        </option>        

                    </select>
                  </td>
                  <td>
                    <button onClick={() => handleSave(Day.id)}><MdSave /></button>
                    <button onClick={() => setEditMode(null)}><MdCancel /></button>
                  </td>
                </>
              ) : (
                <>
                  <td>{Day.Name}</td>
                  <td>{Day.day}</td>
                  <td>{monts[Day.month]}</td>
                  <td>{Day.year}</td>

                  <td>{employees.find(emp => emp.UserID === Day.UserID)?.FirstName} {employees.find(emp => emp.UserID === Day.UserID)?.LastName}</td>
                  <td>{groups[Day.group_]}</td>
                  <td>{examTypes[Day.midNum]}</td>
                  <td>
                    <button onClick={() => setEditMode(Day.id)}><FaPencil /></button>
                    <button onClick={() => handleDelete(Day.id)}><MdDelete /></button>
                  </td>
                </>
              )}
            </tr>
          ))}
          <tr>
            <td><select name="Name" onChange={handleNewLessonChange}>
                      <option key="op1" value="">Ընտրեք առարկան</option>
                      {lessons.reduce((acc, lesson) => {
                                
                                if (!acc.includes(lesson.Name) && lesson.FacultyID == faculties.find(fac => fac.Course === course)?.FacultyID) {
                                  acc.push(lesson.Name)
                                  return acc
                                }
                                return acc
                              }, []).map((name) => (
                                <option key={name} value={name}>
                                  {name}
                                </option>
                              ))}
                    </select></td>
            <td>
              <select name="day" onChange={handleNewLessonChange} >
                  <option value="">օր</option>
                  {[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1].map((a, i) => (
                    <option value={i+1} >{i+1}</option>))}
              </select>
              
            </td>
            <td>
            <select name="month" onChange={handleNewLessonChange} >
                  <option value="">ամիս</option>
                  {monts.map((a, i) => a!=='0'?(
                    <option value={i} >{a}</option>
                    ):(<></>))}
              </select>            </td>
            <td>
            <select name="year" onChange={handleNewLessonChange} >
                  <option value="">տարի</option>
                  {[2024, 2025, 2026, 2027, 2028].map((a, i) => {
                    let yearI = new Date().getFullYear()
                    
                    return(
                    <option value={a} style={{backgroundColor: a == yearI ? '#359ed6' : ''}}>{a}</option>)})}
              </select>               </td>
            <td>
            <select name="UserID" onChange={handleNewLessonChange}>
                      <option key="op1" value="">Ընտրեք դասախոսին</option>
                      {employees.map(emp => (
                                <option key={emp.UserID} value={emp.UserID}>{emp.LastName + ' ' + emp.FirstName}</option>
                              ))}
                    </select>
            </td>
            <td>
            <select name="group_" onChange={handleNewLessonChange} >
                <option value="">Քննություն</option>
                <option key={0} value={0}>

                                {'Ամբողջական կուրս \n'+course}
                                </option>

                                <option key={1} value={1}>
                                {course+' Առաջին կիսախումբ'}
                                </option>
                                <option key={2} value={2}>
                                {course+' Երկրորդ կիսախումբ'}
                                </option>
                                <option key={3} value={3}>
                                {course+' Երորդ կիսախումբ'}
                                </option>
                                <option key={4} value={4}>
                                {course+' Չորոդ կիսախումբ'}
                                </option>
                                <option key={5} value={5}>
                                {course+' Հինգերորդ կիսախումբ'}
                                </option>
                                <option key={6} value={6}>
                                {course+' Վեցերորդ կիսախումբ'}
                                </option>
              </select>
            </td>
            <td>
            <select name="group_" onChange={handleNewLessonChange} >
            <option value="">Քննություն</option>
                        <option key={1} value={0}>
                                Կիսամյակային քննություն
                        </option>
                        <option key={2} value={1}>
                                Առաջի միջանկյալ քննություն
                        </option>
                        <option key={3} value={2}>
                                Երկրորդ միջանկյալ քննություն
                        </option>        
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

export default Daysofexams;
