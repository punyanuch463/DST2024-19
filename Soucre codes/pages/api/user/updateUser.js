import { parse } from "cookie";
import db from "../db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const cookie = req.headers.cookie;
  if (!cookie) {
    return res.status(401).json({ message: "ไม่พบ session cookie" });
  }

  const { session } = parse(cookie);
  if (!session) {
    return res.status(400).json({ message: "Session ไม่ถูกต้อง" });
  }

  try {
    const UserId = parseInt(session, 10);
    if (isNaN(UserId)) {
      return res.status(400).json({ message: "UserId ไม่ถูกต้อง" });
    }

    const {
      fullName,
      gender,
      birthday,
      heightCM,
      shoeSizeEU,
      shoeSizeCM,
      PathProfileImage,
      address,
      houseNumber,
      street,
      district,
      city,
      province,
      zip_code,
    } = req.body;
    if (birthday && !/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
      return res.status(400).json({ message: "รูปแบบวันเกิดไม่ถูกต้อง" });
    }

    const query = `
      UPDATE User 
      SET 
        FullName = ?, 
        Gender = ?, 
        BirthDate = ?, 
        HeightCM = ?, 
        FootSizeEU = ?, 
        FootSizeCM = ?, 
        PathProfileImage = ?,
        Address = ?,
        houseNumber = ?,
        street = ?,
        city = ?,
        district = ?,
        province = ?,
        zip_code = ?
      WHERE UserId = ?
    `;

    const values = [
      fullName || null,
      gender || null,
      birthday || null,
      heightCM || null,
      shoeSizeEU || null,
      shoeSizeCM || null,
      PathProfileImage || null,
      address || null,
      houseNumber || null,
      street || null,
      city || null,
      district || null,
      province || null,
      zip_code || null,
      UserId,
    ];

    await db.execute(query, values);
    res.status(200).json({ message: "อัปเดตข้อมูลผู้ใช้สำเร็จ" });
  } catch (error) {
    
    res.status(500).json({ message: "เกิดข้อผิดพลาดขณะอัปเดตข้อมูลผู้ใช้" });
  }
}
