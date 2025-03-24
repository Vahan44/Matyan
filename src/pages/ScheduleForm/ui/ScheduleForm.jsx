import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { fetchSchedule, saveSchedule, updateClass, addClass, removeClass } from "../../../Redux/SheduleSlice.js";
import { fetchEmployees } from "../../../Redux/Employees.js";
import { fetchLessons, addLesson, updateLesson, deleteLesson, fetchFaculties } from "../../../Redux/LessonsSlice";
import "./ScheduleForm.css";
import { useParams } from "react-router-dom";
const ScheduleForm = () => {
  const { course } = useParams();
  const dispatch = useDispatch();
  const schedule = useSelector((state) => state.schedule.schedule);
  const loading = useSelector((state) => state.schedule.loading);
  const employees = useSelector((state) => state.employees?.list);
  const lessons = useSelector((state) => state.lesson?.lessons);
  const faculties = useSelector((state) => state.faculty?.list);

  const groups = ["Դաս", "Լաբ 1", "Լաբ 2", "Լաբ 3", "Լաբ 4", "Լաբ 5", "Լաբ 6", "Գործ 1", "Գործ 2", "Գործ 3", "Գործ 4", "ԿԱ 1", "ԿԱ 2", "ԿԱ 3", "ԿԱ 4"];

  // ✅ Բեռնել դասացուցակը MySQL-ից, երբ էջը բացվում է
  useEffect(() => {
    dispatch(fetchSchedule());
    dispatch(fetchEmployees())
    dispatch(fetchLessons())
    dispatch(fetchFaculties())
  }, [dispatch]);




  function isScheduleValid(schedule) {
    return schedule.every(day =>
      day.periods.every(period =>
        period.every(lesson =>
          Object.values(lesson).every(value => value !== "")
        )
      )
    );
  }
  // ✅ Պահպանել դասացուցակը MySQL-ում
  const handleSave = () => {
    if (isScheduleValid(schedule)) {
      dispatch(saveSchedule(schedule)).then(() => alert("✅ Դասացուցակը հաջողությամբ պահպանվեց!"));
    }
    else {
      alert("Կան բաց թողնված տվյալներ")
    }

  };

  // ✅ Input փոփոխելու ֆունկցիա
  const handleChange = (dayIndex, periodIndex, subIndex, field, value) => {
    dispatch(updateClass({ dayIndex, periodIndex, subIndex, field, value }));
  };









  return (
    <div className="schedule-container">
      {loading ? (
        <p>🔄 Բեռնվում է...</p>
      ) : (
        <div className="table-wrapper">
          <table className="schedule-table">
            <thead>
              <tr>
                <th colSpan="5">
                  <h1 className="title">Դասացուցակ</h1>
                </th>
              </tr>
              <tr className="first">
                <th>Կուրս</th>
                <td className="schedule-input1">{course}</td>
                <td colSpan="3">
                  <button onClick={handleSave} className="save-button">
                    Պահպանել դասացուցակը
                  </button>
                </td>
              </tr>
              <tr>
                <th>Օր</th>
                {["1-2", "3-4", "5-6", "7-8"].map((period) => (
                  <th key={period}>{period}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schedule.map((day, dayIndex) => (
                <tr key={day.day}>
                  <td className="day-name"><p className="vertical">{day.day}</p></td>
                  {day.periods.map((period, periodIndex) => (
                    <td key={periodIndex}>
                      {period.map((cls, subIndex) =>
                        cls.course === course ? (
                          <div key={subIndex} className="class">
                            <select value={cls.name} onChange={(e) =>
                              handleChange(
                                dayIndex,
                                periodIndex,
                                subIndex,
                                "name",
                                e.target.value
                              )
                            } className="schedule-input2">
                              <option key="op1" value="">Առարկա</option>
                              {lessons.reduce((acc, lesson) => {
                                debugger
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


                            <select
                              value={cls.group_name}
                              onChange={(e) =>
                                handleChange(
                                  dayIndex,
                                  periodIndex,
                                  subIndex,
                                  "group_name",
                                  e.target.value
                                )
                              }
                              className="schedule-input2"
                            >
                              <option value="">Ընտրել խումբը</option>
                              {groups.map((group) => (
                                <option key={group} value={group}>
                                  {group}
                                </option>
                              ))}
                            </select>


                            <select value={cls.professor} onChange={(e) =>
                              handleChange(
                                dayIndex,
                                periodIndex,
                                subIndex,
                                "professor",
                                e.target.value
                              )
                            } className="schedule-input2">
                              <option key="op1" value="">Դասախոս</option>
                              {employees.map(emp => (
                                <option key={emp.UserID} value={emp.LastName + ' ' + emp.FirstName}>{emp.LastName + ' ' + emp.FirstName}</option>
                              ))}
                            </select>
                            <select
                              value={cls.audience}
                              onChange={(e) =>
                                handleChange(
                                  dayIndex,
                                  periodIndex,
                                  subIndex,
                                  "audience",
                                  e.target.value
                                )
                              }
                              className="schedule-input2"
                            >
                              <option value="">Ընտրել շաբաթը</option>
                              <option value="Ամբողջական">Ամբողջական</option>
                              <option value="Համարիչ">Համարիչ</option>
                              <option value="Հայտարար">Հայտարար</option>
                            </select>

                            <input
                              type="text"
                              placeholder="Լսարան"
                              value={cls.classroom}
                              onChange={(e) =>
                                handleChange(
                                  dayIndex,
                                  periodIndex,
                                  subIndex,
                                  "classroom",
                                  e.target.value
                                )
                              }
                              className="schedule-input"
                            />
                            <button
                              onClick={() =>
                                dispatch(removeClass({ dayIndex, periodIndex, subIndex }))
                              }
                              className="remove-class-btn"
                            >
                              Ջնջել
                            </button>
                          </div>
                        ) : null
                      )}
                      <button
                        onClick={() =>
                          dispatch(addClass({ dayIndex, periodIndex, course }))
                        }
                        className="add-class-btn"
                      >
                        + Ավելացնել դասաժամ
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


export default ScheduleForm;