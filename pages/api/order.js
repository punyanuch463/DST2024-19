import { parse } from "cookie";
import db from "./db"; 

export default async function handler(req, res) {
  try {
   
    if (req.method === "POST") {
      const [orderResult] = await db.query(
        "INSERT INTO `Order` (UserId) VALUES (?)",
        [userId]
      );
      const orderId = orderResult.insertId;

      const [orderRows] = await db.query(
        "SELECT * FROM `Order` WHERE OrderID = ?",
        [orderId]
      );

      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        order: orderRows[0], 
      });
    } 
    else if (req.method === "GET") {
      if (req.query.allUserIds) {
        
        const [users] = await db.query("SELECT UserID FROM User");
        let allOrders = [];

        for (let user of users) {
          const { UserID } = user;
          const [orders] = await db.query(
            `SELECT 
              o.*, 
              u.Username,
              MAX(CASE WHEN f.ImageCategoryID = 1 THEN f.DateTime END) AS FirstDate,
              MAX(CASE WHEN f.ImageCategoryID = 8 THEN f.DateTime END) AS LastDate
            FROM \`Order\` o
            JOIN User u ON o.UserID = u.UserID
            LEFT JOIN FootImage f ON o.UserID = f.UserID
            WHERE o.UserID = ?
            GROUP BY o.OrderID;`,
            [UserID] 
          );
          allOrders = allOrders.concat(orders);
        }

        return res.status(200).json({
          success: true,
          allOrders,
        });

      } else {
        
         const cookie = req.headers.cookie;
    if (!cookie)
      return res
        .status(401)
        .json({ success: false, message: "No session found" });

    const { session: userId } = parse(cookie);
    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "No userId in session" });
        const [orders] = await db.query(
          `SELECT 
            o.*, 
            u.Username,
            MAX(CASE WHEN f.ImageCategoryID = 1 THEN f.DateTime END) AS FirstDate,
            MAX(CASE WHEN f.ImageCategoryID = 8 THEN f.DateTime END) AS LastDate
          FROM \`Order\` o
          JOIN User u ON o.UserID = u.UserID
          LEFT JOIN FootImage f ON o.UserID = f.UserID
          WHERE o.UserID = ?
          GROUP BY o.OrderID;`,
          [userId]
        );

        return res.status(200).json({
          success: true,
          orders,
        });
      }
    }
    else if (req.method === "PUT") {
      const { orderId } = req.body;
      const { send } = req.query;
    
      if (!orderId)
        return res
          .status(400)
          .json({ success: false, message: "Order ID is required" });
    
      
      await db.query("UPDATE `Order` SET Status = 'สำเร็จ' WHERE OrderID = ?", [
        orderId,
      ]);
    
      
      if (send === "true") {
        const message = "คำสั่งซื้อของคุณได้รับการตรวจสอบแล้วเรียบร้อย";
        const status = "สำเร็จ";
    
        await db.execute(
          "INSERT INTO Notification (OrderID, Message, isRead, Status, NotificationDateTime) VALUES (?, ?, 0, ?, NOW())",
          [orderId, message, status]
        );
    
      }
    
      return res
        .status(200)
        .json({ success: true, message: "Order status updated successfully" });
    }
    

    else {
      return res
        .status(405)
        .json({ success: false, message: "Method not allowed" });
    }
  } catch (error) {
    
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
