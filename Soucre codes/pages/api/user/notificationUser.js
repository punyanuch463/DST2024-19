import db from "../db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    try {
      const [notifications] = await db.execute(
        `SELECT n.NotificationID, n.OrderID, n.Message, n.isRead ,u.Username, n.NotificationDateTime, n.Status
            FROM Notification n
            JOIN \`Order\` o ON n.OrderID = o.OrderID
            JOIN User u ON o.UserID = u.UserID
            WHERE o.UserID = ?
            ORDER BY n.NotificationDateTime DESC`,
        [userId]
      );

      res.status(200).json({ notifications });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  
  else if (req.method === "POST") {
    const { userId, message, status } = req.body;

    if (!userId || !message) {
      return res
        .status(400)
        .json({ message: "Missing required fields", receivedData: req.body });
    }

    try {
      
      const adminIds = await db.execute("SELECT AdminID FROM Admin");
      
      const [orderResult] = await db.execute(
        "INSERT INTO `Order` (UserID, Status) VALUES (?, ?)",
        [userId, "รอดำเนินการ"]
      );
      const orderId = orderResult.insertId;

      
      await db.execute(
        "INSERT INTO Notification (OrderID, Message, isRead, Status, NotificationDateTime) VALUES (?, ?, 0, ?, NOW())",
        [orderId, message, status]
      );

      for (let admin of adminIds[0]) {
        const adminId = admin.AdminID; 
        const modifiedMessage = `ผู้ใช้งานส่งรูปภาพเท้าเข้าระบบแล้ว `;
        
        await db.execute(
          "INSERT INTO NotificationForAdmin (OrderID, AdminID, Message, Status, isRead, NotificationDateTime) VALUES (?, ?, ?, ?, 0, NOW())",
          [orderId, adminId, modifiedMessage, status]
        );
      }

      res.status(201).json({
        success: true,
        message: "Order and Notification created successfully",
        orderId,
      });
    } catch (error) {
      
      res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  
  else if (req.method === "PUT") {
    const { notificationId } = req.body;

    if (!notificationId) {
      return res.status(400).json({ message: "Missing notificationId" });
    }

    try {
      await db.execute(
        "UPDATE Notification SET Status = 'Read', isRead = 1 WHERE NotificationID = ?",
        [notificationId]
      );
      res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
      
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  
  else if (req.method === "DELETE") {
    const { notificationIds, deleteAll, userId } = req.body;

    try {
      if (deleteAll) {
        if (!userId) {
          return res.status(400).json({ message: "Missing userId" });
        }

        await db.execute(
          `DELETE FROM Notification WHERE OrderID IN (SELECT OrderID FROM \`Order\` WHERE UserID = ?)`,
          [userId]
        );
        return res.status(200).json({ message: "All notifications deleted" });
      } else if (
        notificationIds &&
        Array.isArray(notificationIds) &&
        notificationIds.length > 0
      ) {
        await db.execute(
          `DELETE FROM Notification WHERE NotificationID IN (${notificationIds
            .map(() => "?")
            .join(",")})`,
          notificationIds
        );
        return res
          .status(200)
          .json({ message: "Selected notifications deleted" });
      } else {
        return res
          .status(400)
          .json({ message: "Invalid request: No notifications specified" });
      }
    } catch (error) {
      
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
