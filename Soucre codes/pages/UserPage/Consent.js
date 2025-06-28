"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PDPAConsentPage = () => {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showNotification, setShowNotification] = useState(false);
  const [PathProfileImage, setPathProfileImage] = useState("/default-profile.png");
  const consentPageUrl = "/UserPage/Consent";
  const updatePageTitle = (path) => {
    if (path === "/UserPage/Consent") {
      document.title = "นโยบายความเป็นส่วนตัว";
    } else {
      document.title = "My Application";
    }
  };

  useEffect(() => {
    updatePageTitle(router.pathname);
  }, [router.pathname]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/getSession");
        if (response.ok) {
          const data = await response.json();
          setUserId(data.userId);
        } else {
          throw new Error("ไม่พบ session");
        }
      } catch (error) {
        
        setMessage({
          text: "ไม่พบ session โปรดเข้าสู่ระบบใหม่",
          type: "error",
        });
      }
    };
    checkSession();
  }, []);

  const handleCheckboxClick = () => {
    setIsChecked(!isChecked);
  };

  const handleNext = async () => {
    if (!isChecked) {
      setMessage({
        text: "กรุณายอมรับข้อกำหนดและนโยบายความเป็นส่วนตัว",
        type: "error",
      });
      return;
    }

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, consent: true }),
      });

      if (updateConsentRes.ok) {
        setTimeout(() => {
          router.push(`/UserPage/CompletePage`);
        }, 2000);
      } else {
        setMessage({ text: "ไม่สามารถบันทึกข้อมูล consent", type: "error" });
      }
    } catch (error) {
      
      setMessage({ text: "เกิดข้อผิดพลาดในการบันทึก consent", type: "error" });
    }
  };

  const toggleNotification = () => setShowNotification(!showNotification);
  const closeNotification = () => setShowNotification(false);

  return (
    <div>
      <div className="header-with-back-icon"></div>

      <div className="userGuideContainer">
        <h1>นโยบายความเป็นส่วนตัว</h1>

        {message && <p className={`alert ${message.type}`}>{message.text}</p>}

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

export default PDPAConsentPage;
