import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

const OrderCard = ({
  orderID,
  status,
  date,
  username,
  firstdate,
  lastdate,
  orderDetails,
  isAdmin = false,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const formatDateTime = (dateTimeString) => {
    const dateObj = new Date(dateTimeString);
    const year = dateObj.getFullYear() + 543;
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");

    return (
      <>
        {day}-{month}-{year} <br />
        เวลา : {hours}.{minutes}
      </>
    );
  };

  const orderDetail = orderDetails.find((detail) => detail.OrderID === orderID);

  const handleConfirm = async (orderId) => {
    try {
      const orderResponse = await fetch(`/api/order?send=true`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          status: "สำเร็จ",
        }),
      });

      if (!orderResponse.ok) {
        throw new Error(" Error updating order status");
      }
      window.location.reload();
    } catch (error) {}
  };

  

  return (
    <div className="order-card">
      <div className="order-header">
        <span className="order-id">รหัสการสั่ง: {orderID}</span>
        <span className={`status ${status}`}>{status}</span>
      </div>
      <div className="order-date">ชื่อผู้สั่ง: {username}</div>
      {orderDetail ? (
        <>
          <div className="order-date">
            วันที่สั่งซื้อแผ่นรองในรองเท้า: {formatDateTime(date)}
          </div>
        </>
      ) : (
        <>
          <div className="order-date">
            วันที่ทำการส่งภาพถ่าย: {formatDateTime(date)}
          </div>
        </>
      )}

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="details-btn"
      >
        รายละเอียด
      </button>
      {orderDetail && isAdmin && (
        <button
          className="change-status-btn"
          onClick={() => handleConfirm(orderID)}
        >
          เปลี่ยนสถานะการจัดส่ง
        </button>
      )}
      {showDetails && (
        <div className="order-details">
          {orderDetail ? (
            <>
              <p className="order-title">ชื่อผู้สั่ง</p>
              <p className="order-detail">{username}</p>

              <p className="order-title">สถานะ</p>
              <p className="order-detail">{status}</p>

              <p className="order-title">จำนวนสินค้า</p>
              <p className="order-detail">{orderDetail.Quantity || "-"}</p>

              <p className="order-title">ค่าจัดส่ง</p>
              <p className="order-detail">
                {orderDetail.ShippingFee
                  ? `${orderDetail.ShippingFee} บาท`
                  : "-"}
              </p>

              <p className="order-title">ราคารวม</p>
              <p className="order-detail">
                {orderDetail.TotalPrice ? `${orderDetail.TotalPrice} บาท` : "-"}
              </p>

              <p className="order-title">ที่อยู่จัดส่ง</p>
              <p className="order-detail">{orderDetail.Address || "-"}</p>
            </>
          ) : (
            <>
              <p className="order-title">ชื่อผู้สั่ง</p>
              <p className="order-detail">{username}</p>

              <p className="order-title">สถานะ</p>
              <p className="order-detail">{status}</p>

              <p className="order-title">วันที่ถ่ายภาพ</p>
              <p className="order-detail">{formatDateTime(firstdate)}</p>

              <p className="order-title">วันที่ส่งภาพถ่ายเข้าระบบ</p>
              <p className="order-detail">{formatDateTime(lastdate)}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default OrderCard;
