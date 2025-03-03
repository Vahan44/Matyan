import express from "express";
import cors from "cors";
import db from "./db.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import LessonsRoutes from "./routes/LessonsRoutes.js"
import facultyRoutes from "./routes/facultyRoutes.js"
import institutesRoutes from "./routes/institutesRoutes.js"
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/students", studentRoutes);
app.use("/api/auth", authRoutes);
app.use("/employees", employeeRoutes);
app.use("/lessons", LessonsRoutes);
app.use("/faculty", facultyRoutes);
app.use("/institutes", institutesRoutes);


// ✅ Բեռնել դասացուցակը
app.get("/api/schedule", (req, res) => {
  db.query("SELECT * FROM schedule", (err, results) => {
    if (err) {
      console.error("❌ Error fetching schedule:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// ✅ Պահպանել դասացուցակը (ջնջել, ապա ավելացնել նոր տվյալներ)
app.post("/api/schedule", (req, res) => {
  const schedule = req.body;

  if (!Array.isArray(schedule)) {
    return res.status(400).json({ error: "Invalid schedule format" });
  }

  db.query("DELETE FROM schedule", (deleteErr) => {
    if (deleteErr) {
      console.error("❌ Error clearing schedule:", deleteErr);
      return res.status(500).json({ error: "Database error" });
    }

    const values = schedule.flatMap((day) => {
      if (!day || !Array.isArray(day.periods)) return []; // ✅ Ստուգում ենք `periods`-ի գոյությունը

      return day.periods.flatMap((period, periodIndex) => {
        if (!Array.isArray(period)) return []; // ✅ Ստուգում ենք, որ `period`-ը զանգված լինի

        return period.map((cls) => [
          day.day || "",
          periodIndex,
          cls.course || "",
          cls.name || "",
          cls.group_name || "", // ✅ `cls.group` փոխարինվել է `cls.group_name`
          cls.professor || "",
          cls.audience || "",
          cls.classroom || "",
        ]);
      });
    });

    if (values.length === 0) {
      return res.json({ message: "✅ Schedule saved!" });
    }

    db.query(
      "INSERT INTO schedule (day, period, course, name, group_name, professor, audience, classroom) VALUES ?",
      [values],
      (insertErr) => {
        if (insertErr) {
          console.error("❌ Error inserting schedule:", insertErr);
          return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "✅ Schedule saved successfully!" });
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
