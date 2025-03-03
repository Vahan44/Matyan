import express from 'express';
import mysql from 'mysql2';  // MySQL2 գրադարան

const router = express.Router();

// MySQL միացում
const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Ֆակուլտետների ցուցակ
router.get('/', (req, res) => {
  db.query('SELECT * FROM institute', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);  
  });

  
  
});

export default router;
