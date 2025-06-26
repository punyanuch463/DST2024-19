import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faClock } from "@fortawesome/free-solid-svg-icons";

const NotificationPopup = ({
  notifications,
  showNotification,
  closeNotification,
}) => {
  if (!showNotification || notifications.length === 0) return null;
  const formatDateTime = (dateTimeString) => {
    const dateObj = new Date(dateTimeString);
    const year = dateObj.getFullYear() + 543;
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} Time: ${hours}.${minutes}`;
  };

  return (
    <div className="notification-popup">
      <FontAwesomeIcon
        icon={faTimes}
        className="close-icon"
        onClick={closeNotification}
      />
      <p className="notification-title">
        <strong>แจ้งเตือน</strong>
      </p>
      <div className="notification-content">
        <FontAwesomeIcon icon={faClock} className="clock-icon" />
        <span>
          รหัสการสั่ง {notifications[0].OrderID}, {notifications[0].Message}
        </span>
      </div>
      <p className="notification-time">
        {formatDateTime(notifications[0].NotificationDateTime)}
      </p>
    </div>
  );
};

export default NotificationPopup;
