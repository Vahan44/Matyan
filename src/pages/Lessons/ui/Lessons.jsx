import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLessons, addLesson } from "../redux/LessonSlice";

const Lesson = () => {
    const dispatch = useDispatch();
    const lessons = useSelector((state) => state.lesson.lessons);
    const [lessonName, setLessonName] = useState("");

    useEffect(() => {
        dispatch(fetchLessons());
    }, [dispatch]);

    const handleAddLesson = () => {
        if (lessonName.trim() === "") return;
        dispatch(addLesson({ name: lessonName }));
        setLessonName("");
    };

    return (
        <div>
            <h2>Lessons</h2>
            <ul>
                {lessons.map((lesson) => (
                    <li key={lesson.LessonID}>{lesson.Name}</li>
                ))}
            </ul>
            <input
                type="text"
                value={lessonName}
                onChange={(e) => setLessonName(e.target.value)}
                placeholder="Enter lesson name"
            />
            <button onClick={handleAddLesson}>Add Lesson</button>
        </div>
    );
};

export default Lesson;
