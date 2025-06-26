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
    const {
      AdminName,
      AdminPassword,
      AdminEmail,
      PhoneNumber,
      FullName,
      Gender,
      BirthDate,
      Height,
    } = req.body;

    if (!AdminName || !AdminPassword || !AdminEmail) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(AdminEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!isStrongPassword(AdminPassword)) {
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
    const hashedPassword = await bcrypt.hash(AdminPassword, saltRounds);

    const connection = await db.getConnection();

    try {
   
      await connection.beginTransaction();

      const [existingAdmins] = await connection.execute(
        "SELECT * FROM Admin WHERE AdminEmail = ?",
        [AdminEmail]
      );
      if (existingAdmins.length > 0) {
        await connection.rollback();
        return res.status(400).json({
          message: "คุณมีอีเมลอยู่ในระบบ กรุณาใช้อีเมลใหม่ หรือ เข้าสู่ระบบ",
        });
      }

      const insertAdminQuery = `
        INSERT INTO Admin (AdminName, AdminPassword, AdminEmail, PhoneNumber, FullName, Gender, BirthDate, Height) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const adminValues = [
        AdminName,
        hashedPassword,
        AdminEmail,
        PhoneNumber || null,
        FullName || null,
        Gender || null,
        BirthDate || null,
        Height || null,
      ];
      const [adminResult] = await connection.execute(
        insertAdminQuery,
        adminValues
      );
      const newAdminId = adminResult.insertId;

      const verificationCode = generateCode();
      const expirationDate = new Date(Date.now() + 60 * 60 * 1000); 

      
      const insertVerificationQuery = `
        INSERT INTO EmailVerificationForAdmin (AdminID, VerificationCode, ExpirationDate, Verified)
        VALUES (?, ?, ?, FALSE)
      `;
      await connection.execute(insertVerificationQuery, [
        newAdminId,
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
        to: AdminEmail,
        subject: "การยืนยันอีเมล",
        text: `สวัสดี ${AdminName} ค่ะ,\n\nรหัสการยืนยันของคุณคือ: ${verificationCode}\n\nรหัสนี้จะหมดอายุใน 1 ชั่วโมง.\n\nขอบคุณค่ะ!`,
      };
      await transporter.sendMail(mailOptions);

      
      await connection.commit();

      res.status(201).json({
        message: "Admin registered successfully. Verification email sent.",
        AdminId: newAdminId,
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
