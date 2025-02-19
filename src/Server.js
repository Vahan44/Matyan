import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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
  db.query("DELETE FROM schedule", (deleteErr) => {
    if (deleteErr) {
      console.error("❌ Error clearing schedule:", deleteErr);
      return res.status(500).json({ error: "Database error" });
    }

    const values = schedule.flatMap((day) =>
      day.periods.flatMap((period, periodIndex) =>
        period.map((cls) => [day.day, periodIndex, cls.name, cls.group, cls.professor, cls.audience])
      )
    );

    if (values.length === 0) return res.json({ message: "✅ Schedule saved!" });

    db.query(
      "INSERT INTO schedule (day, period, name, group_name, professor, audience) VALUES ?",
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
