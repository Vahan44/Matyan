import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSchedule, saveSchedule, updateClass, addClass, removeClass } from "../../../Redux/SheduleSlice.js";
import "./ScheduleForm.css";

const ScheduleForm = () => {
  const dispatch = useDispatch();
  const schedule = useSelector((state) => state.schedule.schedule);
  const loading = useSelector((state) => state.schedule.loading);
  const groups = ["Դաս", "Լաբ 1", "Լաբ 2", "Լաբ 3", "Լաբ 4", "Լաբ 5", "Լաբ 6", "Գործ 1", "Գործ 2", "Գործ 3", "Գործ 4", "ԿԱ 1", "ԿԱ 2", "ԿԱ 3", "ԿԱ 4"];
  console.log("Schedule data:", schedule);

  // ✅ Բեռնել դասացուցակը MySQL-ից, երբ էջը բացվում է
  useEffect(() => {
    dispatch(fetchSchedule());
  }, [dispatch]);

  // ✅ Պահպանել դասացուցակը MySQL-ում
  const handleSave = () => {
    dispatch(saveSchedule(schedule)).then(() => alert("✅ Դասացուցակը հաջողությամբ պահպանվեց!"));
  };

  // ✅ Input փոփոխելու ֆունկցիա
  const handleChange = (dayIndex, periodIndex, subIndex, field, value) => {
    dispatch(updateClass({ dayIndex, periodIndex, subIndex, field, value }));
  };

  return (
    <div className="schedule-container">
      <h2 className="title">Դասացուցակ</h2>

      

      {loading ? (
        <p>🔄 Բեռնվում է...</p>
      ) : (
        <div className="table-wrapper">
          <table className="schedule-table">
            <thead>
              <tr className="first">
                <th>Կուրս</th>
                <td>
                  <input 
                  type="text"
                  className="schedule-input" />
                </td>
                <td colspan="3">
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
                          value={cls.group}
                          onChange={(e) =>
                            handleChange(dayIndex, periodIndex, subIndex, "group", e.target.value)
                          }
                          className="schedule-input2"
                        >
                          <option value="">Ընտրել խումբը</option>
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
                        onClick={() => dispatch(addClass({ dayIndex, periodIndex }))}
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
