import db from "./db"; 

export default async function handler(req, res) {
  try {

    if (req.method === "POST") {
      const {
        userId,
        message,
        status,
        quantity,
        shippingFee,
        totalPrice,
        addressOrder,
        houseNumber,
        street,
        city,
        district,
        province,
        zip_code,
      } = req.body;

      
      if (!userId)
        return res
          .status(400)
          .json({ success: false, message: "userId is required" });

      const [orderResult] = await db.execute(
        "INSERT INTO `Order` (UserID, Status) VALUES (?, ?)",
        [userId, "รอดำเนินการ"]
      );
      const orderId = orderResult.insertId;

      const formatDate = (date) => {
        return (
          date
            .toLocaleString("sv-SE", { timeZoneName: "short" })
            .replace("T", " ")
            .split(" ")[0] +
          " " +
          date
            .toLocaleString("sv-SE", { timeZoneName: "short" })
            .split(" ")[1]
            .slice(0, 8)
        );
      };

      const formattedDate = formatDate(new Date());

      await db.execute(
        "UPDATE `Order` SET FirstDateTime = ? WHERE OrderID = ?",
        [formattedDate, orderId]
      );

      await db.execute(
        "UPDATE `Order` SET LastDateTime = ? WHERE UserID = ? ORDER BY OrderID DESC LIMIT 1",
        [formattedDate, userId]
      );

      await db.query(
        `INSERT INTO OrderDetailed (UserId, OrderID, Quantity, ShippingFee, TotalPrice, Address, houseNumber, street, city, district, province, zip_code) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          orderId,
          quantity,
          shippingFee,
          totalPrice,
          addressOrder,
          houseNumber,
          street,
          city,
          district,
          province,
          zip_code,
        ]
      );

      if (message) {
        await db.execute(
          "INSERT INTO Notification (OrderID, Message, isRead, Status, NotificationDateTime) VALUES (?, ?, 0, ?, NOW())",
          [orderId, message, status || "Unread"]
        );
      }

      const modifiedMessage = `ผู้ใช้งานส่งคำสั่งซื้อเรียบร้อยแล้ว `;
      const adminIds = await db.execute("SELECT AdminID FROM Admin");
      for (let admin of adminIds[0]) {
        const adminId = admin.AdminID;
        await db.execute(
          "INSERT INTO NotificationForAdmin (OrderID, AdminID, Message, Status, isRead, NotificationDateTime) VALUES (?, ?, ?, ?, 0, NOW())",
          [orderId, adminId, modifiedMessage, status]
        );
      }

      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        orderId,
      });
    } else if (req.method === "GET") {
      if (req.query.allUserIds) {
        const [users] = await db.query("SELECT UserID FROM User");
        const allOrdersDetailed = [];

        for (let user of users) {
          const { UserID } = user;
          const [orders] = await db.query(
            `SELECT 
      od.OrderDetailedID,
      od.UserId,
      u.Username,
      od.DateTime,
      od.Quantity,
      od.ShippingFee,
      od.TotalPrice,
      od.OrderID,
      od.Address
    FROM OrderDetailed od
    JOIN User u ON od.UserID = u.UserID
    WHERE od.UserID = ? 
    ORDER BY od.OrderID DESC;`
   
    , 
            [UserID]
          );
          allOrdersDetailed.push({ orders });
        }

        return res.status(200).json({
          success: true,
          allOrdersDetailed,
        });
      }

      
      const { userId } = req.query;

      if (!userId)
        return res
          .status(400)
          .json({ success: false, message: "userId is required" });

      const [orders] = await db.query(
        `SELECT 
          od.OrderDetailedID,
          od.UserId,
          u.Username,
          od.DateTime,
          od.Quantity,
          od.ShippingFee,
          od.TotalPrice,
          od.OrderID,
          od.Address
        FROM OrderDetailed od
        JOIN User u ON od.UserID = u.UserID
        WHERE od.UserID = ? 
        GROUP BY od.OrderDetailedID;`,
        [userId]
      );

      return res.status(200).json({
        success: true,
        orders,
      });
    } else {
      return res
        .status(405)
        .json({ success: false, message: "Method not allowed" });
    }
  } catch (error) {
    console.error(" Error handling request:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
