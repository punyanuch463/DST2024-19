import db from "../db";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";


const generateCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase(); 
};


const isStrongPassword = (password) => {
  const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-])[A-Za-z\d@$!%*?&_\-]{8,}$/;
  return strongPasswordRegex.test(password);
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { UserName, UserPassWord, UserEmail, PhoneNumber } = req.body;

    
    if (!UserName || !UserPassWord || !UserEmail) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(UserEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    
    if (!isStrongPassword(UserPassWord)) {
      return res.status(400).json({
        message:
          "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร และรวมตัวอักษรใหญ่ ตัวอักษรเล็ก ตัวเลข และสัญลักษณ์พิเศษ",
      });
    }
  
  const phoneRegex = /^\d{10}$/;
  if (PhoneNumber && !phoneRegex.test(PhoneNumber)) {
    return res.status(400).json({
      message: "หมายเลขโทรศัพท์ต้องมี 10 หลักและเป็นตัวเลขเท่านั้น",
    });
  }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(UserPassWord, saltRounds);

    const connection = await db.getConnection(); 

    try {
      
      await connection.beginTransaction();

      
      const [existingUsers] = await connection.execute(
        "SELECT * FROM User WHERE UserEmail = ?",
        [UserEmail]
      );
      if (existingUsers.length > 0) {
        await connection.rollback();
        return res.status(400).json({
          message: "คุณมีอีเมลอยู่ในระบบ กรุณาใช้อีเมลใหม่ หรือ เข้าสู่ระบบ",
        });
      }

      
      const insertUserQuery = `
        INSERT INTO User (UserName, UserPassWord, UserEmail, PhoneNumber) 
        VALUES (?, ?, ?, ?)
      `;
      const userValues = [
        UserName,
        hashedPassword,
        UserEmail,
        PhoneNumber || null,
      ];
      const [userResult] = await connection.execute(
        insertUserQuery,
        userValues
      );
      const newUserId = userResult.insertId;

      
      const verificationCode = generateCode();
      const expirationDate = new Date(Date.now() + 60 * 60 * 1000); 

      
      const insertVerificationQuery = `
        INSERT INTO EmailVerificationForUser (UserId, VerificationCode, ExpirationDate, Verified)
        VALUES (?, ?, ?, FALSE)
      `;
      await connection.execute(insertVerificationQuery, [
        newUserId,
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
        to: UserEmail,
        subject: "การยืนยันอีเมล",
        text: `สวัสดี ${UserName} ค่ะ,\n\nรหัสการยืนยันของคุณคือ: ${verificationCode}\n\nรหัสนี้จะหมดอายุใน 1 ชั่วโมง.\n\nขอบคุณค่ะ!`,
      };

      await transporter.sendMail(mailOptions);

      
      await connection.commit();

      res.status(201).json({
        message: "User registered successfully. Verification email sent.",
        UserId: newUserId,
      });
    } catch (error) {
      
      await connection.rollback();
      
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    } finally {
      
      connection.release();
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
