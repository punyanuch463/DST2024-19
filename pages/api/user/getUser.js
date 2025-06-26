import db from "../db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { UserId } = req.query;

    if (!UserId) {
      return res.status(400).json({ message: "UserId is required." });
    }

    
    try {
      const userData = await db.query("SELECT * FROM User WHERE UserId = ?", [
        UserId,
      ]);
      if (userData.length === 0) {
        return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });
      }

      return res.status(200).json(userData[0]);
    } catch (error) {
      
      return res.status(500).json({ message: "Internal server error." });
    }
  } else if (req.method === "POST") {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "ต้องการ userid" });
    }

    
    try {
      const userData = await db.query("SELECT * FROM User WHERE UserId = ?", [
        userId,
      ]);
      if (userData.length === 0) {
        return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });
      }

      return res.status(200).json(userData[0]);
    } catch (error) {
      
      return res.status(500).json({ message: "Internal server error." });
    }
  } else {
    
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
