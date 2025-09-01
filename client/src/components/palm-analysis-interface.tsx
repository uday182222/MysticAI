import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCamera } from "@/hooks/use-camera";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Camera, Upload, X, RefreshCw, Loader2 } from "lucide-react";
import { PalmAnalysisResult } from "@shared/schema";
import { CosmicLoader } from "@/components/cosmic-loader";

interface PalmAnalysisInterfaceProps {
  onAnalysisComplete: (result: PalmAnalysisResult, imageUrl: string, analysisId: string) => void;
}

export function PalmAnalysisInterface({ onAnalysisComplete }: PalmAnalysisInterfaceProps) {
  const [selectedMethod, setSelectedMethod] = useState<"upload" | "camera">("upload");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
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
        const text = await response.text();
        throw new Error(`${response.status}: ${text}`);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      onAnalysisComplete(data.result, data.imageUrl, data.id);
      toast({
        title: "Analysis Complete!",
        description: "Your palm reading is ready.",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
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
    const blob = await capturePhoto();
    if (blob) {
      const file = new File([blob], "palm-capture.jpg", { type: "image/jpeg" });
      setUploadedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      stopCamera();
      setSelectedMethod("upload");
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

    analysisMutation.mutate(uploadedImage);
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
            <h3 className="text-3xl font-bold text-primary mb-4">Analyze Your Palm</h3>
            <p className="text-lg text-secondary">
              Choose your preferred method to capture your palm image for AI analysis
            </p>
          </div>


          {/* Upload Methods */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card 
              className={`cursor-pointer transition-colors ${selectedMethod === "upload" ? "border-accent" : "hover:border-accent"}`}
              onClick={() => setSelectedMethod("upload")}
            >
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-accent" />
                </div>
                <h4 className="text-xl font-semibold text-primary mb-2">Upload Image</h4>
                <p className="text-secondary mb-4">
                  Select an existing palm photo from your device
                </p>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  data-testid="button-choose-file"
                >
                  Choose File
                </Button>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-colors ${selectedMethod === "camera" ? "border-accent" : "hover:border-accent"}`}
              onClick={() => {
                setSelectedMethod("camera");
                if (!isCameraActive) startCamera();
              }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8 text-success" />
                </div>
                <h4 className="text-xl font-semibold text-primary mb-2">Take Photo</h4>
                <p className="text-secondary mb-4">
                  Use your device camera to capture your palm
                </p>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => startCamera()}
                  data-testid="button-open-camera"
                >
                  Open Camera
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Analysis Area */}
          <Card>
            <CardContent className="p-6">
              {/* Camera View */}
              {selectedMethod === "camera" && isCameraActive && (
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
                    
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <Button
                        onClick={handleCapture}
                        size="lg"
                        className="w-16 h-16 rounded-full bg-white border-4 border-accent hover:bg-slate-50"
                        data-testid="button-capture-photo"
                      >
                        <div className="w-8 h-8 bg-accent rounded-full"></div>
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
              {(selectedMethod === "upload" || !isCameraActive) && (
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
                      <p className="text-sm text-secondary">Palm image uploaded successfully</p>
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-accent transition-colors cursor-pointer"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      data-testid="drop-zone"
                    >
                      <Upload className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-xl text-primary font-medium mb-2">Drop your palm image here</p>
                      <p className="text-secondary mb-6">or click to browse your files</p>
                      <Button className="bg-accent hover:bg-blue-600" data-testid="button-browse-files">
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
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="font-medium text-primary mb-3 flex items-center">
                  <Camera className="text-accent mr-2 h-4 w-4" />
                  Photo Guidelines for Best Results
                </h5>
                <ul className="text-sm text-secondary space-y-1">
                  <li>• Ensure your palm is well-lit and clearly visible</li>
                  <li>• Keep your hand flat and open with fingers spread</li>
                  <li>• Take the photo from directly above your palm</li>
                  <li>• Avoid shadows and reflections</li>
                  <li>• Use a plain background for better contrast</li>
                </ul>
              </div>

              {/* Analysis Button */}
              <div className="mt-8 text-center">
                <Button
                  onClick={handleAnalyze}
                  disabled={!uploadedImage || analysisMutation.isPending}
                  size="lg"
                  className="bg-accent hover:bg-blue-600 text-white px-8 py-4 text-lg shadow-lg"
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
                <p className="text-sm text-secondary mt-2">Analysis typically takes 10-30 seconds</p>
              </div>
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
