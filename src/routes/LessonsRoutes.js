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
  const { name, userName, facultyName } = req.body;
  try {
    // Finding UserID based on userName
    const [user] = await db.execute("SELECT UserID FROM Employees WHERE CONCAT(FirstName, ' ', LastName) = ?", [userName]);
    if (user.length === 0) return res.status(400).json({ error: "User not found" });
    
    // Finding FacultyID based on facultyName
    const [faculty] = await db.execute("SELECT FacultyID FROM Faculty WHERE Name = ?", [facultyName]);
    if (faculty.length === 0) return res.status(400).json({ error: "Faculty not found" });
    
    const userID = user[0].UserID;
    const facultyID = faculty[0].FacultyID;
    
    await db.execute("INSERT INTO Lesson (Name, UserID, FacultyID) VALUES (?, ?, ?)", [name, userID, facultyID]);
    res.status(201).json({ message: "Lesson added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// Update a lesson
router.put("/:id", async (req, res) => {
  const { name, userName, facultyName } = req.body;
  const { id } = req.params;
  try {
    const [user] = await db.execute("SELECT UserID FROM Employees WHERE CONCAT(FirstName, ' ', LastName) = ?", [userName]);
    if (user.length === 0) return res.status(400).json({ error: "User not found" });
    
    const [faculty] = await db.execute("SELECT FacultyID FROM Faculty WHERE Name = ?", [facultyName]);
    if (faculty.length === 0) return res.status(400).json({ error: "Faculty not found" });
    
    const userID = user[0].UserID;
    const facultyID = faculty[0].FacultyID;
    
    await db.execute("UPDATE Lesson SET Name = ?, UserID = ?, FacultyID = ? WHERE LessonID = ?", [name, userID, facultyID, id]);
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
