"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import NotificationPopup from "../../components/NotificationPopup";

const ConsentLogin = () => {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [PathProfileImage, setPathProfileImage] = useState("/default-profile.png");
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const consentPageUrl = "/UserPage/ConsentLogin";

  useEffect(() => {
    document.title = "นโยบายความเป็นส่วนตัว";

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
          body: JSON.stringify({ userId }),
        });

        if (response.ok) {
          const data = await response.json();
          setPathProfileImage(data[0].PathProfileImage || "/default-profile.png");
          setIsChecked(data[0].Consent === 1);
        }
      } catch (error) {
        
      }
    };

    fetchSessionData();
  }, [router]);

  const handleCheckboxClick = () => {
    setIsChecked(!isChecked);
  };

  const handleNext = async () => {
    
    
    
    
    
    
    

    if (!userId) {
      setMessage({
        text: "ไม่พบข้อมูลผู้ใช้ โปรดเข้าสู่ระบบใหม่",
        type: "error",
      });
      return;
    }

    try {
      const updateConsentRes = await fetch("/api/user/updateConsent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, consent: isChecked }),
      });

      if (updateConsentRes.ok) {
        setTimeout(() => {
          router.push("/UserPage/HomePageUser");
        }, 2000);
      } else {
        setMessage({ text: "ไม่สามารถบันทึกข้อมูล consent", type: "error" });
      }
    } catch (error) {
      
      setMessage({ text: "เกิดข้อผิดพลาดในการบันทึก consent", type: "error" });
    }
  };
  const handleProfileClick = () => {
    router.push("/UserPage/EditAcc");
  };
  return (
    <div>
      <div className="header-with-back-icon">
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="back-icon"
          onClick={() => router.push("/UserPage/HomePageUser")}
        />
        <div className="top-right-icon">
          <FontAwesomeIcon
            icon={faBell}
            className="notification-icon"
            onClick={() => setShowNotification(!showNotification)}
          />
          <NotificationPopup
            notifications={notifications}
            showNotification={showNotification}
            closeNotification={() => setShowNotification(false)}
          />
            <img src={PathProfileImage} alt="Profile" className="profile-pic" onClick={handleProfileClick} />
        </div>
      </div>
      <div className="userGuideContainer">
        <h1>นโยบายความเป็นส่วนตัว</h1>
        {message.text && (
          <p className={`alert ${message.type}`}>{message.text}</p>
        )}

        <div className="pdpa-section-title">
          <div className="pdpa-card">
           
            <strong>การเก็บข้อมูล</strong>
            <p>ข้อมูลของคุณจะถูกเก็บไว้เพื่อพัฒนาและปรับปรุงบริการของเรา</p>
          </div>

          <div className="pdpa-card">
            
            <strong>การวิเคราะห์ข้อมูล</strong>
            <p>
              ข้อมูลของคุณจะถูกใช้เพื่อการวิเคราะห์แนวโน้มและพฤติกรรมการใช้งาน
            </p>
          </div>

          <div className="pdpa-card">
           
            <strong>การใช้ข้อมูลเพื่อการตลาด</strong>
            <p>ข้อมูลของคุณอาจถูกใช้ในการปรับปรุงกลยุทธ์การตลาดของเรา</p>
          </div>

          <div className="pdpa-card">
            
            <strong>การแชร์ข้อมูลกับพันธมิตร</strong>
            <p>ข้อมูลของคุณอาจถูกแชร์กับพันธมิตรเพื่อให้บริการที่ดียิ่งขึ้น</p>
          </div>

          <div className="pdpa-card">
            
            <strong>การเก็บข้อมูลเพื่อความปลอดภัย</strong>
            <p>ข้อมูลของคุณจะถูกตรวจสอบและป้องกันการกระทำที่ไม่ปลอดภัย</p>
          </div>
        </div>

        <label className="pdpa-checkbox-item" onClick={handleCheckboxClick}>
          <div className={`pdpa-checkbox-circle ${isChecked ? "checked" : ""}`}>
            {isChecked && <span className="pdpa-checkmark">✓</span>}
          </div>
          <div className="pdpa-checkbox-content">
            <span>
              <Link href={consentPageUrl}>
                ยอมรับข้อกำหนดและนโยบายความเป็นส่วนตัว
              </Link>
            </span>
          </div>
        </label>
        <button className="primary-btn" onClick={handleNext}>
          ถัดไป
        </button>
      </div>
    </div>
  );
};

export default ConsentLogin;
