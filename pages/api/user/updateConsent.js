import db from "../db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { userId, consent } = req.body;

  if (!userId || typeof consent !== "boolean") {
    return res
      .status(400)
      .json({ error: "กรุณาระบุ userId และค่า consent ที่ถูกต้อง" });
  }

  try {
    const query = `UPDATE User SET Consent = ? WHERE UserId = ?`;
    const values = [consent, userId];
    const [result] = await db.execute(query, values);

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "อัปเดตข้อมูลยินยอมสำเร็จ" });
    } else {
      return res.status(404).json({ error: "ไม่พบผู้ใช้ในฐานข้อมูล" });
    }
  } catch (error) {
    
    return res
      .status(500)
      .json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูลยินยอม" });
  }
}
