import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { fetchSchedule, saveSchedule, updateClass, addClass, removeClass } from "../../../Redux/SheduleSlice.js";
import "./EmployeeSchedule.css";
import { useParams } from "react-router-dom";
const EmployeeSchedule = () => {
    const { course } = useParams();
    const dispatch = useDispatch();
    const schedule = useSelector((state) => state.schedule.schedule);
    const loading = useSelector((state) => state.schedule.loading);
    const Employee = useSelector((state) => state.Employee);


    const groups = ["Դաս", "Լաբ 1", "Լաբ 2", "Լաբ 3", "Լաբ 4", "Լաբ 5", "Լաբ 6", "Գործ 1", "Գործ 2", "Գործ 3", "Գործ 4", "ԿԱ 1", "ԿԱ 2", "ԿԱ 3", "ԿԱ 4"];

    useEffect(() => {
        dispatch(fetchSchedule());
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
    const handleSave = () => {
        if (isScheduleValid(schedule)) {
            dispatch(saveSchedule(schedule)).then(() => alert("✅ Դասացուցակը հաջողությամբ պահպանվեց!"));
        }
        else {
            alert("Կան բաց թողնված տվյալներ")
        }

    };

    const handleChange = (dayIndex, periodIndex, subIndex, field, value) => {
        dispatch(updateClass({ dayIndex, periodIndex, subIndex, field, value }));
    };




    console.log(Employee.user.LastName + ' ' + Employee.user.FirstName)


    return (
        <div className="employee-schedule-container">
            {loading ? (
                <p>🔄 Բեռնվում է...</p>
            ) : (
                <div className="employee-table-wrapper">
                    <table className="employee-schedule-table">
                        <thead>
                            <tr >
                                <th colSpan={5}>                            
                                    <h2>Ձեր զբաղվածության գրաֆիկը</h2>
                                </th>
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
                                    <td className="day-name" ><p className="vertical1">{day.day}</p></td>
                                    {day.periods.map((period, periodIndex) => (
                                        <td key={periodIndex}>
                                            {period.map((cls, subIndex) =>
                                                cls.professor === Employee.user.LastName + ' ' + Employee.user.FirstName ? (
                                                    <div key={subIndex} className="class-entry">
                                                        <p>{cls.name}</p>
                                                        <p>{cls.course}</p>
                                                        <p>{cls.group_name}</p>
                                                        <p>{cls.professor}</p>
                                                        <p>{cls.audience}</p>
                                                        <p>{cls.classroom}</p>
                                                        
                                                    </div>
                                                ) : null
                                            )}
                                           
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


export default EmployeeSchedule;