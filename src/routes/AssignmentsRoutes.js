import mysql from "mysql2/promise";
import express from "express";

const router = express.Router();

// MySQL կապ
const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// ✅ Ստանալ բոլոր ներկայությունները
router.get("/", async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM assignmentcompletions");
        res.json(results);
    } catch (err) {
        return res.status(500).json({ error: "Database error", details: err });
    }
});

// ✅ Ստանալ տվյալ ուսանողի ներկայությունները
router.get("/:studentId", async (req, res) => {
    const studentId = req.params.studentId;
    try {
        const [results] = await db.query("SELECT * FROM assignmentcompletions ", [studentId]);
        res.json(results);
    } catch (err) {
        return res.status(500).json({ error: "Database error", details: err });
    }
});

// ✅ Ավելացնել նոր ներկայություն
router.post("/", async (req, res) => {
    const { StudentID, UserID, year, month, day, LessonID, Grade, Status, periud } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO assignmentcompletions (StudentID, UserID, LessonID, Grade, Status,  month, day, year, periud) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [StudentID, UserID, LessonID, Grade, Status, month, day, year,  periud]
        );
        res.json({ message: "assignmentcompletions added successfully", id: result.insertId });
    } catch (err) {
        return res.status(500).json({ error: "Database error", details: err });
    }
});

// ✅ Թարմացնել ներկայությունը
router.put("/:id", async (req, res) => {
    const { Status, Grade } = req.body;
    try {
        await db.query(
            "UPDATE assignmentcompletions SET Status = ?, Grade = ? WHERE AssignmentID = ?",
            [Status, Grade, req.params.id]
        );
        res.json({ message: "assignmentcompletions updated successfully" });
    } catch (err) {
        console.error(err); 
        return res.status(500).json({ error: "Database error", details: err });
    }
});


// ✅ Ջնջել ներկայությունը
router.delete("/:id", async (req, res) => {
    try {
        await db.query("DELETE FROM assignmentcompletions WHERE AssignmentID = ?", [req.params.id]);
        res.json({ message: "assignmentcompletions deleted successfully" });
    } catch (err) {
        return res.status(500).json({ error: "Database error", details: err });
    }
});

export default router;
