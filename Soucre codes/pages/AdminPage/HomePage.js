"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import withAuthAdmin from "../../hoc/withAuthAdmin";
import { FaBell, FaHistory, FaShoePrints } from "react-icons/fa";
import { VscHome, VscAccount } from "react-icons/vsc";
import NotificationPopup from "../../components/NotificationPopup";
import { updatePageTitle } from "../../utils/routeTitle";
const Menu = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [AdminID, setAdminID] = useState(null);
  const [PathProfileImage, setPathProfileImage] = useState(
    "/default-profile.png"
  );
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const menuItems = [
    {
      icon: <FaShoePrints />,
      label: "ดาวน์โหลดโมเดลเท้า 3 มิติ",
      subtitle: "ดาวน์โหลดและตรวจสอบข้อมูล",
      action: () => router.push("/AdminPage/FootView"),
    },
    {
      icon: <FaHistory />,
      label: "ประวัติการสั่งแผ่นรองในรองเท้า",
      subtitle: "ดูรายการสั่งซื้อแผ่นรองในรองเท้า",
      action: () => router.push("/AdminPage/InsoleOrder"),
    },
    {
      icon: <FaBell />,
      label: "การแจ้งเตือน",
      subtitle: "ดูการแจ้งเตือน",
      action: () => router.push("/AdminPage/Notification"),
    },
  ];

  const menuBarItems = [
    {
      icon: <VscHome />,
      label: "หน้าหลัก",
      action: () => router.push("/AdminPage/HomePage"),
    },
    {
      icon: <VscAccount />,
      label: "โปรไฟล์",
      action: () => router.push("/AdminPage/EditAcc"),
    },
  ];
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
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const sessionRes = await fetch("/api/admin/getSessionadmin");
        const sessionData = await sessionRes.json();
        if (sessionRes.ok && sessionData.AdminID) {
          setAdminID(sessionData.AdminID);
          fetchAdminData(sessionData.AdminID);
        }
      } catch (error) {}
    };

    const fetchAdminData = async (AdminID) => {
      try {
        const response = await fetch(`/api/admin/getAdmin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ AdminID: AdminID }),
        });

        if (response.ok) {
          const data = await response.json();
          setPathProfileImage(
            data[0].PathProfileImage || "/default-profile.png"
          );
        }
      } catch (error) {}
    };

    fetchSessionData();
  }, []);

  useEffect(() => {
    if (AdminID) {
      const fetchNotifications = async () => {
        try {
          const response = await fetch(`/api/admin/notificationAdmin`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Admin-ID": AdminID,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.notifications && data.notifications.length > 0) {
              setNotifications(data.notifications);
            } else {
              setNotifications([]);
            }
          }
        } catch (error) {}
      };

      fetchNotifications();
    }
  }, [AdminID]);

  const toggleNotification = () => setShowNotification(!showNotification);
  const closeNotification = () => setShowNotification(false);

  const handleProfileClick = () => {
    router.push("/AdminPage/EditAcc");
  };

  return (
    <div>
      <div className="header-with-back-icon">
        <div className="header-home-icon">
          <FaBell className="notification-icon" onClick={toggleNotification} />
          <NotificationPopup
            notifications={notifications}
            showNotification={showNotification}
            closeNotification={closeNotification}
          />
          <img
            src={PathProfileImage}
            alt="Profile"
            className="profile-pic"
            onClick={handleProfileClick}
          />
        </div>
      </div>

      <div className="menu-container">
        <h1>หน้าหลัก</h1>
        {menuItems.map((item, index) => (
          <div key={index} className="menu-card" onClick={item.action}>
            <div className="menu-content">
              <div className="icon">{item.icon}</div>
              <div className="menu-text">
                <span className="label">{item.label}</span>
                <span className="subtitle">{item.subtitle}</span>
              </div>
            </div>
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
    </div>
  );
};

export default withAuthAdmin(Menu);
