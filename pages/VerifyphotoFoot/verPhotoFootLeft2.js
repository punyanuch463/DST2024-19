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

 const verPhotoFootLeft2 = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [frameImage, setFrameImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter();
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
    const initializeSession = async () => {
      const sessionData = await fetchSessionData();
      if (sessionData?.userId) setUserId(sessionData.userId);
    };
    initializeSession();
  }, []);

  useEffect(() => {
    const image = localStorage.getItem("capturedImage");
    const frame = localStorage.getItem("frameImage");
    if (image) setCapturedImage(image);
    if (frame) setFrameImage(frame);
  }, []);

  const handleBack = () => {
    router.push("/UserPage/HomePageUser");
  };

  const handleSaveImage = async () => {
    if (capturedImage && userId) {
       const imageCategoryId = 2; 
        const side = "left"; 
       const fileName = "imagefootleft2.png"; 
           
      const orderId = localStorage.getItem("orderId");
  
      if (orderId) {
        const result = await saveImageToDatabase(capturedImage, userId, imageCategoryId, side, fileName, orderId);
        if (result?.id) {
          router.push("/takePhotoFoot/takePhotoFootLeft3");
        }
      }
    }
  };

  return (
    <main className={styles.main}>
      <FontAwesomeIcon icon={faArrowLeft} className={styles.backIcon} onClick={handleBack} />
      <p className={styles.footTextTitle}>ข้างเท้าด้านในข้างซ้าย</p>
      <ImagePreview capturedImage={capturedImage} frameImage={frameImage} />
      <p className={styles.footTextSubTitle}>รูปภาพของคุณสามารถใช้งานได้</p>
      <FooterActions onConfirm={handleSaveImage} retakePath="/takePhotoFoot/takePhotoFootLeft2" />

    </main>
  );
}

export default withAuth(verPhotoFootLeft2);