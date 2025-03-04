import React, { useState } from "react";
import "./Matyan.css"; // Import the CSS file

const Matyan = () => {
  // State for dropdown selections
  const [course, setCourse] = useState("2");
  const [subject, setSubject] = useState("ՖԻԶԻԿՈՒԹՅՈՒՆ");
  const [month, setMonth] = useState("ՄԱՐՏ");
  const [group, setGroup] = useState("ՃՇՏՄ");
  const [teacher, setTeacher] = useState("ՀԱՅԿ ԲԱԲԱՅԱՆ");

  // Function to handle form reset or refresh
  const handleRefresh = () => {
    setCourse("2");
    setSubject("ՖԻԶԻԿՈՒԹՅՈՒՆ");
    setMonth("ՄԱՐՏ");
    setGroup("ՃՇՏՄ");
    setTeacher("ՀԱՅԿ ԲԱԲԱՅԱՆ");
    alert("Տվյալները թարմացվել են!");
  };

  return (
    <div className="container">
      <h2 className="title">Մասնագիտություն</h2>
      <p className="subtitle">"2Բ" դասարան</p>
      <button className="filter-button" onClick={handleRefresh}>ԹԱՐՄԱՑՆԵԼ</button>

      <div className="grid-container">
        <div className="card">
          <label>Կուրսային</label>
          <select value={course} onChange={(e) => setCourse(e.target.value)}>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
          </select>
        </div>

        <div className="card">
          <label>Առարկա</label>
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option>ՄԱԹԵՄԱՏԻԿԱ</option>
            <option>ՖԻԶԻԿՈՒԹՅՈՒՆ</option>
            <option>ԻՆՖՈՐՄԱՏԻԿԱ</option>
          </select>
        </div>

        <div className="card">
          <label>Ամիս</label>
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            <option>ՀՈՒՆՎԱՐ</option>
            <option>ՓԵՏՐՎԱՐ</option>
            <option>ՄԱՐՏ</option>
            <option>ԱՊՐԻԼ</option>
          </select>
        </div>

        <div className="card">
          <label>Խումբ</label>
          <select value={group} onChange={(e) => setGroup(e.target.value)}>
            <option>ԱՐՏ</option>
            <option>ՃՇՏՄ</option>
            <option>ԲՆԱԳԻՏ</option>
          </select>
        </div>

        <div className="card">
          <label>Ուսուցիչ</label>
          <select value={teacher} onChange={(e) => setTeacher(e.target.value)}>
            <option>ՀԱՅԿ ԲԱԲԱՅԱՆ</option>
            <option>ԱՆՆԱ ՄԿՐՏՉՅԱՆ</option>
            <option>ՍԵՐՈԲ ԱՎԵՏԻՍՅԱՆ</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Matyan;
