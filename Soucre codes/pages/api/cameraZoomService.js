export async function startCamera(videoRef, facingMode, zoomLevel = 1) {
  try {
    const constraints = {
      video: {
        facingMode: facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    const videoTrack = stream.getVideoTracks()[0];
    const capabilities = videoTrack.getCapabilities();

    if (capabilities.zoom) {
      await videoTrack.applyConstraints({ advanced: [{ zoom: zoomLevel }] });
    }

    return stream;
  } catch (error) {
    console.error("Error accessing camera:", error);
  }
}


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
