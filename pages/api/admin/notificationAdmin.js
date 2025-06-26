import db from "../db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const AdminID = req.headers["admin-id"]; 
      if (!AdminID) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      
      const [notifications] = await db.execute(
        `SELECT n.NotificationID, n.OrderID, n.Message, n.isRead, n.NotificationDateTime, n.Status
        FROM NotificationForAdmin n
        JOIN \`Order\` o ON n.OrderID = o.OrderID
        JOIN Admin a ON n.AdminID = a.AdminID
        WHERE n.AdminID = ? 
        ORDER BY n.NotificationDateTime DESC`,
        [AdminID]
      );

      res.status(200).json({ notifications });
    } catch (error) {
      
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  
  else if (req.method === "POST") {
    const { adminId, orderId, message, status } = req.body;

    if (!adminId || !orderId || !message) {
      return res
        .status(400)
        .json({ message: "Missing required fields", receivedData: req.body });
    }

    try {
      
      await db.execute(
        "INSERT INTO NotificationForAdmin (OrderID, AdminID, Message, isRead, Status, NotificationDateTime) VALUES (?, ?, ?, 0, ?, NOW())",
        [orderId, adminId, message, status]
      );

      res.status(201).json({
        success: true,
        message: "Notification created successfully",
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
        "UPDATE NotificationForAdmin SET Status = 'Read', isRead = 1 WHERE NotificationID = ?",
        [notificationId]
      );
      res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
      
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  
  else if (req.method === "DELETE") {
    const { notificationIds, deleteAll } = req.body;

    try {
      if (deleteAll) {
        await db.execute(`DELETE FROM NotificationForAdmin`);
        return res.status(200).json({ message: "All notifications deleted" });
      } else if (
        notificationIds &&
        Array.isArray(notificationIds) &&
        notificationIds.length > 0
      ) {
        await db.execute(
          `DELETE FROM NotificationForAdmin WHERE NotificationID IN (${notificationIds
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
