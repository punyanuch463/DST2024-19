import React from "react";
import styles from "../pages/VerifyphotoFoot/verphoto.module.css";

export default function ImagePreview({ capturedImage, frameImage }) {
  if (!capturedImage || !frameImage) {
    return <p>ยังไม่มีรูปภาพ</p>;
  }

  return (
    <div className={styles.imageContainer}>
      <div className={styles.frameContainer}>
        <img src={capturedImage} alt="Captured" className={styles.capturedImage} />
        <img src={frameImage} alt="Frame" className={styles.frameLine} />
      </div>
    </div>
  );
}
