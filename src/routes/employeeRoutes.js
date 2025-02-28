// studentRoutes.js-ը փոխված է աշխատելու համար employees աղյուսակի հետ

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

// Ստանալ բոլոր աշխատակիցներին (GET /employees)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM employees");
    res.json(rows);
  } catch (error) {
    console.error("❌ MySQL Error:", error);
    res.status(500).json({ message: "Database error" });
  }
});

// Ավելացնել աշխատակից (POST /employees)
router.post("/", async (req, res) => {
  try {
    const { FirstName, LastName, Institute, Role, Username, Password, Email, Profession } = req.body;
    if (!FirstName || !LastName || !Institute || !Username || !Password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [result] = await db.query(
      "INSERT INTO employees (FirstName, LastName, Institute, Role, Username, Password, Email, Profession) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [FirstName, LastName, Institute, Role, Username, Password, Email, Profession]
    );

    res.json({ UserID: result.insertId, FirstName, LastName, Institute, Role, Username, Email, Profession });
  } catch (error) {
    console.error("❌ MySQL Error:", error);
    res.status(500).json({ message: "Database error" });
  }
});

// Թարմացնել աշխատակից (PUT /employees/:id)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { FirstName, LastName, Institute, Role, Username, Password, Email, Profession } = req.body;

    const [result] = await db.query(
      "UPDATE employees SET FirstName=?, LastName=?, Institute=?, Role=?, Username=?, Password=?, Email=?, Profession=? WHERE UserID=?",
      [FirstName, LastName, Institute, Role, Username, Password, Email, Profession, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ UserID: id, FirstName, LastName, Institute, Role, Username, Email, Profession });
  } catch (error) {
    console.error("❌ MySQL Error:", error);
    res.status(500).json({ message: "Database error" });
  }
});

// Ջնջել աշխատակից (DELETE /employees/:id)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM employees WHERE UserID=?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully", UserID: id });
  } catch (error) {
    console.error("❌ MySQL Error:", error);
    res.status(500).json({ message: "Database error" });
  }
});

export default router;
