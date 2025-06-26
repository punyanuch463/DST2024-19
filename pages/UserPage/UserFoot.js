

import React, { useState, useEffect } from "react";
import { updatePageTitle } from "../../utils/routeTitle";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPen, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import withAuth from "../../hoc/withAuth";
import Link from "next/link";
import { FaRegQuestionCircle } from "react-icons/fa";
import NotificationPopup from "../../components/NotificationPopup";

const STLModel = ({ url }) => {
  const geometry = useLoader(STLLoader, url);
  return (
    <mesh geometry={geometry} scale={0.055} position={[0, -0.5, 0]}>
      <meshStandardMaterial color="gray" />
    </mesh>
  );
};

const UserFoot3D = () => {
  const router = useRouter();
  const [activeButton, setActiveButton] = useState("right");
  const [userId, setUserId] = useState(null);
  const [modelUrl, setModelUrl] = useState(null);
  const [PathProfileImage, setPathProfileImage] = useState("/default-profile.png");
  const [showPopup, setShowPopup] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(true); 

  useEffect(() => {
    updatePageTitle(router.pathname);
    const handleRouteChange = (url) => updatePageTitle(url);
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router]);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const sessionRes = await fetch("/api/getSession");
        const sessionData = await sessionRes.json();
        if (sessionRes.ok && sessionData.userId) {
          setUserId(sessionData.userId);
          fetchUserData(sessionData.userId);
        }
      } catch (error) {
        
      }
    };

    const fetchUserData = async (userId) => {
      try {
        const response = await fetch(`/api/user/getUser`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        if (response.ok) {
          const data = await response.json();
          setPathProfileImage(data[0]?.PathProfileImage || "/default-profile.png");
        }
      } catch (error) {
        
      }
    };

    fetchSessionData();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchFoot3DModel = async () => {
      setIsLoadingModel(true); 
      try {
        const response = await fetch(`/api/foot3d?userId=${userId}&side=${activeButton}`);
        if (response.ok) {
          const data = await response.json();
          setModelUrl(data.Foot3DPath);
        } else {
          setModelUrl(null); 
        }
      } catch (error) {
        setModelUrl(null); 
      }finally {
        setIsLoadingModel(false); 
      }
    };

    fetchFoot3DModel();
  }, [userId, activeButton]);

  const rotateLeft = () => {
    setActiveButton("left");
  };

  const rotateRight = () => {
    setActiveButton("right");
  };

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const response = await fetch(`/api/user/notificationUser?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();

          setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
        } 
      } catch (error) {
        
      }
    };

    fetchNotifications();
  }, [userId]);
  const handleProfileClick = () => {
    router.push("/UserPage/EditAcc");
  };

     useEffect(() => {
        setIsMounted(true);
      }, []);
      
      if (!isMounted || isLoadingModel) {
        return <div className="loading">กำลังโหลดข้อมูล...</div>;
      }

  return (
    <div>
      <div className="header-with-back-icon">
        <FontAwesomeIcon icon={faArrowLeft} className="back-icon" onClick={() => router.back()} />
        <div className="top-right-icon">
          <FontAwesomeIcon icon={faBell} className="notification-icon" onClick={() => setShowNotification(!showNotification)} />
          <NotificationPopup notifications={notifications} showNotification={showNotification} closeNotification={() => setShowNotification(false)} />
          <img src={PathProfileImage} alt="Profile" className="profile-pic" onClick={handleProfileClick} />
        </div>
      </div>

      <div className="CanvasContainer">
        <h1>โมเดลเท้า 3 มิติ</h1>
        <div className="edit-container">
          <span className="edit-link" onClick={() => setShowPopup(true)}>
            <FontAwesomeIcon icon={faPen} className="edit-icon" />
            <span className="edit-text">แก้ไข</span>
          </span>
        </div>

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <button className="close-btn" onClick={() => setShowPopup(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <h2 className="popup-title">
                <div className="popup-icon-container">
                  <FaRegQuestionCircle className="popup-icon" />
                </div>
                คุณแน่ใจที่จะแก้ไขโมเดลเท้า 3 มิติ <br /> ใช่หรือไม่?
              </h2>
              <p className="popup-subtitle">ข้อมูลที่มีอยู่จะถูกลบและไม่สามารถกู้คืนได้</p>
              <div className="popup-buttons">
                <Link href="/takePhotoFoot/takePhotoFootLeft1">
                  <button className="confirm-btn">ใช่</button>
                </Link>
                <button className="cancel-btn" onClick={() => setShowPopup(false)}>ไม่ ใช้โมเดล 3 มิติเดิม</button>
              </div>
            </div>
          </div>
        )}

<div className="canvas-container">
  {modelUrl ? (
    <Canvas style={{ width: "380px", height: "400px", margin: "0 auto" }} camera={{ position: [6, -10, 10] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 5, 5]} intensity={3} />
      <OrbitControls target={[6, 7, 5]} />
      <STLModel url={modelUrl} />
    </Canvas>
  ) : (
    <p style={{ textAlign: "center", marginTop: "20px", fontSize: "18px", color: "gray" }}>
      ยังไม่มีภาพโมเดล 3 มิติ
    </p>
  )}
</div>

        <div className="footButtonContainer">
          <button className={`leftButton ${activeButton === "left" ? "activeLeft" : ""}`} onClick={rotateLeft}>ซ้าย</button>
          <button className={`rightButton ${activeButton === "right" ? "activeRight" : ""}`} onClick={rotateRight}>ขวา</button>
        </div>
      </div>
    </div>
  );
};

export default withAuth(UserFoot3D);
