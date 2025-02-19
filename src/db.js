import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config(); // ✅ Կարդում է .env ֆայլի պարամետրերը

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL!");

  // Ստեղծենք աղյուսակը, եթե այն գոյություն չունի
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS schedule (
      id INT AUTO_INCREMENT PRIMARY KEY,
      day VARCHAR(20),
      period INT,
      name VARCHAR(255),
      group_name VARCHAR(100),
      professor VARCHAR(100),
      audience VARCHAR(100)
    );
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error("❌ Error creating table:", err);
    } else {
      console.log("✅ Schedule table is ready!");
    }
  });
});

export default db;
