import express from "express";
import mysql from "mysql2/promise";

const router = express.Router();

// MySQL կապ
const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Ստանալ բոլոր ուսանողներին (GET /students)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM students");
    res.json(rows);
  } catch (error) {
    console.error("❌ MySQL Error:", error);
    res.status(500).json({ message: "Database error" });
  }
});

// Ավելացնել ուսանող (POST /students)
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, patronymic, course, group_, subgroup, email } = req.body;

    if (!firstName || !lastName || !course || !group_ || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [result] = await db.query(
      "INSERT INTO students (firstName, lastName, patronymic, course, group_, subgroup, email) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [firstName, lastName, patronymic, course, group_, subgroup, email]
    );

    const newStudent = { id: result.insertId, firstName, lastName, patronymic, course, group_, subgroup, email };
    res.json(newStudent);
  } catch (error) {
    console.error("❌ MySQL Error:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Database error" });
  }
});

// Թարմացնել ուսանող (PUT /students/:id)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, patronymic, course, group_, subgroup, email } = req.body;

    const [result] = await db.query(
      "UPDATE students SET firstName=?, lastName=?, patronymic=?, course=?, group_=?, subgroup=?, email=? WHERE id=?",
      [firstName, lastName, patronymic, course, group_, subgroup, email, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ id, firstName, lastName, patronymic, course, group_, subgroup, email });
  } catch (error) {
    console.error("❌ MySQL Error:", error);
    res.status(500).json({ message: "Database error" });
  }
});

// Ջնջել ուսանող (DELETE /students/:id)
router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await db.query("DELETE FROM students WHERE id=?", [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Student not found" });
      }
  
      res.json({ message: "Student deleted successfully", id });
    } catch (error) {
      console.error("❌ MySQL Error:", error);
      res.status(500).json({ message: "Database error" });
    }
  });

export default router;
