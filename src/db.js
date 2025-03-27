import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config(); 

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
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS schedule (
      ClassScheduleID INT AUTO_INCREMENT PRIMARY KEY,
      day VARCHAR(20),
      period INT,
      course VARCHAR(100),
      name VARCHAR(255),
      group_name VARCHAR(100),
      professor VARCHAR(100),
      audience VARCHAR(100),
      classroom VARCHAR(100)
    );
  `;

    const createEmployeesTable = `
    CREATE TABLE IF NOT EXISTS Employees (
      UserID INT AUTO_INCREMENT PRIMARY KEY,
      FirstName VARCHAR(100) NOT NULL,
      LastName VARCHAR(100) NOT NULL,
      Institute VARCHAR(100) NOT NULL,
      Role VARCHAR(50),
      Username VARCHAR(100) UNIQUE NOT NULL,
      Password VARCHAR(255) NOT NULL,
      Email VARCHAR(150) UNIQUE,
      Profession VARCHAR(100)
    );
  `;

  const createStudentsTable = `
  CREATE TABLE IF NOT EXISTS \`students\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`recordNumber\` INT NOT NULL,
    \`firstName\` VARCHAR(50) NOT NULL,
    \`lastName\` VARCHAR(50) NOT NULL,
    \`patronymic\` VARCHAR(50),
    \`course\` VARCHAR(50) NOT NULL,
    \`group_\` VARCHAR(50) NOT NULL,
    \`subgroup\` VARCHAR(50),
    \`email\` VARCHAR(100) UNIQUE NOT NULL
  );
`;

const createLessonsTable = `
CREATE TABLE IF NOT EXISTS Lesson (
    LessonID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    UserID INT NOT NULL,
    FacultyID INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Employees(UserID) ON DELETE CASCADE,
    FOREIGN KEY (FacultyID) REFERENCES Faculty(FacultyID) ON DELETE CASCADE
);

`;


  db.query(createEmployeesTable, (err) => {
    if (err) {
      console.error("❌ Error creating Employees table:", err);
    } else {
      console.log("✅ Employees table is ready!");
    }
  });
  db.query(createTableQuery, (err) => {
    if (err) {
      console.error("❌ Error creating table:", err);
    } else {
      console.log("✅ Schedule table is ready!");
    }
  });

  db.query(createStudentsTable, (err) => {
    if (err) {
      console.error("❌ Error creating Students table:", err);
    } else {
      console.log("✅ Students table is ready!");
    }
  });

  db.query(createLessonsTable, (err) => {
    if (err) {
      console.error("❌ Error creating Lessons table:", err);
    } else {
      console.log("✅ Lessons table is ready!");
    }
  })


  
});

export default db;
