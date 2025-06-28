import db from "../db";
import nodemailer from "nodemailer";


const generateCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase(); 
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { UserId, code } = req.body;

    if (code) {
      
      try {
        
        const [verificationRecords] = await db.execute(
          "SELECT * FROM EmailVerificationForUser WHERE UserId = ? AND VerificationCode = ? AND Verified = FALSE AND ExpirationDate > NOW() ORDER BY VerificationID DESC LIMIT 1",
          [UserId, code]
        );

        if (verificationRecords.length === 0) {
          return res
            .status(400)
            .json({ error: "Incorrect or expired verification code." });
        }

        
        await db.execute(
          "UPDATE EmailVerificationForUser SET Verified = TRUE WHERE VerificationID = ?",
          [verificationRecords[0].VerificationID]
        );

        return res.status(200).json({ message: "Verification successful!" });
      } catch (error) {
        
        return res.status(500).json({ error: "Internal server error." });
      }
    } else if (UserId) {
      
      try {
        
        const [users] = await db.execute(
          "SELECT UserEmail FROM User WHERE UserId = ?",
          [UserId]
        );
        if (users.length === 0) {
          return res.status(404).json({ message: "ไม่พบผู้ใช้งาน." });
        }
        const userEmail = users[0].UserEmail;

        
        const verificationCode = generateCode();

        
        const expirationDate = new Date(Date.now() + 60 * 60 * 1000); 

        
        const insertQuery = `
          INSERT INTO EmailVerificationForUser (UserId, VerificationCode, ExpirationDate, Verified)
          VALUES (?, ?, ?, FALSE)
        `;
        await db.execute(insertQuery, [
          UserId,
          verificationCode,
          expirationDate,
        ]);

        
        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS, 
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: userEmail,
          subject: "Verification Code",
          text: `Your verification code is: ${verificationCode}`,
        };

        await transporter.sendMail(mailOptions);

        return res
          .status(200)
          .json({ message: "Verification email sent successfully!" });
      } catch (error) {
        
        return res.status(500).json({ error: "ส่งอีเมลไม่ได้." });
      }
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`405 ${req.method} Not Allowed`);
  }
}
