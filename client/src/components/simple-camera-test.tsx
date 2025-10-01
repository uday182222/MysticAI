import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function SimpleCameraTest() {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const addLog = (message: string) => {
    setDebugLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const startCamera = async () => {
    try {
      addLog("Starting camera...");
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
      });
      
      addLog("Camera stream obtained");
      
      if (videoRef.current) {
        addLog("Video ref is available, setting up video");
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsActive(true);
        
        videoRef.current.onloadedmetadata = () => {
          addLog("Video metadata loaded");
          if (videoRef.current) {
            videoRef.current.play().catch(console.error);
          }
        };
        
        videoRef.current.onloadeddata = () => {
          addLog(`Video data loaded: ${videoRef.current?.videoWidth}x${videoRef.current?.videoHeight}`);
        };
        
        videoRef.current.onplaying = () => {
          addLog("Video is playing");
        };
      } else {
        addLog("Video ref is null!");
        setError("Video element not available");
      }
    } catch (err) {
      addLog(`Camera error: ${err}`);
      setError(`Camera error: ${err}`);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsActive(false);
    addLog("Camera stopped");
  };

  const capturePhoto = () => {
    if (!videoRef.current || !isActive) {
      addLog("Cannot capture - camera not active or video ref null");
      return;
    }

    const video = videoRef.current;
    addLog(`Video dimensions: ${video.videoWidth}x${video.videoHeight}`);
    
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      addLog("Video not ready for capture");
      return;
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    
    if (!context) {
      addLog("Could not get canvas context");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    try {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      addLog("Image drawn to canvas successfully");
      
      canvas.toBlob((blob) => {
        if (blob) {
          addLog(`Photo captured! Size: ${blob.size} bytes`);
        } else {
          addLog("Failed to create blob");
        }
      }, "image/jpeg", 0.9);
    } catch (err) {
      addLog(`Canvas error: ${err}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold">Simple Camera Test</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Controls</h3>
            <div className="space-y-2">
              <Button onClick={startCamera} disabled={isActive} className="w-full">
                Start Camera
              </Button>
              <Button onClick={stopCamera} disabled={!isActive} variant="outline" className="w-full">
                Stop Camera
              </Button>
              <Button onClick={capturePhoto} disabled={!isActive} className="w-full">
                Capture Photo
              </Button>
              <Button onClick={() => setDebugLog([])} variant="outline" size="sm">
                Clear Log
              </Button>
            </div>
            
            {error && (
              <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Debug Log</h3>
            <div className="max-h-40 overflow-y-auto text-xs bg-gray-100 p-2 rounded">
              {debugLog.map((log, index) => (
                <div key={index}>{log}</div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Camera Preview</h3>
          <div className="relative">
            <video 
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-64 bg-black rounded"
            />
            {!isActive && (
              <div className="absolute inset-0 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500">Camera not active</span>
              </div>
            )}
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Video ref: {videoRef.current ? 'Available' : 'Null'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
