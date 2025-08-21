import { useState, useRef, useCallback } from "react";

export function useCamera() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        setError(null);
      }
    } catch (err) {
      setError("Failed to access camera. Please check your camera permissions.");
      console.error("Camera error:", err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraActive(false);
  }, []);

  const capturePhoto = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!videoRef.current || !isCameraActive) {
        resolve(null);
        return;
      }

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      
      if (!context) {
        resolve(null);
        return;
      }

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      context.drawImage(videoRef.current, 0, 0);
      
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg", 0.8);
    });
  }, [isCameraActive]);

  return {
    isCameraActive,
    error,
    videoRef,
    startCamera,
    stopCamera,
    capturePhoto,
  };
}
