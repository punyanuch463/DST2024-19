import db from "./db"; 

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { userId, side } = req.query;

      if (!userId || !side) {
        return res.status(400).json({ error: "Missing userId or side" });
      }

      const query = `
        SELECT Foot3DPath 
        FROM Foot3D
        WHERE UserID = ? AND Side = ?
        LIMIT 1
      `;

      const [rows] = await db.execute(query, [userId, side]);

      if (rows.length === 0) {
        return res.status(404).json({ error: "Foot3D model not found" });
      }

      res.status(200).json({ Foot3DPath: rows[0].Foot3DPath });
    } catch (error) {
      
      res.status(500).json({ error: "Internal Server Error" });
    }
  } 
  else if (req.method === "POST") {
    try {
      const { userId, side, foot3DPath } = req.body;

      if (!userId || !side || !foot3DPath) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const insertQuery = `
        INSERT INTO Foot3D (UserID, Side, Foot3DPath)
        VALUES (?, ?, ?)
      `;

      const values = [userId, side, foot3DPath];

      const [result] = await db.execute(insertQuery, values);

      if (result.affectedRows === 0) {
        return res.status(500).json({ error: "Failed to insert Foot3D data" });
      }

      res.status(201).json({ message: " Foot3D data inserted successfully" });
    } catch (error) {
      
      res.status(500).json({ error: "Internal Server Error" });
    }
  } 
  else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
