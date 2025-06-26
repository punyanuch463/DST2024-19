

import db from "../db"; 

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, imageCategoryId, side, pathUrl, orderId } = req.body;

    if (!userId || !imageCategoryId || !side || !pathUrl || !orderId) {
      return res.status(400).json({ error: "All fields are required" });
    }
    try {
      
      const [result] = await db.execute(
        "INSERT INTO FootImage (UserId, ImageCategoryID, Side, PathUrl) VALUES (?, ?, ?, ?)",
        [userId, imageCategoryId, side, pathUrl]
      );

      let dateTime = null;

      
      const [imageData] = await db.execute(
        "SELECT DateTime FROM FootImage WHERE FootImageID = ?",
        [result.insertId]
      );
      
      dateTime = imageData[0]?.DateTime || null;
      

      if (dateTime) {
        if (imageCategoryId === 1 && dateTime) {
          await db.execute(
            `UPDATE \`Order\` 
           SET FirstDateTime = ? 
           WHERE OrderID = ?`,
            [dateTime, orderId]
          );
        } else if (imageCategoryId === 8) {
          await db.execute(
            "UPDATE `Order` SET LastDateTime = ? WHERE UserID = ? ORDER BY OrderID DESC LIMIT 1",
            [dateTime, userId]
          );
        }
      }

      res.status(200).json({
        message: "Image saved successfully",
        id: result.insertId,
        dateTime,
      });
    } catch (error) {
      console.error("Error saving image:", error);
      res.status(500).json({ error: "Error saving image" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
