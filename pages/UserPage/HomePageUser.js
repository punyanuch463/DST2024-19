"use client";
import React, { useState, useEffect } from "react";
import { useMemo } from "react";
import { useRouter } from "next/router";
import withAuth from "../../hoc/withAuth"; 
import {
  VscHome,
  VscHistory,
  VscAccount,
  VscBell,
} from "react-icons/vsc";
import { PiScanFill } from "react-icons/pi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOut,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import {
  FaShoePrints,
  FaShieldAlt,
  FaBookOpen,
  FaClipboardList,
} from "react-icons/fa";
import { updatePageTitle } from "../../utils/routeTitle";
import NotificationPopup from "../../components/NotificationPopup";

const Menu = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [userId, setUserId] = useState(null);
  const [consent, setConsent] = useState(null);
  const [PathProfileImage, setPathProfileImage] = useState("/default-profile.png");
  
  useEffect(() => {
    setIsMounted(true); 
  }, []);

  
  const menuItems = useMemo(() => {
    if (consent !== 1) return [
      {
        icon: <FaShieldAlt />,
        label: "PDPA",
        subtitle: "รู้จักกฎหมาย PDPA",
        action: () => router.push("/UserPage/ConsentLogin"),
      },
      {
        icon: <FaBookOpen />,
        label: "คู่มือ",
        subtitle: "ข้อมูลที่จำเป็นสำหรับการใช้งาน",
        action: () => router.push("/UserPage/Guideline"),
      },
    ];
  
    return [
      {
        icon: <FaShoePrints />,
        label: "โมเดลเท้า 3 มิติ",
        subtitle: "สำรวจรูปแบบเท้า 3 มิติ",
        action: () => router.push("/UserPage/UserFoot"),
      },
      {
        icon: <PiScanFill />,
        label: "สร้างโมเดลเท้า 3 มิติใหม่",
        subtitle: "ออกแบบแผ่นรองเท้าสำหรับเท้า",
        action: () => router.push("/takePhotoFoot/takePhotoFootLeft1"),
      },
      {
        icon: <FaClipboardList />,
        label: "สั่งแผ่นรองในรองเท้า",
        subtitle: "สั่งซื้อแผ่นรองในรองเท้าตามความต้องการ",
        action: () => router.push("/UserPage/Insole"),
      },
      {
        icon: <FaShieldAlt />,
        label: "PDPA",
        subtitle: "รู้จักกฎหมาย PDPA",
        action: () => router.push("/UserPage/ConsentLogin"),
      },
      {
        icon: <FaBookOpen />,
        label: "คู่มือ",
        subtitle: "ข้อมูลที่จำเป็นสำหรับการใช้งาน",
        action: () => router.push("/UserPage/Guideline"),
      },
    ];
  }, [consent, router]);
  
  const menuBarItems = useMemo(() => {
    if (consent !== 1) return [
      {
        icon: <VscHome />,
        label: "หน้าหลัก",
        action: () => router.push("/UserPage/HomePageUser"),
      },
      {
        icon: <VscAccount />,
        label: "โปรไฟล์",
        action: () => router.push("/UserPage/EditAcc"),
      },
    ];
  
    return [
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
  }, [consent, router]);
  

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
        const response = await fetch(`/api/user/getUser`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userId }),
        });

        if (response.ok) {
          const data = await response.json();
          setPathProfileImage(data[0].PathProfileImage || "/default-profile.png");
          setConsent(data[0].Consent);
        }
      } catch (error) {
        
      }
    };

    fetchSessionData();
  }, [router]);



  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  const toggleNotification = () => setShowNotification(!showNotification);
  const closeNotification = () => setShowNotification(false);

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
  const handleProfileClick = () => {
    router.push("/UserPage/EditAcc");
  };

  if (!isMounted || consent === null) {
    return <div className="loading">กำลังโหลดข้อมูล...</div>;
  }
  
  return (
    
    <div>
      <div className="header-with-back-icon">
        <div className="header-home-icon">
          {consent === 1 && (
            <>
              <FontAwesomeIcon
                icon={faBell}
                className="notification-icon"
                onClick={toggleNotification}
              />
              <NotificationPopup
                notifications={notifications}
                showNotification={showNotification}
                closeNotification={closeNotification}
              />
            </>
          )}

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

export default withAuth(Menu);
