import db from "../db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { AdminID, code } = req.body;

    
    if (!AdminID || !code) {
      console.warn("Missing AdminID or code in the request body.");
      return res.status(400).json({ error: "กรุณากรอก Verification Code ." });
    }

    try {
      
      const [verificationRecords] = await db.execute(
        `SELECT * FROM EmailVerificationForAdmin 
         WHERE AdminID = ? AND VerificationCode = ? AND ExpirationDate > NOW() AND Verified = FALSE`,
        [AdminID, code]
      );

      if (verificationRecords.length === 0) {
        console.warn(
          "No matching verification records found or code has expired."
        );
        return res
          .status(400)
          .json({ error: "Verification code ไม่ถูกต้องหรือหมดอายุ." });
      }

      
      await db.execute(
        `UPDATE EmailVerificationForAdmin 
         SET Verified = TRUE 
         WHERE AdminID = ? AND VerificationCode = ?`,
        [AdminID, code]
      );

      return res.status(200).json({ message: "Verification successful!" });
    } catch (error) {
      
      return res.status(500).json({ error: "Internal server error ." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`405 ${req.method} Not Allowed`);
  }
}
