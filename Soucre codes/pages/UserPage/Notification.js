import { useRouter } from "next/router";

import { VscHome, VscAccount, VscBell, VscHistory } from "react-icons/vsc";
import { PiScanFill } from "react-icons/pi";

import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { updatePageTitle } from "../../utils/routeTitle";

const NotificationPage = ({ orderID, status, date }) => {
  const router = useRouter();
  const [PathProfileImage, setPathProfileImage] = useState("/default-profile.png");
  const [userId, setUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");


  useEffect(() => {
    updatePageTitle(router.pathname);
    const handleRouteChange = (url) => {
      updatePageTitle(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  const menuBarItems = [
    {
      icon: <VscHome />,
      label: "หน้าหลัก",
      action: () => router.push("/UserPage/HomePageUser"),
    },
    {
      icon: <VscBell />,
      label: "แจ้งเตือน",
      action: () => router.push("/UserPage/Notification"),
    },
    {
      icon: <PiScanFill />,
      label: "สแกน",
      action: () => router.push("/takePhotoFoot/takePhotoFootLeft1"),
    },
    {
      icon: <VscHistory />,
      label: "ประวัติ",
      action: () => router.push("/UserPage/UserHistory"),
    },
    {
      icon: <VscAccount />,
      label: "โปรไฟล์",
      action: () => router.push("/UserPage/EditAcc"),
    },
  ];
  const [notifications, setNotifications] = useState([]); 
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const sessionRes = await fetch("/api/getSession");
        const sessionData = await sessionRes.json();

        if (sessionRes.ok && sessionData.userId) {
          setUserId(sessionData.userId);
          fetchUserData(sessionData.userId);
        } else {
          router.push("/UserPage/LoginPage");
        }
      } catch (error) {
        
        router.push("/UserPage/LoginPage");
      }
    };

    const fetchUserData = async (userId) => {
      try {
        const response = await fetch("/api/user/getUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userId }),
        });

        if (response.ok) {
          const data = await response.json();
          setPathProfileImage(data[0]?.PathProfileImage || "/default-profile.png");
        }
      } catch (error) {
        
      }
    };

    fetchSessionData();
  }, [router]);

  
  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `/api/user/notificationUser?userId=${userId}`
        );
        if (response.ok) {
          const data = await response.json();

          setNotifications(
            Array.isArray(data.notifications) ? data.notifications : []
          );
        } else {
          
        }
      } catch (error) {
        
      }
    };

    fetchNotifications();
  }, [userId]);

  
  const markAsRead = async (id) => {
    try {
      const response = await fetch(`/api/user/notificationUser`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.NotificationID === id ? { ...n, isRead: true } : n
          )
        );
      }
    } catch (error) {
      
    }
  };

  const [isSelecting, setIsSelecting] = useState(false);
  
  
  
  const toggleSelecting = () => {
    setIsSelecting(!isSelecting);
    setSelectedNotifications([]); 
  };

  
  const toggleSelectNotification = (id) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  
  const deleteSelectedNotifications = async () => {
    if (selectedNotifications.length === 0) return;

    try {
      const response = await fetch(`/api/user/notificationUser`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: selectedNotifications }), 
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.filter((n) => !selectedNotifications.includes(n.NotificationID))
        );
        setSelectedNotifications([]);
        setIsSelecting(false);
      } else {
        
      }
    } catch (error) {
      
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    setModalMessage("ต้องการลบการแจ้งเตือนทั้งหมด หรือไม่?");
    setIsModalOpen(true); 
  };
  
  
  const deleteAllNotifications = async () => {
      try {
        const response = await fetch(`/api/user/notificationUser`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deleteAll: true, userId }),
        });

        if (response.ok) {
          setNotifications([]);
        } else {
          console.error("Error deleting all notifications");
        }
      } catch (error) {
        console.error("Error deleting all notifications:", error);
      }

    setIsModalOpen(false);
  };

  const formatDateTime = (dateTimeString) => {
    const dateObj = new Date(dateTimeString);
    const year = dateObj.getFullYear() + 543;
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} Time: ${hours}.${minutes}`;
  };
  const handleProfileClick = () => {
    router.push("/UserPage/EditAcc");
  };
  return (
    <div className="historyPage">
      <div className="header-with-back-icon">
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="back-icon"
          onClick={() => router.push("/UserPage/HomePageUser")}
        />
        <div className="top-right-icon">
        <img src={PathProfileImage} alt="Profile" className="profile-pic" onClick={handleProfileClick} />
        </div>
      </div>

      <div className="searchBar">
        <h1>การแจ้งเตือน</h1>
      </div>
      <div className="notificationActions">
        {isSelecting ? (
          <>
            <span
              onClick={deleteSelectedNotifications}
              className="controlText"
              disabled={selectedNotifications.length === 0}
            >
              ลบที่เลือก
            </span>
            <span onClick={handleSave} className="controlText">
              ลบทั้งหมด
            </span>
            <span onClick={toggleSelecting} className="controlText cancelText">
              ยกเลิก
            </span>
          </>
        ) : (
          <span onClick={toggleSelecting} className="controlText">
            เลือก
          </span>
        )}
      </div>

      <div className="notificationsContainer">
        {notifications.map((notification) => (
          <div
            key={notification.NotificationID}
            className={`notificationCard ${
              notification.isRead ? "read" : "new"
            }`}
            onClick={() =>
              !isSelecting && markAsRead(notification.NotificationID)
            }
          >
            <div className="notificationContent">
              <p className="notificationMessage">{notification.Message}</p>

              <p className="orderID">รหัสการสั่ง: {notification.OrderID}</p>
              <p className="notificationTime">
                {formatDateTime(notification.NotificationDateTime)}
              </p>
            </div>

            
            {isSelecting && (
              <input
                type="checkbox"
                className="notificationCheckbox"
                checked={selectedNotifications.includes(
                  notification.NotificationID
                )}
                onChange={() =>
                  toggleSelectNotification(notification.NotificationID)
                }
              />
            )}
          </div>
        ))}
      </div>
      <div className="menuBar-container">
        <div className="menuBar">
          {menuBarItems.map((item, index) => (
            <div key={index} className="menuItem" onClick={item.action}>
              {item.icon}
              <p>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && (
  <div className="modal">
    <div className="modalContent">
      <p>{modalMessage}</p>
      <button className="confirmButton"
        onClick={deleteAllNotifications}
      >
        ตกลง
      </button>
      <button className="cancelButton" 
        onClick={handleCloseModal}
      >
        ยกเลิก
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default NotificationPage;
