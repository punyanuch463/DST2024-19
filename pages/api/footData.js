import db from "./db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: "Missing userId" });
      }

      const query = `
        SELECT 
          FootLength AS A,
          HeelToDistalMetatarsal AS B,
          MiddleFootWidth AS C,
          ApexOf1stMTH AS D,
          ApexOf5thMTH AS E,
          ApexOf1stTo5thMTH AS F,
          HeelWidth AS G,
          ArchHeight AS H,
          HeelToMiddleFoot AS I,
          Side
        FROM FootData
        WHERE UserID = ?
        LIMIT 1
      `;

      const [rows] = await db.execute(query, [userId]);

      if (rows.length === 0) {
        return res.status(404).json({ error: "FootData not found" });
      }

      res.status(200).json(rows[0]);
    } catch (error) {
      
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    try {
      const { userId, type, ...footMeasurements } = req.body;

      if (!userId || !type || Object.keys(footMeasurements).length === 0) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const insertQuery = `
        INSERT INTO FootData (
          UserID, 
          FootLength, 
          HeelToDistalMetatarsal, 
          MiddleFootWidth, 
          ApexOf1stMTH, 
          ApexOf5thMTH, 
          ApexOf1stTo5thMTH, 
          HeelWidth, 
          ArchHeight, 
          HeelToMiddleFoot, 
          Side
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        userId,
        footMeasurements.A ?? null,
        footMeasurements.B ?? null,
        footMeasurements.C ?? null,
        footMeasurements.D ?? null,
        footMeasurements.E ?? null,
        footMeasurements.F ?? null,
        footMeasurements.G ?? null,
        footMeasurements.H ?? null,
        footMeasurements.I ?? null,
        type,
      ];

      const [result] = await db.execute(insertQuery, values);

      if (result.affectedRows === 0) {
        return res.status(500).json({ error: "Failed to insert FootData" });
      }

      res.status(201).json({ message: "ข้อมูลถูกเพิ่มเรียบร้อย" });
    } catch (error) {
      
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "PUT") {
    try {
      const { userId, status, message, ...footMeasurements } = req.body;

      if (!userId || Object.keys(footMeasurements).length === 0) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const updateQuery = `
        UPDATE FootData 
        SET 
          FootLength = ?, 
          HeelToDistalMetatarsal = ?, 
          MiddleFootWidth = ?, 
          ApexOf1stMTH = ?, 
          ApexOf5thMTH = ?, 
          ApexOf1stTo5thMTH = ?, 
          HeelWidth = ?, 
          ArchHeight = ?, 
          HeelToMiddleFoot = ?
        WHERE UserID = ?
      `;

      const values = [
        footMeasurements.A ?? null,
        footMeasurements.B ?? null,
        footMeasurements.C ?? null,
        footMeasurements.D ?? null,
        footMeasurements.E ?? null,
        footMeasurements.F ?? null,
        footMeasurements.G ?? null,
        footMeasurements.H ?? null,
        footMeasurements.I ?? null,
        userId,
      ];
      
      const [result] = await db.execute(updateQuery, values);

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "FootData not found or no changes made" });
      }

      
      const [dateResult] = await db.execute(
        `SELECT 
    MAX(CASE WHEN f.ImageCategoryID = 1 THEN f.DateTime END) AS FirstDate,
    MAX(CASE WHEN f.ImageCategoryID = 8 THEN f.DateTime END) AS LastDate
  FROM FootImage f
  WHERE f.UserID = ?`,
        [userId]
      );

      const firstDate = dateResult[0]?.FirstDate || null;
      const lastDate = dateResult[0]?.LastDate || null;

      
      const [orderResult] = await db.execute(
        "INSERT INTO `Order` (UserID, Status, FirstDateTime, LastDateTime) VALUES (?, ?, ?, ?)",
        [userId, "รอดำเนินการ", firstDate, lastDate]
      );
      const orderId = orderResult.insertId;

      
      if (message) {
        await db.execute(
          "INSERT INTO Notification (OrderID, Message, isRead, Status, NotificationDateTime) VALUES (?, ?, 0, ?, NOW())",
          [orderId, message, status || "Unread"]
        );
      }

      
      const modifiedMessage = `โมเดลเท้า 3 มิติของผู้ใช้งานถูกสร้างแล้ว`;
      const adminIds = await db.execute("SELECT AdminID FROM Admin");
      for (let admin of adminIds[0]) {
        const adminId = admin.AdminID;
        await db.execute(
          "INSERT INTO NotificationForAdmin (OrderID, AdminID, Message, Status, isRead, NotificationDateTime) VALUES (?, ?, ?, ?, 0, NOW())",
          [orderId, adminId, modifiedMessage, status]
        );
      }

      res.status(200).json({ message: "ข้อมูลถูกบันทึกเรียบร้อย" });
    } catch (error) {
      
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
