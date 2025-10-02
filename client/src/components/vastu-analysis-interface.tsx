import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Home, Upload, Plus, Trash2, Loader2, X } from "lucide-react";
import { VastuAnalysisResult, VastuInput } from "@shared/schema";
import { CosmicLoader } from "@/components/cosmic-loader";

interface VastuAnalysisInterfaceProps {
  onAnalysisComplete: (result: VastuAnalysisResult, inputData: VastuInput, analysisId: string, imageUrl?: string) => void;
}

export function VastuAnalysisInterface({ onAnalysisComplete }: VastuAnalysisInterfaceProps) {
  const [layoutType, setLayoutType] = useState("");
  const [entrance, setEntrance] = useState("");
  const [buildingShape, setBuildingShape] = useState("");
  const [surroundings, setSurroundings] = useState("");
  const [rooms, setRooms] = useState([{ name: "", direction: "", size: "" }]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();

  const analysisMutation = useMutation({
    mutationFn: async ({ vastuData, imageFile }: { vastuData: VastuInput; imageFile?: File }) => {
      const formData = new FormData();
      formData.append('vastuData', JSON.stringify(vastuData));
      if (imageFile) {
        formData.append('layoutImage', imageFile);
      }
      
      const response = await apiRequest("POST", "/api/vastu/analyze", formData);
      return response.json();
    },
    onSuccess: (data) => {
      onAnalysisComplete(data.result, data.inputData, data.id, data.imageUrl);
      toast({
        title: "Analysis Complete!",
        description: "Your Vastu analysis is ready.",
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

  const addRoom = () => {
    setRooms([...rooms, { name: "", direction: "", size: "" }]);
  };

  const removeRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const updateRoom = (index: number, field: string, value: string) => {
    const updatedRooms = rooms.map((room, i) => 
      i === index ? { ...room, [field]: value } : room
    );
    setRooms(updatedRooms);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const resetUpload = () => {
    setUploadedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAnalyze = () => {
    if (!layoutType || !entrance || !buildingShape) {
      toast({
        title: "Missing Information",
        description: "Please fill in the basic layout information.",
        variant: "destructive",
      });
      return;
    }

    const validRooms = rooms.filter(room => room.name && room.direction);
    if (validRooms.length === 0) {
      toast({
        title: "No Rooms Added",
        description: "Please add at least one room with direction.",
        variant: "destructive",
      });
      return;
    }

    const vastuData: VastuInput = {
      layoutType,
      entrance,
      buildingShape,
      surroundings,
      rooms: validRooms,
    };

    analysisMutation.mutate({ vastuData, imageFile: uploadedImage || undefined });
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Vastu Analysis</h3>
            <p className="text-lg text-gray-300">
              Get comprehensive Vastu guidance for your home or office layout
            </p>
          </div>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-card/95 backdrop-blur rounded-2xl">
            {/* Gradient top border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400" />
            <CardContent className="p-8 pt-9">
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="layoutType" className="text-card-foreground font-medium">
                      Layout Type
                    </Label>
                    <Select value={layoutType} onValueChange={setLayoutType}>
                      <SelectTrigger data-testid="select-layout-type">
                        <SelectValue placeholder="Select layout type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                        <SelectItem value="shop">Shop/Store</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="entrance" className="text-card-foreground font-medium">
                      Main Entrance Direction
                    </Label>
                    <Select value={entrance} onValueChange={setEntrance}>
                      <SelectTrigger data-testid="select-entrance">
                        <SelectValue placeholder="Select entrance direction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="north">North</SelectItem>
                        <SelectItem value="northeast">Northeast</SelectItem>
                        <SelectItem value="east">East</SelectItem>
                        <SelectItem value="southeast">Southeast</SelectItem>
                        <SelectItem value="south">South</SelectItem>
                        <SelectItem value="southwest">Southwest</SelectItem>
                        <SelectItem value="west">West</SelectItem>
                        <SelectItem value="northwest">Northwest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="buildingShape" className="text-card-foreground font-medium">
                      Building Shape
                    </Label>
                    <Select value={buildingShape} onValueChange={setBuildingShape}>
                      <SelectTrigger data-testid="select-building-shape">
                        <SelectValue placeholder="Select building shape" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="square">Square</SelectItem>
                        <SelectItem value="rectangle">Rectangle</SelectItem>
                        <SelectItem value="l-shaped">L-Shaped</SelectItem>
                        <SelectItem value="t-shaped">T-Shaped</SelectItem>
                        <SelectItem value="irregular">Irregular</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="surroundings" className="text-card-foreground font-medium">
                      Surroundings
                    </Label>
                    <Textarea
                      id="surroundings"
                      placeholder="Describe nearby roads, water bodies, mountains, other buildings..."
                      value={surroundings}
                      onChange={(e) => setSurroundings(e.target.value)}
                      className="min-h-[80px]"
                      data-testid="textarea-surroundings"
                    />
                  </div>
                </div>

                {/* Rooms Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-card-foreground font-medium text-lg">Rooms Layout</Label>
                    <Button 
                      onClick={addRoom} 
                      variant="outline" 
                      size="sm"
                      data-testid="button-add-room"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Room
                    </Button>
                  </div>

                  {rooms.map((room, index) => (
                    <Card key={index} className="bg-violet-50/50 border-violet-200">
                      <CardContent className="p-4">
                        <div className="grid md:grid-cols-4 gap-4 items-end">
                          <div className="space-y-2">
                            <Label>Room Name</Label>
                            <Input
                              placeholder="e.g., Living Room"
                              value={room.name}
                              onChange={(e) => updateRoom(index, "name", e.target.value)}
                              data-testid={`input-room-name-${index}`}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Direction</Label>
                            <Select 
                              value={room.direction} 
                              onValueChange={(value) => updateRoom(index, "direction", value)}
                            >
                              <SelectTrigger data-testid={`select-room-direction-${index}`}>
                                <SelectValue placeholder="Direction" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="north">North</SelectItem>
                                <SelectItem value="northeast">Northeast</SelectItem>
                                <SelectItem value="east">East</SelectItem>
                                <SelectItem value="southeast">Southeast</SelectItem>
                                <SelectItem value="south">South</SelectItem>
                                <SelectItem value="southwest">Southwest</SelectItem>
                                <SelectItem value="west">West</SelectItem>
                                <SelectItem value="northwest">Northwest</SelectItem>
                                <SelectItem value="center">Center</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Size</Label>
                            <Select 
                              value={room.size} 
                              onValueChange={(value) => updateRoom(index, "size", value)}
                            >
                              <SelectTrigger data-testid={`select-room-size-${index}`}>
                                <SelectValue placeholder="Size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small">Small</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="large">Large</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRoom(index)}
                            disabled={rooms.length === 1}
                            data-testid={`button-remove-room-${index}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Layout Image Upload */}
                <div className="space-y-4">
                  <Label className="text-card-foreground font-medium text-lg">
                    Layout Image (Optional)
                  </Label>
                  
                  {imagePreview ? (
                    <div className="text-center space-y-4">
                      <div className="relative inline-block">
                        <img 
                          src={imagePreview} 
                          alt="Layout preview" 
                          className="max-w-xs mx-auto rounded-lg shadow-md"
                          data-testid="img-layout-preview"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={resetUpload}
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                          data-testid="button-remove-layout-image"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">Layout image uploaded successfully</p>
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed border-violet-300 rounded-lg p-8 text-center hover:border-violet-400 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                      data-testid="layout-drop-zone"
                    >
                      <Upload className="h-12 w-12 text-violet-400 mx-auto mb-4" />
                      <p className="text-lg text-card-foreground font-medium mb-2">Upload Layout Plan</p>
                      <p className="text-muted-foreground mb-4">Floor plan, sketch, or photo of your layout</p>
                      <Button className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600" data-testid="button-browse-layout-files">
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
                    data-testid="input-layout-file-upload"
                  />
                </div>

                <div className="text-center mt-8">
                  <Button
                    onClick={handleAnalyze}
                    disabled={analysisMutation.isPending || !layoutType || !entrance || !buildingShape}
                    size="lg"
                    className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white px-8 py-4 text-lg shadow-lg"
                    data-testid="button-analyze-vastu"
                  >
                    {analysisMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing Vastu...
                      </>
                    ) : (
                      <>
                        <Home className="mr-2 h-5 w-5" />
                        Analyze Vastu
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">Analysis typically takes 20-60 seconds</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CosmicLoader 
        analysisType="vastu"
        isVisible={analysisMutation.isPending}
      />
    </div>
  );
}