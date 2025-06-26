"use client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Camera from "../../components/Camera";
import styles from "./takephoto.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faInfoCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import withAuth from "../../hoc/withAuth";
import { updatePageTitle } from "../../utils/routeTitle";

const TakePhotoFootLeft4 = () => {
  const router = useRouter();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleGuidelineRedirect = () => {
    router.push("/UserPage/Guideline"); 
  };
  
  const handleBack = () => {
    router.push("/UserPage/HomePageUser");
  };

  const handleRedirect = () => {
    router.push("/VerifyphotoFoot/verPhotoFootLeft4");
  };

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

  return (
    <main className={styles.main}>
      <FontAwesomeIcon
        icon={faArrowLeft}
        className={styles.backIcon}
        onClick={handleBack}
      />
      <p className={styles.footTextTitle}>ภาพวาดบนกระดาษเท้าข้างซ้าย</p>
      <p className={styles.footTextSubTitle}>
        โปรดวางเท้าของท่านให้อยู่ภายในกรอบ
      </p>

      <div
        className={styles.infoContainer}
        onClick={() => setIsPopupOpen(true)}
      >
        <FontAwesomeIcon icon={faInfoCircle} className={styles.infoIcon} />
        <span className={styles.infoText}>คำอธิบายเพิ่มเติม</span>
      </div>

      <Camera frameSrc="/footleft1.png" redirectTo={handleRedirect} />
      <footer className={styles.footer}></footer>

      {isPopupOpen && (
        <div className={styles.popupCanvas}>
          <div className={styles.popupOverlay}>
            <div className={styles.popupContent}>
              <FontAwesomeIcon
                icon={faTimes}
                className={styles.closeIcon}
                onClick={() => setIsPopupOpen(false)}
              />
              <h2 className={styles.popupTitle}>การวางเท้า</h2>
              <p className={styles.popupText}>
                ตรวจสอบให้แน่ใจว่าใช้เท้าซ้ายหรือขวาตามที่กำหนด
              </p>
              <div className={styles.footImageContainer}>
                <div className={styles.footItem}>
                  <img
                    src="/Guideline/FL4.png"
                    alt="เท้าซ้าย"
                    className={styles.footImage}
                  />
                  <p className={styles.footLabel}>เท้าซ้าย</p>
                  <div className={styles.guidelineTextContainer}>
        <span className={styles.guidelineText} onClick={handleGuidelineRedirect}>
          เพิ่มเติม
        </span>
      </div>
                </div>
               
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default withAuth(TakePhotoFootLeft4);
