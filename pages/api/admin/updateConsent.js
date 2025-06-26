import db from "../db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { Adminid, consent } = req.body;

  if (!Adminid || typeof consent !== "boolean") {
    return res
      .status(400)
      .json({ error: "กรุณาระบุ Id และค่า consent ที่ถูกต้อง" });
  }

  try {
    const query = `UPDATE Admin SET Consent = ? WHERE AdminID = ?`;
    const values = [consent, Adminid];
    const [result] = await db.execute(query, values);

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "อัปเดต Consent สำเร็จ" });
    } else {
      return res.status(404).json({ error: "ไม่พบผู้ใช้ในฐานข้อมูล" });
    }
  } catch (error) {
    
    return res
      .status(500)
      .json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล consent" });
  }
}
