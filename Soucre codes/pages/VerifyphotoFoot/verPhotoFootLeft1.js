import React, { useEffect, useState } from "react";
import styles from "./verphoto.module.css";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { fetchSessionData, saveImageToDatabase } from "../../pages/api/imageService";
import ImagePreview from "../../components/ImagePreview";
import FooterActions from "../../components/FooterActions";
import withAuth from "../../hoc/withAuth";
import { updatePageTitle } from "../../utils/routeTitle";

const verPhotoFootLeft1 = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [frameImage, setFrameImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    updatePageTitle(router.pathname);
    const handleRouteChange = (url) => updatePageTitle(url);
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router]);

  useEffect(() => {
    const initializeSession = async () => {
      const sessionData = await fetchSessionData();
      if (sessionData?.userId) setUserId(sessionData.userId);
    };
    initializeSession();
  }, []);

  useEffect(() => {
    setCapturedImage(localStorage.getItem("capturedImage"));
    setFrameImage(localStorage.getItem("frameImage"));
  }, []);

  const handleBack = () => router.push("/UserPage/HomePageUser");
  
  const formatDateTime = (dateTimeString) => {
    const dateObj = new Date(dateTimeString);
    const year = dateObj.getFullYear()+543;
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} เวลา: ${hours}.${minutes}`;
  };
  
  const handleSaveImage = async () => {
    if (capturedImage && userId) {
      const imageCategoryId = 1;
      const side = "left";
      const fileName = "imagefootleft1.png";
  
      
      const orderResponse = await fetch("/api/user/notificationUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          message: `ถ่ายภาพเข้าสู่ระบบ วัน: ${formatDateTime(new Date().toISOString())}`,
          status: "Unread",
        }),
      });
      
      const orderData = await orderResponse.json();
      const orderId = orderData?.orderId;
  
      if (orderId) {
        
        localStorage.setItem("orderId", orderId);
        
        const result = await saveImageToDatabase(
          capturedImage,
          userId,
          imageCategoryId,
          side,
          fileName,
          orderId 
        );
  
        if (result?.id) {
          router.push("/takePhotoFoot/takePhotoFootLeft2");
        }
      }
    }
    };
    

  return (
    <main className={styles.main}>
      <FontAwesomeIcon icon={faArrowLeft} className={styles.backIcon} onClick={handleBack} />
      <p className={styles.footTextTitle}>ฝ่าเท้าข้างซ้าย</p>
      <div className={styles.imagePreviewContainer}>
        <ImagePreview capturedImage={capturedImage} frameImage={frameImage} />
      </div>
      <p className={styles.footTextSubTitle}>รูปภาพของคุณสามารถใช้งานได้</p>
      <FooterActions onConfirm={handleSaveImage} retakePath="/takePhotoFoot/takePhotoFootLeft1" />
    </main>
  );
};

export default withAuth(verPhotoFootLeft1);
