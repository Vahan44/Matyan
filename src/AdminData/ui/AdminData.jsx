// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchStudents } from "../Redux/studentSlice";
// import { Link, useNavigate } from "react-router-dom";

// const Courses = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const courses = useSelector((state) => state.students.courses);
//   const [courseName, setCourseName] = useState("");

//   useEffect(() => {
//     dispatch(fetchCourses());
//   }, [dispatch]);

//   const handleAddCourse = async () => {
//     if (courseName.trim()) {
//       const newCourse = { name: courseName };
//       const resultAction = await dispatch(addCourse(newCourse));
      
//       if (addCourse.fulfilled.match(resultAction)) {
//         const createdCourse = resultAction.payload; // Backend-ից վերադարձած տվյալները
//         navigate(`/Students/${createdCourse.id}`); // Տեղափոխվում ենք նոր կուրսի էջ
//       }

//       setCourseName("");
//     }
//   };

//   return (
//     <div>
//       <h2>Կուրսեր</h2>
//       <ul>
//         {courses.map((course) => (
//           <li key={course.id}>
//             <Link to={`/Students/${course.id}`}>{course.name}</Link>
//           </li>
//         ))}
//       </ul>

//       <input
//         type="text"
//         placeholder="Նոր կուրսի անուն"
//         value={courseName}
//         onChange={(e) => setCourseName(e.target.value)}
//       />
//       <button onClick={handleAddCourse}>Ավելացնել կուրս</button>
//     </div>
//   );
// };

// export default Courses;
