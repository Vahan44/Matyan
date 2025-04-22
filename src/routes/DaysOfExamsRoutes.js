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

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [daysofexams] = await db.execute(`SELECT * FROM daysofexams`);
    res.json(daysofexams);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// Add a daysofexams
router.post("/", async (req, res) => {
  const { Name, month, day, year, UserID, FacultyID, group_, midNum } = req.body;
  try {
    // Finding UserID based on userName

    
    
    await db.execute("INSERT INTO daysofexams (Name, month, day, year, UserID, FacultyID, group_, midNum) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [Name, month, day, year, UserID, FacultyID, group_, midNum]);
    res.status(201).json({ message: "daysofexams added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// Update a daysofexams
router.put("/:id", async (req, res) => {
  const { Name, month, day, year, UserID, FacultyID, group_, midNum } = req.body;
  const { id } = req.params; // վերականգնում ենք `id`-ին, որը ուղարկվում է URL-ում

  try {
    await db.execute(
      "UPDATE daysofexams SET Name = ?, month = ?, day = ?, year = ?, UserID = ?, FacultyID = ?, group_ = ?, midNum= ?  WHERE id = ?",
      [ Name, month, day, year, UserID, FacultyID, group_,midNum, id]
    );
    res.json({ message: "daysofexams updated successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});


// Delete a daysofexams
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM daysofexams WHERE id = ?", [id]);
    res.json({ message: "daysofexams deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
