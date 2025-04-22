import mysql from "mysql2/promise";
import express from "express";


// MySQL կապ
const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM ExapmsGrades");
        res.json(results);
    } catch (err) {
        return res.status(500).json({ error: "Database error", details: err });
    }
});


router.post("/", async (req, res) => {
    const {StudentID, DayID, Grade} = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO exapmsgrades (StudentID, DayID, Grade) VALUES (?, ?, ?)",
            [StudentID, DayID, Grade]
        );
        res.json({ message: "ExapmsGrade added successfully", id: result.insertId });
    } catch (err) {
        return res.status(500).json({ error: "Database error", details: err });
    }
});

router.put("/:id", async (req, res) => {
    const { Grade } = req.body;
    try {
        await db.query(
            "UPDATE ExapmsGrades SET Grade = ? WHERE ExapmGradeID = ?",
            [Grade, req.params.id]
        );
        res.json({ message: "ExapmsGrades updated successfully" });
    } catch (err) {
        console.error(err); 
        return res.status(500).json({ error: "Database error", details: err });
    }
});


router.delete("/:id", async (req, res) => {
    try {
        await db.query("DELETE FROM ExapmsGrades WHERE ExapmGradeID = ?", [req.params.id]);
        res.json({ message: "ExapmsGrade etions deleted successfully" });
    } catch (err) {
        return res.status(500).json({ error: "Database error", details: err });
    }
});

export default router;
