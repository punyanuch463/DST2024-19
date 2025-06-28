import { useRef, useEffect, useState } from "react";
import {
  startCamera,
  capturePhoto,
  saveToLocalStorage,
} from "../pages/api/cameraService";
import styles from "../pages/takePhotoFoot/takephoto.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

const Camera = ({ frameSrc, onCapture, redirectTo }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [facingMode, setFacingMode] = useState("environment");
  const [isFootInFrame, setIsFootInFrame] = useState(false);

  useEffect(() => {
    startCamera(videoRef, facingMode);
  }, [facingMode]);

  const handleCapture = () => {
    const photo = capturePhoto(videoRef, canvasRef);
    saveToLocalStorage("capturedImage", photo, "frameImage", frameSrc);
    if (redirectTo) redirectTo();
    if (onCapture) onCapture(photo);
  };

  const toggleCamera = async () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;

    const newFacingMode = facingMode === "user" ? "environment" : "user";
    try {
      await startCamera(videoRef, newFacingMode);
      setFacingMode(newFacingMode);
    } catch (error) {}
  };

  return (
    <div className={styles.camera}>
      <div className={styles["video-wrapper"]}>
        <video ref={videoRef} className={styles.video} autoPlay playsInline />
        <div
          className={styles.overlay}
          onMouseEnter={() => setIsFootInFrame(true)}
          onMouseLeave={() => setIsFootInFrame(false)}
        >
          <img src={frameSrc} alt="Frame" className={styles["frame-line"]} />
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className={styles.canvas}
        width="640"
        height="480"
      />

      <button className={styles.captureButton} onClick={handleCapture}>
        <FontAwesomeIcon icon={faCamera} className={styles.cameraIcon} />
      </button>
    </div>
  );
};

export default Camera;
