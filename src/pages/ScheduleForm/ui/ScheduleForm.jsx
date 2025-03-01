import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { fetchSchedule, saveSchedule, updateClass, addClass, removeClass } from "../../../Redux/SheduleSlice.js";
import "./ScheduleForm.css";
import { useParams } from "react-router-dom";
const ScheduleForm = () => {
  const { course } = useParams();
    const dispatch = useDispatch();
  const schedule = useSelector((state) => state.schedule.schedule);
  const loading = useSelector((state) => state.schedule.loading);
  const [scheduleShow, setScheduleShow] = useState([])
  const [newShedule, setNewShedule] = useState({
    day : "",
  period: "",
  course: course,
  name: "",
  group_name: "",
  professor: "",
  audience: "",
  classroom: ""
})


  const groups = ["Դաս", "Լաբ 1", "Լաբ 2", "Լաբ 3", "Լաբ 4", "Լաբ 5", "Լաբ 6", "Գործ 1", "Գործ 2", "Գործ 3", "Գործ 4", "ԿԱ 1", "ԿԱ 2", "ԿԱ 3", "ԿԱ 4"];
  console.log("Schedule data:", schedule);

  // ✅ Բեռնել դասացուցակը MySQL-ից, երբ էջը բացվում է
  useEffect(() => {
    dispatch(fetchSchedule());
  }, [dispatch]);

  function getCourseSchedule(schedule, course) {
    return schedule.filter(lesson => lesson.course === course);
}

// Օրինակային տվյալներ
useEffect(() => {
  setScheduleShow(filterLessons(schedule))
}, [])


const handleNewSheduleChange = (dayIndex, periodIndex, value) => {
  setNewShedule((prevShedule) =>
      prevShedule.map((day, index) =>
          index === dayIndex
              ? { ...day, periods: day.periods.map((period, pIndex) =>
                  pIndex === periodIndex ? value : period
              )}
              : day
      )
  );
};


function isScheduleValid(schedule) {
    return  schedule.every(day => 
        day.periods.every(period => 
            period.every(lesson => 
                Object.values(lesson).every(value => value !== "")
            )
        )
    );
}
  // ✅ Պահպանել դասացուցակը MySQL-ում
  const handleSave = () => {
    if(isScheduleValid(schedule)){
      dispatch(saveSchedule(schedule)).then(() => alert("✅ Դասացուցակը հաջողությամբ պահպանվեց!"));
    }
    else{
      console.log(schedule)
      alert("Կան բաց թողնված տվյալներ")
    }
    
  };

  // ✅ Input փոփոխելու ֆունկցիա
  const handleChange = (dayIndex, periodIndex, subIndex, field, value) => {
    dispatch(updateClass({ dayIndex, periodIndex, subIndex, field, value }));
  };



  function transformSchedule(data) {
    const defaultSchedule = [
      { day: "Երկուշաբթի", periods: [[], [], [], []] },
      { day: "Երեքշաբթի", periods: [[], [], [], []] },
      { day: "Չորեքշաբթի", periods: [[], [], [], []] },
      { day: "Հինգշաբթի", periods: [[], [], [], []] },
      { day: "Ուրբաթ", periods: [[], [], [], []] },
    ];
  
    data.forEach((item) => {
      const dayEntry = defaultSchedule.find((d) => d.day === item.day);
      if (dayEntry && item.period >= 0 && item.period < 4) {
        dayEntry.periods[item.period].push({
          name: item.name || "",
          group: item.group_name || "",
          professor: item.professor || "",
          audience: item.audience || "",
          classroom: item.classroom || "",
          course: item.course || course,
        });
      }
    });
  
    return defaultSchedule;
  }

  
  function filterLessons(schedule) {
    return schedule.map(day => ({
      ...day,
      periods: day.periods.map(period =>
        period.filter(lesson => lesson.course == course)
      ),
    }));
  }

  console.log(filterLessons(schedule))
  console.log((schedule))

  return (
    <div className="schedule-container">
      

      

      {loading ? (
        <p>🔄 Բեռնվում է...</p>
      ) : (
        <div className="table-wrapper">
          <table className="schedule-table">
            <thead>
              <tr><th colSpan="5">
              <h1 className="title">Դասացուցակ</h1>
                </th></tr>
              <tr className="first">
                <th>Կուրս</th>
                <td className="schedule-input1">
                  {course}
                </td>
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
              {(filterLessons(schedule)).map((day, dayIndex) => (
                <tr key={day.day}>
                  <td className="day-name">{day.day}</td>
                  {day.periods.map((period, periodIndex) => (
                    <td key={periodIndex}>
                      {period.map((cls, subIndex) => (
                        <div key={subIndex} className="class-entry">
                          <input
                            type="text"
                            placeholder="Առարկա"
                            value={cls.name}
                            onChange={(e) =>
                              handleChange(dayIndex, periodIndex, subIndex, "name", e.target.value)
                            }
                            className="schedule-input"
                          />
                          
                          <select
                          value={cls.group_name}
                          onChange={(e) =>
                            handleChange(dayIndex, periodIndex, subIndex, "group_name", e.target.value)
                          }
                          className="schedule-input2"
                        >
                          <option value={null}>Ընտրել խումբը</option>
                          {groups.map((group) => (
                            <option key={group} value={group}>{group}</option>
                          ))}
                        </select>
                          <input
                            type="text"
                            placeholder="Դասախոս"
                            value={cls.professor}
                            onChange={(e) =>
                              handleChange(dayIndex, periodIndex, subIndex, "professor", e.target.value)
                            }
                            className="schedule-input"
                          />
                          
                          <select
                          value={cls.audience}
                          onChange={(e) =>
                            handleChange(dayIndex, periodIndex, subIndex, "audience", e.target.value)
                          }
                          className="schedule-input2"
                        >
                            <option value={null}>Ընտրել շաբաթը</option>

                            <option key="Համարիչ"  value="Համարիչ">Համարիչ</option>
                          
                            <option key="Հայտարար" value="Հայտարար">Հայտարար</option>
                          
                        </select>

                        <input
                            type="text"
                            placeholder="Լսարան"
                            value={cls.classroom}
                            onChange={(e) =>
                              handleChange(dayIndex, periodIndex, subIndex, "classroom", e.target.value)
                            }
                            className="schedule-input"
                          />
                          <button
                            onClick={() => dispatch(removeClass({ dayIndex, periodIndex, subIndex }))}
                            className="remove-class-btn"
                          >
                            Ջնջել
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => dispatch(addClass({ dayIndex, periodIndex, course }))}
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
};

export default ScheduleForm;