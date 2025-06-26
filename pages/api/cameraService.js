
export const startCamera = async (videoRef, facingMode = "environment") => {
  if (!navigator.mediaDevices?.getUserMedia) {
    
    return;
  }

  try {
    
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }

    
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode },
      audio: false,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  } catch (error) {
    
  }
};

export const capturePhoto = (videoRef, canvasRef) => {
  if (canvasRef.current && videoRef.current) {
    const context = canvasRef.current.getContext("2d");
    if (context) {
      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      const dataURL = canvasRef.current.toDataURL("image/png"); 
      return dataURL;
    }
  }
  return null;
};

export const saveToLocalStorage = (imageKey, imageData, frameKey, frameData) => {
  localStorage.setItem(imageKey, imageData);
  localStorage.setItem(frameKey, frameData);
};
