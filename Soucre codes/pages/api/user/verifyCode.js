

import db from "../db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { UserId, code } = req.body;

    
    if (!UserId || !code) {
      console.warn("Missing UserId or code in the request body.");
      return res.status(400).json({ error: "กรุณากรอก Verification Code  ." });
    }

    try {
      const [verificationRecords] = await db.execute(
        `SELECT * FROM EmailVerificationForUser 
         WHERE UserId = ? AND VerificationCode = ? 
          `,
        [UserId, code]
      );

      if (verificationRecords.length === 0) {
        console.warn("No matching verification records found.");
        return res
          .status(400)
          .json({ error: " Verification code ไม่ถูกต้องหรือหมดอายุ." });
      }

      return res.status(200).json({ message: "Verification successful!" });
    } catch (error) {
      
      return res.status(500).json({ error: "Internal server error ." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`405 ${req.method} Not Allowed`);
  }
}
