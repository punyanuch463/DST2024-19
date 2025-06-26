import db from "./db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const query = `
        SELECT 
            u.UserID, 
            u.Username, 
            f.Foot3DPath, 
            f.Side
        FROM User u
        LEFT JOIN Foot3D f 
            ON u.UserID = f.UserID
        WHERE f.Foot3DID = (
            SELECT MAX(f2.Foot3DID) 
            FROM Foot3D f2 
         WHERE f2.UserID = u.UserID AND f2.Side = 'Right'
        );
      `;

      const [rows] = await db.execute(query);
      res.status(200).json(rows);
    } catch (error) {
      
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
