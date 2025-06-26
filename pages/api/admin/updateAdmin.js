import { parse } from "cookie";
import db from "../db"; 

export default async function handler(req, res) {
  if (req.method === "POST") {
    
    const cookie = req.headers.cookie;

    
    if (!cookie) {
      return res.status(401).json({ message: "ไม่พบ session cookie" });
    }

    
    const { "session-admin": AdminID } = parse(cookie); 

    
    if (!AdminID) {
      return res.status(400).json({ message: "ไม่พบ AdminID ใน session" });
    }

    const {
      fullName,
      gender,
      birthDate,
      height,
      PathProfileImage,
      address,
      houseNumber,
      street,
      city,
      district,
      province,
      zip_code,
    } = req.body;

    try {
      
      const query = `
        UPDATE Admin 
        SET 
          FullName = ?, 
          Gender = ?, 
          BirthDate = ?, 
          Height = ?, 
          PathProfileImage = ?,
           Address = ?,
        houseNumber = ?,
        street = ?,
        city = ?,
        district = ?,
        province = ?,
        zip_code = ?
          
        WHERE AdminID = ?
      `;

      const values = [
        fullName || null,
        gender || null,
        birthDate || null,
        height || null,
        PathProfileImage || null,
        address || null,
        houseNumber || null,
        street || null,
        city || null,
        district || null,
        province || null,
        zip_code || null,
        AdminID,
      ];

      await db.execute(query, values);

      res.status(200).json({ message: "ข้อมูลของผู้ดูแลระบบถูกอัปเดตสำเร็จ" });
    } catch (error) {
      
      res.status(500).json({ message: "ไม่สามารถอัปเดตข้อมูลผู้ดูแลระบบ" });
    }
  } else {
    res.status(405).json({ message: "405 Method Not Allowed" });
  }
}
