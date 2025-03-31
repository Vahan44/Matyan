import express from "express";
import nodemailer from "nodemailer";
import cron from "node-cron";
import fetch from "node-fetch";
import mysql from "mysql2/promise"; // ✅ Օգտագործիր promise wrapper



const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});
const router = express.Router();

// Ստեղծում ենք transporter-ը (Mailer configuration)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_ADDRESS,  // քո Gmail էլ․ փոստի հասցեն
        pass: process.env.APP_PASSWORD,  // Գաղտնաբառը կամ app-password
    },
});

// Ուղարկում ենք զգուշացնող նամակ ուսանողին
const sendWarningEmail = (student) => {
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,  
        to: student.email,
        subject: "Բացակայությունների մասին զգուշացում",
        text: `Բարև ${student.firstName} ${student.lastName},\n\nԴուք ունեք ${student.absence_count*2} բացակա: Խնդրում ենք հետևողական լինել այդ հարցում։\n\Հարգանքներով ՀԱՊՀ։`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log("Error sending email:", err);
        } else {
            console.log("Email sent:", info.response);
        }
    });
};

// Ստուգում ենք ուսանողների բացակաները և ուղարկում նամակ
router.get("/check-absences", async (req, res) => {
    const MAX_ABSENCES = 30; // Թույլատրելի բացակաների սահման

    const query = `
        SELECT s.id, s.firstName, s.lastName, s.email, COUNT(a.AttID) AS absence_count
        FROM students s
        JOIN attendance a ON s.id = a.StudentID
        WHERE a.Status = 'բացակա'
        GROUP BY s.id, s.firstName, s.lastName, s.email
        HAVING absence_count > ?
    `;

    try {
        const [results] = await db.query(query, [MAX_ABSENCES]);

        results.forEach((student) => {
            sendWarningEmail(student);
        });

        res.json({ message: "Բացակաները ստուգվեցին, նամակները ուղարկվել են", affectedStudents: results.length });
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Սխալ հարցման ժամանակ", details: err });
    }
});


cron.schedule("40 22 21 * * *", async () => {
    try {
        const response = await fetch("http://localhost:5000/api/mail/check-absences");
        const data = await response.json();
        console.log("Absence check completed:", data);
    } catch (err) {
        console.error("Error checking absences:", err);
    }
});



export default router;
