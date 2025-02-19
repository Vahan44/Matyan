import express from "express";
import cors from "cors";
import db from "./db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ API՝ տվյալների բազան թարմացնելու համար
app.post("/update-schedule", (req, res) => {
    console.log("Received schedule data:", req.body);

    const { schedule } = req.body;

    if (!schedule || !Array.isArray(schedule)) {
        return res.status(400).json({ error: "Invalid schedule format" });
    }

    // Ջնջում ենք հին տվյալները
    db.query("DELETE FROM schedule", (err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to clear schedule" });
        }

        // Նոր տվյալների ավելացում
        schedule.forEach((day) => {
            day.periods.forEach((period, periodIndex) => {
                period.forEach((cls) => {
                    if (cls.name) {
                        db.query(
                            "INSERT INTO schedule (day, period, name, group_name, professor, audience) VALUES (?, ?, ?, ?, ?, ?)",
                            [day.day, periodIndex, cls.name, cls.group, cls.professor, cls.audience],
                            (err) => {
                                if (err) console.error("❌ Database insert error:", err);
                            }
                        );
                    }
                });
            });
        });

        res.json({ message: "✅ Schedule updated successfully!" });
    });
});

// ✅ API՝ ճիշտ ֆորմատով տվյալները վերադարձնելու համար
app.get("/get-schedule", (req, res) => {
    db.query("SELECT * FROM schedule", (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Failed to fetch schedule" });
        }

        // Ստացված տվյալները վերածում ենք ճիշտ ֆորմատի
        const formattedSchedule = [
            { day: "Երկուշաբթի", periods: [[], [], [], []] },
            { day: "Երեքշաբթի", periods: [[], [], [], []] },
            { day: "Չորեքշաբթի", periods: [[], [], [], []] },
            { day: "Հինգշաբթի", periods: [[], [], [], []] },
            { day: "Ուրբաթ", periods: [[], [], [], []] }
        ];

        results.forEach((entry) => {
            const dayIndex = formattedSchedule.findIndex(d => d.day === entry.day);
            if (dayIndex !== -1 && entry.period >= 0 && entry.period < 4) {
                formattedSchedule[dayIndex].periods[entry.period].push({
                    name: entry.name,
                    group: entry.group_name,
                    professor: entry.professor,
                    audience: entry.audience,
                });
            }
        });

        res.json(formattedSchedule);
    });
});

app.listen(5000, () => {
    console.log("🚀 Server is running on port 5000");
});
