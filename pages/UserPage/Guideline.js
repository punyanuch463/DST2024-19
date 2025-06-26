"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaShoePrints, FaCamera, FaShoppingCart, FaChevronDown } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import NotificationPopup from "../../components/NotificationPopup";

const UserGuide = () => {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState(null);

  const handleNavigate = (path) => {
    router.push(path);  
  };

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const [userId, setUserId] = useState(null);
  const [PathProfileImage, setPathProfileImage] = useState("/default-profile.png");

  const guideData = [
    {
      title: "วิธีการสแกนเท้า",
      icon: <FaShoePrints className="guideIcon" />,
      
      steps: [
        { text: "1. เลือกไอคอน 'สแกน' ที่แถบเมนูตรงกลาง ด้านล่างของหน้าจอ", image: "/Guideline/gl1_1.png" },
        { text: "2. ถ่ายภาพเท้าของท่านให้ครบทั้ง 2 ข้างตามรูปภาพตัวอย่างที่แสดงด้านบน", image: "/Guideline/gl1_2.png" },
        { text: "3. เมื่อภ่ายภาพเสร็จเรียบร้อยระบบจะนำท่านกลับไปยังหน้าหลักเพื่อรอประมวลผล\nภาพถ่ายเท้า" },
      ],
    },
    {
      title: "วิธีการดูภาพถ่ายเท้า 3 มิติ",
      icon: <FaCamera className="guideIcon" />,
      
      steps: [
        { text: "1. เลือกเมนู 'โมเดลเท้า 3 มิติ' ที่หน้าหลัก หน้านี้จะแสดงภาพของเท้าทั้งสองข้างในมุมมองที่สามารถหมุนและปรับขนาดได้", image: "/Guideline/gl2_1.png" },
        { text: "2. มุนและซูมดูรายละเอียด คุณสามารถหมุนมุมมองของเท้าและซูมเข้าออกเพื่อดูรายละเอียดได้ 360 องศา" },
      ],
    },
    {
      title: "วิธีการสั่งซื้อแผ่นรองเท้า",
      icon: <FaShoppingCart className="guideIcon" />,
      
      steps: [
        { text: "1. เลือกเมนู 'สั่งแผ่นรองในรองเท้า' ที่หน้าหลัก ระบบจะแสดงข้อมูลเท้าของคุณและภาพโมเดลเท้า 3 มิติที่ถูกสร้างขึ้นจากการสแกน", image:"/Guideline/gl3_1.png"},
        { text: "2. ตรวจสอบข้อมูลและโมเดลเท้า 3 มิติว่าถูกต้อง หรือต้องการแก้ไขหรือไม่"},
        { text: "3. กดปุ่ม 'ยืนยันการสั่งซื้อ' โปรดตรวจสอบให้แน่ใจว่าได้กรอกข้อมูลทั้งหมดและตรวจสอบความถูกต้องก่อนที่จะยืนยันคำสั่งซื้อ" },
      ],
    },
  ];
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
  return (
    <div>
     
      <div className="header-with-back-icon">
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="back-icon"
          onClick={() => router.back()}
        />
        <div className="top-right-icon">
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
            <img src={PathProfileImage} alt="Profile" className="profile-pic" onClick={handleProfileClick} />
        </div>
      </div>

      <div className="userGuideContainer">
        <h1>คู่มือการใช้งาน</h1>
        <ul className="guideList">
          {guideData.map((item, index) => (
            <li key={index} className="guideItem">
              <button
                className="guideLink"
                
              >
                {item.icon}
                {item.title}
                <FaChevronDown
                  className={`dropdownIcon ${openIndex === index ? "rotate" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(index);
                  }}
                />
              </button>
              {openIndex === index && (
                <div className="guideDetails">
                  {item.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="guideStep">
                      <img src={step.image} className="stepImage" />
                      <p>{step.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserGuide;
