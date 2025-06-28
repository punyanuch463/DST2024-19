import db from "../db"; 
import bcrypt from "bcrypt"; 

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { usernameOrEmail, UserPassWord } = req.body;

    try {
      
      const [users] = await db.execute(
        `SELECT * FROM User 
         WHERE UserEmail = ? OR UserName = ?`,
        [usernameOrEmail, usernameOrEmail]
      );

      if (users.length === 0) {
        console.warn("No matching user found.");
        return res
          .status(400)
          .json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
      }

      const user = users[0];

      
      const isPasswordValid = await bcrypt.compare(
        UserPassWord,
        user.UserPassWord
      );

      if (!isPasswordValid) {
        console.warn("Password incorrect.");
        return res
          .status(400)
          .json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
      }

      
      return res.status(200).json({
        UserId: user.UserId,
        UserEmail: user.UserEmail, 
      });
    } catch (error) {
      
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} ไม่ได้รับอนุญาต`);
  }
}
