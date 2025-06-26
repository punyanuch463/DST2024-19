import db from "../db"; 
import bcrypt from "bcrypt"; 

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { adminEmail, adminPassword } = req.body;

    try {
      
      const [admins] = await db.execute(
        `SELECT * FROM Admin 
         WHERE AdminEmail = ? `,
        [adminEmail]
      );
      if (admins.length === 0) {
        console.warn("No matching admin found.");
        return res
          .status(400)
          .json({ message: "ชื่อผู้ดูแลระบบหรือรหัสผ่านไม่ถูกต้อง" });
      }

      const admin = admins[0];

      
      const isPasswordValid = await bcrypt.compare(
        adminPassword,
        admin.AdminPassword
      );

      if (!isPasswordValid) {
        console.warn("Password incorrect.");
        return res
          .status(400)
          .json({ message: "ชื่อผู้ดูแลระบบหรือรหัสผ่านไม่ถูกต้อง" });
      }

      
      return res.status(200).json({
        AdminID: admin.AdminID,
        AdminEmail: admin.AdminEmail, 
      });
    } catch (error) {
      
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} ไม่ได้รับอนุญาต`);
  }
}
