import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCamera } from "@/hooks/use-camera";
import { useAnalysisError } from "@/hooks/use-analysis-error";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Camera, Upload, X, RefreshCw, Loader2 } from "lucide-react";
import { PalmAnalysisResult } from "@shared/schema";
import { CosmicLoader } from "@/components/cosmic-loader";
import { AnalysisErrorDisplay } from "@/components/analysis-error-display";

interface PalmAnalysisInterfaceProps {
  onAnalysisComplete: (result: PalmAnalysisResult, imageUrl: string, analysisId: string) => void;
}

export function PalmAnalysisInterface({ onAnalysisComplete }: PalmAnalysisInterfaceProps) {
  const [selectedMethod, setSelectedMethod] = useState<"upload" | "camera">("upload");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  const { analysisError, retryCount, clearError, setError, resetRetry, handleRetry } = useAnalysisError();
  const {
    isCameraActive,
    error: cameraError,
    videoRef,
    startCamera,
    stopCamera,
    capturePhoto,
  } = useCamera();

  const analysisMutation = useMutation({
    mutationFn: async (imageFile: File) => {
      const formData = new FormData();
      formData.append('palmImage', imageFile);
      
      // Use fetch directly for file uploads (apiRequest doesn't handle FormData properly)
      const response = await fetch("/api/palm/analyze", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) {
        let errorMessage = `Analysis failed (${response.status})`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      clearError();
      resetRetry();
      onAnalysisComplete(data.result, data.imageUrl, data.id);
      toast({
        title: "Analysis Complete!",
        description: "Your palm reading is ready.",
      });
    },
    onError: (error) => {
      const errorMessage = error.message || "An unexpected error occurred during analysis";
      setError(errorMessage);
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });


  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleCapture = async () => {
    if (isCapturing) return;
    
    try {
      setIsCapturing(true);
      console.log("Attempting to capture photo...");
      const blob = await capturePhoto();
      if (blob) {
        console.log("Photo captured, creating file...");
        const file = new File([blob], "palm-capture.jpg", { type: "image/jpeg" });
        setUploadedImage(file);
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        stopCamera();
        setSelectedMethod("upload");
        
        toast({
          title: "Photo Captured!",
          description: "Your palm photo has been captured successfully.",
        });
      } else {
        console.error("Failed to capture photo");
        toast({
          title: "Capture Failed",
          description: "Failed to capture photo. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error capturing photo:", error);
      toast({
        title: "Capture Error",
        description: "An error occurred while capturing the photo.",
        variant: "destructive",
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const handleAnalyze = () => {
    if (!uploadedImage) {
      toast({
        title: "No Image Selected",
        description: "Please upload or capture a palm image first.",
        variant: "destructive",
      });
      return;
    }

    clearError();
    analysisMutation.mutate(uploadedImage);
  };

  const handleRetryClick = () => {
    if (!uploadedImage) return;
    handleRetry(() => analysisMutation.mutate(uploadedImage));
  };

  const resetUpload = () => {
    setUploadedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Analyze Your Palm</h3>
            <p className="text-lg text-gray-300">
              Choose your preferred method to capture your palm image for AI analysis
            </p>
          </div>


          {/* Upload Methods */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card 
              className={`cursor-pointer transition-all duration-300 relative overflow-hidden border-0 shadow-sm bg-card/95 backdrop-blur ${selectedMethod === "upload" ? "shadow-lg" : "hover:shadow-md"}`}
              onClick={() => setSelectedMethod("upload")}
            >
              {/* Gradient top border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400" />
              <CardContent className="p-6 pt-7 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-violet-500" />
                </div>
                <h4 className="text-xl font-semibold text-card-foreground mb-2">Upload Image</h4>
                <p className="text-muted-foreground mb-4">
                  Select an existing palm photo from your device
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
                  onClick={() => fileInputRef.current?.click()}
                  data-testid="button-choose-file"
                >
                  Choose File
                </Button>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all duration-300 relative overflow-hidden border-0 shadow-sm bg-card/95 backdrop-blur ${selectedMethod === "camera" ? "shadow-lg" : "hover:shadow-md"}`}
              onClick={() => {
                setSelectedMethod("camera");
                if (!isCameraActive) startCamera();
              }}
            >
              {/* Gradient top border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400" />
              <CardContent className="p-6 pt-7 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8 text-violet-500" />
                </div>
                <h4 className="text-xl font-semibold text-card-foreground mb-2">Take Photo</h4>
                <p className="text-muted-foreground mb-4">
                  Use your device camera to capture your palm
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
                  onClick={() => startCamera()}
                  data-testid="button-open-camera"
                >
                  Open Camera
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Analysis Area */}
          <Card className="relative overflow-hidden border-0 shadow-lg bg-card/95 backdrop-blur">
            {/* Gradient top border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400" />
            <CardContent className="p-6 pt-7">
              {/* Camera View */}
              {selectedMethod === "camera" && (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden bg-slate-100">
                    <video 
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-80 object-cover"
                      data-testid="video-camera-preview"
                    />
                    {!isCameraActive && (
                      <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                        <div className="text-center">
                          <Camera className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                          <p className="text-slate-500">Camera not active</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <Button
                        onClick={handleCapture}
                        disabled={isCapturing}
                        size="lg"
                        className="w-16 h-16 rounded-full bg-white border-4 border-accent hover:bg-slate-50 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                        data-testid="button-capture-photo"
                        title={isCapturing ? "Capturing..." : "Click to capture photo"}
                      >
                        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                          {isCapturing ? (
                            <Loader2 className="h-4 w-4 text-white animate-spin" />
                          ) : (
                            <Camera className="h-4 w-4 text-white" />
                          )}
                        </div>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        stopCamera();
                        setSelectedMethod("upload");
                      }}
                      data-testid="button-close-camera"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button 
                      variant="ghost"
                      onClick={() => {
                        stopCamera();
                        setTimeout(startCamera, 100);
                      }}
                      data-testid="button-switch-camera"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Switch Camera
                    </Button>
                  </div>
                  
                  {cameraError && (
                    <div className="text-red-600 text-sm text-center">{cameraError}</div>
                  )}
                </div>
              )}

              {/* Upload Area */}
              {selectedMethod === "upload" && (
                <div>
                  {imagePreview ? (
                    <div className="text-center space-y-4">
                      <div className="relative inline-block">
                        <img 
                          src={imagePreview} 
                          alt="Palm preview" 
                          className="max-w-xs mx-auto rounded-lg shadow-md"
                          data-testid="img-palm-preview"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={resetUpload}
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                          data-testid="button-remove-image"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-300">Palm image uploaded successfully</p>
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed border-violet-300 rounded-lg p-12 text-center hover:border-violet-400 transition-colors cursor-pointer"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      data-testid="drop-zone"
                    >
                      <Upload className="h-16 w-16 text-violet-400 mx-auto mb-4" />
                      <p className="text-xl text-card-foreground font-medium mb-2">Drop your palm image here</p>
                      <p className="text-muted-foreground mb-6">or click to browse your files</p>
                      <Button className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white" data-testid="button-browse-files">
                        <Upload className="mr-2 h-4 w-4" />
                        Browse Files
                      </Button>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    data-testid="input-file-upload"
                  />
                </div>
              )}

              {/* Photo Guidelines */}
              <div className="mt-6 relative overflow-hidden border-0 shadow-sm bg-card/95 backdrop-blur rounded-2xl">
                {/* Gradient top border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400" />
                <div className="p-6 pt-7">
                  <h5 className="font-medium text-card-foreground mb-3 flex items-center">
                    <Camera className="text-violet-500 mr-2 h-4 w-4" />
                    Photo Guidelines for Best Results
                  </h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Ensure your palm is well-lit and clearly visible</li>
                    <li>• Keep your hand flat and open with fingers spread</li>
                    <li>• Take the photo from directly above your palm</li>
                    <li>• Avoid shadows and reflections</li>
                    <li>• Use a plain background for better contrast</li>
                  </ul>
                </div>
              </div>

              {/* Analysis Button */}
              <div className="mt-8 text-center">
                <Button
                  onClick={handleAnalyze}
                  disabled={!uploadedImage || analysisMutation.isPending}
                  size="lg"
                  className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white px-8 py-4 text-lg shadow-lg"
                  data-testid="button-analyze-palm"
                >
                  {analysisMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing Palm...
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2 h-5 w-5" />
                      Analyze Palm
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-300 mt-2">Analysis typically takes 10-30 seconds</p>
              </div>

              {/* Error Display */}
              <AnalysisErrorDisplay
                error={analysisError}
                retryCount={retryCount}
                onRetry={handleRetryClick}
                isPending={analysisMutation.isPending}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <CosmicLoader 
        analysisType="palm"
        isVisible={analysisMutation.isPending}
      />
    </div>
  );
}
