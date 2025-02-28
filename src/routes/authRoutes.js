import express from "express";
import bcrypt from 'bcryptjs';
import db from "../db.js"; // ✅ Ավելացրել ենք տվյալների բազայի միացումը

const router = express.Router();

router.post("/login", (req, res) => { // ✅ Ուղին ուղղվել է
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const query = "SELECT * FROM Employees WHERE Username = ?";
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];

    try {
      const passwordMatch = await bcrypt.compare(password, user.Password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      delete user.Password; // ✅ Գաղտնաբառը հեռացվել է պատասխանից

      res.json({ message: "Login successful", user });
    } catch (bcryptError) {
      console.error("Bcrypt error:", bcryptError);
      return res.status(500).json({ message: "Server error" });
    }
  });
});

export default router;
