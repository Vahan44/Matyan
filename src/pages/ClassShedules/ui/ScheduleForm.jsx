import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSchedule, saveSchedule, updateClass, addClass, removeClass } from "../../../Redux/SheduleSlice.js";
import "./ScheduleForm.css";

const ScheduleForm = () => {
  const dispatch = useDispatch();
  const schedule = useSelector((state) => state.schedule.schedule);
  const loading = useSelector((state) => state.schedule.loading);

  console.log("Schedule data:", schedule);

  // ✅ Բեռնում ենք դասացուցակը MySQL-ից, երբ էջը բացվում է
  useEffect(() => {
    dispatch(fetchSchedule());
  }, [dispatch]);

  // ✅ Պահպանել դասացուցակը MySQL-ում
  const handleSave = () => {
    dispatch(saveSchedule(schedule));
    alert("✅ Դասացուցակը հաջողությամբ պահպանվեց!");
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
        if (!dayEntry.periods[item.period]) {
          dayEntry.periods[item.period] = [];
        }
        dayEntry.periods[item.period].push({
          name: item.name || "",
          group: item.group_name || "", // ✅ Այստեղ `group_name`-ը `group` ենք դարձնում
          professor: item.professor || "",
          audience: item.audience || "",
        });
      }
    });

    return defaultSchedule;
  }

  // ✅ Վերափոխված դասացուցակը
  let sched = transformSchedule(schedule);

  return (
    <div className="schedule-container">
      <h2 className="title">Դասացուցակ</h2>

      {/* Save Button */}
      <button onClick={handleSave} className="save-button">
        Պահպանել դասացուցակը
      </button>

      {loading ? (
        <p>🔄 Բեռնվում է...</p>
      ) : (
        <div className="table-wrapper">
          <table className="schedule-table">
            <thead>
              <tr className="first">
                <th>Կուրս</th>
                <td>
                  <input type="text" className="schedule-input" />
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
              {sched.map((day, dayIndex) => (
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
                          <input
                            type="text"
                            placeholder="Խումբ"
                            value={cls.group}
                            onChange={(e) =>
                              handleChange(dayIndex, periodIndex, subIndex, "group", e.target.value)
                            }
                            className="schedule-input"
                          />
                          <input
                            type="text"
                            placeholder="Դասախոս"
                            value={cls.professor}
                            onChange={(e) =>
                              handleChange(dayIndex, periodIndex, subIndex, "professor", e.target.value)
                            }
                            className="schedule-input"
                          />
                          <input
                            type="text"
                            placeholder="Համարիչ"
                            value={cls.audience}
                            onChange={(e) =>
                              handleChange(dayIndex, periodIndex, subIndex, "audience", e.target.value)
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
