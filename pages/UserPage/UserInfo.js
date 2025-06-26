import React, { useState, useEffect } from "react";
import { updatePageTitle } from "../../utils/routeTitle";
import { useRouter } from "next/router";
import styles from "/styles/footdata.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FaRegQuestionCircle } from "react-icons/fa";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import withAuth from "../../hoc/withAuth"; 
import NotificationPopup from "../../components/NotificationPopup";

const FootSizeForm = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showTable, setShowTable] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [image, setImage] = useState("/description.png"); 
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [modalMessage, setModalMessage] = useState(""); 

  const [footMeasurements, setFootMeasurements] = useState({
    A: "",
    B: "",
    C: "",
    D: "",
    E: "",
    F: "",
    G: "",
    H: "",
    I: "",
    footType: "",
  });

  const [initialFootMeasurements, setInitialFootMeasurements] = useState({}); 
  const [PathProfileImage, setPathProfileImage] = useState("/default-profile.png"); 
  const [userId, setUserId] = useState(null);
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
        }
      } catch (error) {
        
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
  }, []);
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

  useEffect(() => {
    const fetchFootData = async () => {
      if (!userId) return; 

      try {
        const response = await fetch(`/api/footData?userId=${userId}`);
        const data = await response.json();

        if (response.ok) {
          const measurements = {
            A: data.A || "",
            B: data.B || "",
            C: data.C || "",
            D: data.D || "",
            E: data.E || "",
            F: data.F || "",
            G: data.G || "",
            H: data.H || "",
            I: data.I || "",
            footType: data.Side || "",
          };

          setFootMeasurements(measurements);
          setInitialFootMeasurements(measurements); 
        } else {
          
        }
      } catch (error) {
        
      }
    };

    fetchFootData();
  }, [userId]); 

  const handleEdit = () => {
    setIsEditing(true);
    setIsEditable(true); 
  };

  const handleSave = () => {
    if (isEditing) {
      setModalMessage({
        title: "คุณแน่ใจที่จะแก้ไขขนาดเท้าใช่หรือไม่",
        subtitle: "กรุณายืนยันการแก้ไขของคุณ",
      });
    } else {
      setModalMessage({
        title: "บันทึกข้อมูลโดยไม่แก้ไขขนาดเท้า",
        subtitle: "กรุณายืนยันการแก้ไขของคุณ",
      });
    }
    setIsModalOpen(true); 
    setIsEditing(false); 
  };

  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      
      if (name !== "A" && parseFloat(value) > parseFloat(footMeasurements.A)) {
        
        
        setModalMessage({ title: `ค่าของ ${name} ห้ามเกินค่า A` });
        setIsModalOpen(true); 
        return; 
      }
      setFootMeasurements({
        ...footMeasurements,
        [name]: value,
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowPopup(true);
  };

  const handleConfirmModal = async () => {
    try {
      const response = await fetch(`/api/footData`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ...footMeasurements,
          message: "โมเดลเท้า 3 มิติกำลังถูกสร้างขึ้น",
          status: "Unread",
        }),
      });

      if (!response.ok) {
        throw new Error(" เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }

      
      const foot3dData = [
        { userId, foot3DPath: "/Foot3d/3d001.stl", side: "left" },
        { userId, foot3DPath: "/Foot3d/3d002.stl", side: "right" },
      ];

      for (const foot of foot3dData) {
        const foot3dResponse = await fetch(`/api/foot3d`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(foot),
        });

        if (!foot3dResponse.ok) {
          throw new Error(` Error inserting Foot3D: ${foot.side}`);
        }
      }

      
    
      const orderId = notifications[0].OrderID;
      const orderResponse = await fetch(`/api/order`, {
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
      setIsEditable(false);
      setIsModalOpen(false);
      router.push("/UserPage/HomePageUser");
    } catch (error) {
      
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEditable(false); 
  };

  const handleNext = () => {
    
    setImage("/description2.png");
  };

  const handleBack = () => {
    
    setImage("/description.png");
  };
  const handleProfileClick = () => {
    router.push("/UserPage/EditAcc");
  };
  const tableDataDes1 = [
    { key: "A", label: "ความยาวของเท้า" },
    { key: "B", label: "ความยาวของเท้า (ไม่รวมนิ้วเท้า)" },
    { key: "C", label: "ความกว้างของกลางเท้า" },
    { key: "D", label: "ความยาวระหว่างส้นเท้ากับจมูกเท้า (Apex of 1st MTH)" },
    { key: "E", label: "ความยาวระหว่างส้นเท้ากับจมูกเท้า (Apex of 5th MTH)" },
    { key: "F", label: "ความกว้างของหน้าเท้า" },
    { key: "G", label: "ความกว้างของส้นเท้า" },
    { key: "I", label: "ความยาวระหว่างส้นเท้ากับกลางเท้า" },
  ];

  const slides = [
    <div className="container">
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
            onClick={toggleNotification}
          />
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

      <main className={styles.main}>
        <p className={styles.title}>ข้อมูลเท้าของคุณ</p>

        <div className={styles.detailed}>
          <button
            className={styles.infButton}
            onClick={() => setShowTable(!showTable)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
            </svg>
          </button>
          <p
            className={styles["detailed-text"]}
            onClick={() => setShowTable(!showTable)}
          >
            คำอธิบายเพิ่มเติม
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles["foot-size-form"]}>
            <div className={styles["foot-size-form__image"]}>
              <img src={image} alt="Foot Outline" />

              <div className={styles["navigation-buttons"]}>
                <button
                  type="button"
                  className={styles["circle-button"]}
                  onClick={handleBack}
                >
                  ◀
                </button>
                <button
                  type="button"
                  className={styles["circle-button"]}
                  onClick={handleNext}
                >
                  ▶
                </button>
              </div>
            </div>

            {showTable && (
              <table className={styles["foot-measurement-table"]}>
                <thead>
                  <tr>
                    <th></th>
                    <th>คำอธิบาย</th>
                  </tr>
                </thead>
                <tbody>
                  {tableDataDes1.map((item) => (
                    <tr key={item.key}>
                      <td>{item.key}</td>
                      <td>{item.label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className={styles["foot-size-form__measurements"]}>
              <div className={styles["measurements-grid"]}>
                {Object.keys(footMeasurements)
                  .slice(0, 9)
                  .map((key) => (
                    <div key={key} className={styles["measurement-field"]}>
                      <label htmlFor={key}>{key} (ซม.):</label>
                      <input
                        type="text"
                        id={key}
                        name={key}
                        value={footMeasurements[key]}
                        onChange={handleChange}
                        readOnly={!isEditable}
                      />
                    </div>
                  ))}
                <div className={styles["measurement-field"]}>
                  <label htmlFor="footType">ประเภทอุ้งเท้า:</label>
                  <input
                    type="text"
                    id="footType"
                    name="footType"
                    value={footMeasurements.footType}
                    onChange={handleChange}
                    readOnly={!isEditable}
                  />
                </div>
              </div>
            </div>
            <div className={styles["foot-size-form__buttons"]}>
              <button type="button" onClick={handleEdit}>
                แก้ไข
              </button>
              <button type="button" onClick={handleSave}>
                บันทึก
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>,
  ];

  return (
    <div>
      {slides[currentSlide]}
      {isModalOpen && (
        <div className="modal">
          <div className="modalContent">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            {modalMessage?.title && modalMessage?.subtitle && (
              <FaRegQuestionCircle className={styles.questionIcon} />
            )}
            <p className={styles.popupTitle}>{modalMessage?.title}</p>
            <p className={styles.popupSubtitle}>{modalMessage?.subtitle}</p>

            <div className={styles.popupButtons}>
              {modalMessage?.title && modalMessage?.subtitle && (
                <button className="confirmButton" onClick={handleConfirmModal}>
                  ยืนยัน
                </button>
              )}
              <button className="cancelButton" onClick={handleCloseModal}>
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(FootSizeForm);
