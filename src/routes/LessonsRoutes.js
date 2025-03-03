import express from "express";
import mysql from "mysql2/promise";

// MySQL connection
const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// lessonRoutes.js
const router = express.Router();

// Get all lessons
router.get("/", async (req, res) => {
  try {
    const [lessons] = await db.execute(`SELECT * FROM Lesson`);
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// Add a lesson
router.post("/", async (req, res) => {
  const { Name, UserID, FacultyID } = req.body;
  try {
    // Finding UserID based on userName

    
    
    await db.execute("INSERT INTO Lesson (Name, UserID, FacultyID) VALUES (?, ?, ?)", [Name, UserID, FacultyID]);
    res.status(201).json({ message: "Lesson added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// Update a lesson
router.put("/:id", async (req, res) => {
  const { Name, UserID, FacultyID } = req.body;
  const { id } = req.params;
  try {

    
    await db.execute("UPDATE Lesson SET Name = ?, UserID = ?, FacultyID = ? WHERE LessonID = ?", [Name, UserID, FacultyID, id]);
    res.json({ message: "Lesson updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// Delete a lesson
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM Lesson WHERE LessonID = ?", [id]);
    res.json({ message: "Lesson deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
