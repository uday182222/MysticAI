import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCamera } from "@/hooks/use-camera";
import { Camera, X, Loader2 } from "lucide-react";

export function CameraDebug() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  
  const {
    isCameraActive,
    error: cameraError,
    videoRef,
    startCamera,
    stopCamera,
    capturePhoto,
  } = useCamera();

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  // Monitor video ref availability
  useEffect(() => {
    const checkVideoRef = () => {
      if (videoRef.current) {
        addDebugInfo("Video ref became available!");
      }
    };
    
    const interval = setInterval(checkVideoRef, 100);
    return () => clearInterval(interval);
  }, []);

  const handleStartCamera = async () => {
    addDebugInfo("Starting camera...");
    addDebugInfo(`Video ref before start: ${videoRef.current ? 'Available' : 'Null'}`);
    await startCamera();
    addDebugInfo("Camera start attempt completed");
    addDebugInfo(`Video ref after start: ${videoRef.current ? 'Available' : 'Null'}`);
  };

  const handleCapture = async () => {
    addDebugInfo("Attempting to capture photo...");
    
    // Check video element state before capture
    if (videoRef.current) {
      addDebugInfo(`Video state - Dimensions: ${videoRef.current.videoWidth}x${videoRef.current.videoHeight}, ReadyState: ${videoRef.current.readyState}, Paused: ${videoRef.current.paused}`);
    }
    
    const blob = await capturePhoto();
    if (blob) {
      addDebugInfo(`Photo captured! Size: ${blob.size} bytes`);
      const url = URL.createObjectURL(blob);
      setCapturedImage(url);
    } else {
      addDebugInfo("Photo capture failed - check console for details");
    }
  };

  const clearDebug = () => {
    setDebugInfo([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold">Camera Debug Tool</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Camera Controls</h3>
            <div className="space-y-2">
              <Button 
                onClick={handleStartCamera} 
                disabled={isCameraActive}
                className="w-full"
              >
                {isCameraActive ? "Camera Active" : "Start Camera"}
              </Button>
              
              <Button 
                onClick={stopCamera} 
                disabled={!isCameraActive}
                variant="outline"
                className="w-full"
              >
                Stop Camera
              </Button>
              
              <Button 
                onClick={handleCapture} 
                disabled={!isCameraActive}
                className="w-full"
              >
                <Camera className="mr-2 h-4 w-4" />
                Capture Photo
              </Button>
              
              <Button 
                onClick={() => {
                  if (videoRef.current) {
                    addDebugInfo(`Video check - Width: ${videoRef.current.videoWidth}, Height: ${videoRef.current.videoHeight}, ReadyState: ${videoRef.current.readyState}, CurrentTime: ${videoRef.current.currentTime}, Paused: ${videoRef.current.paused}`);
                  } else {
                    addDebugInfo("Video ref is null");
                  }
                }}
                disabled={!isCameraActive}
                variant="outline"
                className="w-full"
              >
                Check Video State
              </Button>
            </div>
            
            {cameraError && (
              <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
                Error: {cameraError}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Debug Info</h3>
            <div className="space-y-2">
              <Button onClick={clearDebug} variant="outline" size="sm">
                Clear Debug
              </Button>
              <div className="max-h-40 overflow-y-auto text-xs bg-gray-100 p-2 rounded">
                {debugInfo.map((info, index) => (
                  <div key={index}>{info}</div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded text-xs">
                {videoRef.current?.videoWidth}x{videoRef.current?.videoHeight}
              </div>
              {!isCameraActive && (
                <div className="absolute inset-0 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-500">Camera not active</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Captured Image</h3>
            {capturedImage ? (
              <div className="space-y-2">
                <img 
                  src={capturedImage} 
                  alt="Captured" 
                  className="w-full h-64 object-cover rounded"
                />
                <Button 
                  onClick={() => {
                    setCapturedImage(null);
                    URL.revokeObjectURL(capturedImage);
                  }}
                  variant="outline"
                  size="sm"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear Image
                </Button>
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500">No image captured</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
