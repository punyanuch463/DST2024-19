import React, { useState, useEffect } from "react";
import { updatePageTitle } from "../../utils/routeTitle";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import withAuthAdmin from "../../hoc/withAuthAdmin";
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
  const [PathProfileImage, setPathProfileImage] = useState(
    "/default-profile.png"
  );
  const [showPopup, setShowPopup] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [AdminID, setAdminID] = useState(null);
  useEffect(() => {
    updatePageTitle(router.pathname);
    const handleRouteChange = (url) => updatePageTitle(url);
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router]);

  useEffect(() => {
    const fetchSessionDataAdmin = async () => {
      try {
        const sessionRes = await fetch("/api/admin/getSessionadmin");
        const sessionData = await sessionRes.json();
        if (sessionRes.ok && sessionData.AdminID) {
          setAdminID(sessionData.AdminID);
        }
      } catch (error) {}
    };

    fetchSessionDataAdmin();
  }, []);
  useEffect(() => {
    if (!AdminID) return;

    const fetchAdminData = async () => {
      try {
        const response = await fetch(`/api/admin/getAdmin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ AdminID: AdminID }),
        });

        if (response.ok) {
          const data = await response.json();
          setPathProfileImage(
            data[0]?.PathProfileImage || "/default-profile.png"
          );
        }
      } catch (error) {}
    };

    fetchAdminData();
  }, [AdminID]);

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

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const sessionRes = await fetch("/api/getSession");
        const sessionData = await sessionRes.json();
        if (sessionRes.ok && sessionData.userId) {
          setUserId(sessionData.userId);
        }
      } catch (error) {}
    };
    fetchSessionData();
    if (!userId) return;

    const fetchFoot3DModel = async () => {
      try {
        const response = await fetch(
          `/api/foot3d?userId=${userId}&side=${activeButton}`
        );
        if (response.ok) {
          const data = await response.json();
          setModelUrl(data.Foot3DPath);
        }
      } catch (error) {}
    };

    fetchFoot3DModel();
  }, [userId, activeButton]);

  const rotateLeft = () => {
    setActiveButton("left");
  };

  const rotateRight = () => {
    setActiveButton("right");
  };

  const downloadSTL = async () => {
    try {
      const response = await fetch(modelUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = modelUrl.split("/").pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {}
  };

  const handleProfileClick = () => {
    router.push("/AdminPage/EditAcc");
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
            onClick={() => setShowNotification(!showNotification)}
          />
          <NotificationPopup
            notifications={notifications}
            showNotification={showNotification}
            closeNotification={() => setShowNotification(false)}
          />
          <img
            src={PathProfileImage}
            alt="Profile"
            className="profile-pic"
            onClick={handleProfileClick}
          />
        </div>
      </div>

      <div className="CanvasContainer">
        <h1>โมเดลเท้า 3 มิติ</h1>
        <div className="download-container">
          <button onClick={downloadSTL} className="downloadButton">
            ดาวน์โหลดโมเดลเท้า 3 มิติ
          </button>
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
                คุณแน่ใจที่จะแก้ไขโมเดลเท้า 3 มิติ ใช่หรือไม่?
              </h2>
              <p className="popup-subtitle">
                ข้อมูลที่มีอยู่จะถูกลบและไม่สามารถกู้คืนได้
              </p>
              <div className="popup-buttons">
                <Link href="/takePhotoFoot/takePhotoFootLeft1">
                  <button className="confirm-btn">ใช่</button>
                </Link>
                <button
                  className="cancel-btn"
                  onClick={() => setShowPopup(false)}
                >
                  ไม่ ใช้โมเดล 3 มิติเดิม
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="canvas-container">
          {modelUrl ? (
            <Canvas
              style={{ width: "380px", height: "400px", margin: "0 auto" }}
              camera={{ position: [6, -10, 10] }}
            >
              <ambientLight intensity={0.5} />
              <directionalLight position={[0, 5, 5]} intensity={3} />
              <OrbitControls target={[6, 7, 5]} />
              <STLModel url={modelUrl} />
            </Canvas>
          ) : (
            <p
              style={{
                textAlign: "center",
                marginTop: "20px",
                fontSize: "18px",
                color: "gray",
              }}
            >
              ยังไม่มีภาพโมเดล 3 มิติ
            </p>
          )}
        </div>

        <div className="footButtonContainer">
          <button
            className={`leftButton ${
              activeButton === "left" ? "activeLeft" : ""
            }`}
            onClick={rotateLeft}
          >
            ซ้าย
          </button>
          <button
            className={`rightButton ${
              activeButton === "right" ? "activeRight" : ""
            }`}
            onClick={rotateRight}
          >
            ขวา
          </button>
        </div>
      </div>
    </div>
  );
};

export default withAuthAdmin(UserFoot3D);
