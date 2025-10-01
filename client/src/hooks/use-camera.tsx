import { useState, useRef, useCallback } from "react";

export function useCamera() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      console.log("Requesting camera access...");
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported in this browser");
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
      });
      
      console.log("Camera stream obtained:", stream);
      
      // Wait for video ref to be available
      let retryCount = 0;
      const maxRetries = 50; // 5 seconds max
      
      const setupVideo = () => {
        if (videoRef.current) {
          console.log("Video ref is available, setting up video element");
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setIsCameraActive(true);
          setError(null);
          
          // Wait for video to be ready
          videoRef.current.onloadedmetadata = () => {
            console.log("Video metadata loaded, starting playback");
            if (videoRef.current) {
              videoRef.current.play().catch(console.error);
            }
          };
          
          videoRef.current.onloadeddata = () => {
            console.log("Video data loaded, dimensions:", videoRef.current?.videoWidth, "x", videoRef.current?.videoHeight);
          };
          
          videoRef.current.oncanplay = () => {
            console.log("Video can play, camera is ready");
          };
          
          videoRef.current.onplaying = () => {
            console.log("Video is playing, dimensions:", videoRef.current?.videoWidth, "x", videoRef.current?.videoHeight);
          };
          
          videoRef.current.onerror = (e) => {
            console.error("Video error:", e);
            setError("Video playback error");
          };
        } else if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Video ref not available yet, retrying in 100ms (attempt ${retryCount}/${maxRetries})`);
          setTimeout(setupVideo, 100);
        } else {
          console.error("Video ref not available after maximum retries");
          setError("Video element not ready after timeout");
        }
      };
      
      setupVideo();
    } catch (err) {
      console.error("Camera error:", err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError("Camera access denied. Please allow camera permissions and try again.");
        } else if (err.name === 'NotFoundError') {
          setError("No camera found. Please connect a camera and try again.");
        } else if (err.name === 'NotReadableError') {
          setError("Camera is already in use by another application.");
        } else {
          setError(`Camera error: ${err.message}`);
        }
      } else {
        setError("Failed to access camera. Please check your camera permissions.");
      }
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
      console.log("Starting photo capture...");
      console.log("isCameraActive:", isCameraActive);
      console.log("videoRef.current:", videoRef.current);
      
      if (!videoRef.current || !isCameraActive) {
        console.error("Camera not active or video ref not available");
        resolve(null);
        return;
      }

      const video = videoRef.current;
      console.log("Video element:", video);
      console.log("Video dimensions:", video.videoWidth, "x", video.videoHeight);
      console.log("Video ready state:", video.readyState);
      console.log("Video current time:", video.currentTime);
      console.log("Video paused:", video.paused);
      
      // Wait for video to be ready if dimensions are 0
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.log("Video not ready, waiting for loadeddata event...");
        
        const handleLoadedData = () => {
          console.log("Video loadeddata event fired");
          console.log("New dimensions:", video.videoWidth, "x", video.videoHeight);
          
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            performCapture();
          } else {
            console.error("Video still not ready after loadeddata event");
            resolve(null);
          }
          
          video.removeEventListener('loadeddata', handleLoadedData);
        };
        
        video.addEventListener('loadeddata', handleLoadedData);
        
        // Fallback timeout
        setTimeout(() => {
          video.removeEventListener('loadeddata', handleLoadedData);
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            performCapture();
          } else {
            console.error("Video not ready after timeout");
            resolve(null);
          }
        }, 2000);
        
        return;
      }
      
      // Video is ready, proceed with capture
      performCapture();
      
      function performCapture() {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        
        if (!context) {
          console.error("Could not get canvas context");
          resolve(null);
          return;
        }

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        console.log("Canvas dimensions set to:", canvas.width, "x", canvas.height);
        
        try {
          // Draw the current video frame to canvas
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          console.log("Image drawn to canvas successfully");
          
          // Convert to blob
          canvas.toBlob((blob) => {
            if (blob) {
              console.log("Photo captured successfully, size:", blob.size, "bytes");
              resolve(blob);
            } else {
              console.error("Failed to create blob from canvas");
              resolve(null);
            }
          }, "image/jpeg", 0.9);
        } catch (drawError) {
          console.error("Error drawing image to canvas:", drawError);
          resolve(null);
        }
      }
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
