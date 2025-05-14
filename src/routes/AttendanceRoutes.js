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
        const [results] = await db.query("SELECT  * FROM Attendance ");
        res.json(results);
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error", details: err });
    }
});

// ✅ Ստանալ տվյալ ուսանողի ներկայությունները
router.get("/:studentId", async (req, res) => {
    const studentId = req.params.studentId;
    try {
        const [results] = await db.query("SELECT * FROM Attendance WHERE StudentID = ?", [studentId]);
        res.json(results);
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error", details: err });
    }
});

// ✅ Ավելացնել նոր ներկայություն
router.post("/", async (req, res) => {
    
    const { StudentID, UserID, year, month, day, periud, LessonID, Status } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO Attendance (StudentID, UserID, LessonID, Status, year, month, day, periud) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [StudentID, UserID, LessonID, Status, year, month, day, periud]
        );
        res.json({ message: "Attendance added successfully", id: result.insertId });
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error", details: err });
    }
});

// ✅ Թարմացնել ներկայությունը
router.put("/:id", async (req, res) => {
    const { Status } = req.body;
    try {
        await db.query("UPDATE Attendance SET Status = ? WHERE AttID = ?", [Status, req.params.id]);
        res.json({ message: "Attendance updated successfully" });
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error", details: err });
    }
});

// ✅ Ջնջել ներկայությունը
router.delete("/:id", async (req, res) => {
    try {
        await db.query("DELETE FROM Attendance WHERE AttID = ?", [req.params.id]);
        res.json({ message: "Attendance deleted successfully" });
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error", details: err });
    }
});

export default router;
