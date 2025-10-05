import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, MapPin, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ReportLeak = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    reporterName: "",
    reporterEmail: "",
    reporterContactNo: "",
    latitude: "",
    longitude: "",
    locationDescription: "",
    severity: "",
    description: "",
  });

  type Municipality = {
    name: string;
    phone: string;
    emails: { [key: string]: string };
  };

  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [selected, setSelected] = useState<Municipality | null>(null);
  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load municipalities from public folder
  useEffect(() => {
    fetch("/rustenburg_municipalities.json")
      .then((res) => res.json())
      .then((data) => setMunicipalities(data.municipalities));
  }, []);

  // Auto-capture GPS on mount
  useEffect(() => {
    captureLocation();
  }, []);

  const captureLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          }));
          setGettingLocation(false);
          toast({
            title: "Location captured",
            description: "Your GPS coordinates have been recorded.",
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setGettingLocation(false);
          toast({
            title: "Location unavailable",
            description: "Please enter your location manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      setGettingLocation(false);
      toast({
        title: "GPS not supported",
        description: "Please enter your location manually.",
        variant: "destructive",
      });
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setShowCamera(true);
      }
    } catch (error) {
      console.error("Camera error:", error);
      toast({
        title: "Camera unavailable",
        description: "Please upload a photo instead.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg");
        setImage(imageData);
        stopCamera();
        toast({
          title: "Photo captured",
          description: "Your leak photo has been saved.",
        });
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        toast({
          title: "Photo uploaded",
          description: "Your leak photo has been saved.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.reporterName ||
      !formData.reporterEmail ||
      !formData.reporterContactNo ||
      !formData.latitude ||
      !formData.longitude ||
      !formData.locationDescription ||
      !formData.severity ||
      !formData.description
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!image && !fileInputRef.current?.files?.[0]) {
      toast({
        title: "Photo required",
        description: "Please take or upload a photo of the leak.",
        variant: "destructive",
      });
      return;
    }

    try {
      const formToSend = new FormData();

      // Append text fields
      Object.entries(formData).forEach(([key, value]) => {
        formToSend.append(key, value);
      });

      // Append municipality info
      if (selected) {
        formToSend.append("name", selected.name);
        formToSend.append("emails", JSON.stringify(selected.emails));
        formToSend.append("number", selected.phone);
      }

      // Append image
      if (fileInputRef.current?.files?.[0]) {
        formToSend.append("image", fileInputRef.current.files[0]);
      } else if (image) {
        const res = await fetch(image);
        const blob = await res.blob();
        formToSend.append("image", blob, `leak-${Date.now()}.jpg`);
      }

      const response = await fetch("http://localhost:2025/api/submit", {
        method: "POST",
        body: formToSend,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      toast({
        title: "Report submitted!",
        description: "Thank you for helping protect our water resources.",
      });

    } catch (error) {
      console.error(error);
      toast({
        title: "Submission failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          ← Back to Home
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Report a Water Leak</CardTitle>
            <CardDescription>
              Help us identify and fix water leaks in your community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Reporter Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reporterName">Your Name *</Label>
                  <Input
                    id="reporterName"
                    value={formData.reporterName}
                    onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="reporterEmail">Email *</Label>
                  <Input
                    id="reporterEmail"
                    value={formData.reporterEmail}
                    onChange={(e) => setFormData({ ...formData, reporterEmail: e.target.value })}
                    placeholder="johndoe@example.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="reporterContactNo">Phone *</Label>
                  <Input
                    id="reporterContactNo"
                    value={formData.reporterContactNo}
                    onChange={(e) => setFormData({ ...formData, reporterContactNo: e.target.value })}
                    placeholder="072 4241 5577"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    GPS Coordinates
                  </Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      placeholder="Latitude"
                      readOnly={gettingLocation}
                    />
                    <Input
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      placeholder="Longitude"
                      readOnly={gettingLocation}
                    />
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={captureLocation} disabled={gettingLocation} className="mt-2 w-full">
                    {gettingLocation ? "Getting location..." : "Refresh GPS"}
                  </Button>
                </div>

                <div>
                  <Label htmlFor="locationDescription">Location Description</Label>
                  <Textarea
                    value={formData.locationDescription}
                    onChange={(e) => setFormData({ ...formData, locationDescription: e.target.value })}
                    placeholder="e.g., Corner of Main St and Oak Ave, near the fire hydrant"
                    rows={3}
                  />
                </div>
              </div>

              {/* Severity */}
              <div>
                <Label htmlFor="severity">Severity *</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value) => setFormData({ ...formData, severity: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High - Major leak</SelectItem>
                    <SelectItem value="Medium">Medium - Moderate leak</SelectItem>
                    <SelectItem value="Low">Low - Minor leak</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the leak (size, flow rate, duration, etc.)"
                  rows={4}
                  required
                />
              </div>

              {/* Municipality */}
              <div className="space-y-2">
                <Label>Municipality *</Label>
                <select
                  onChange={(e) => {
                    const sel = municipalities.find((m) => m.name === e.target.value);
                    setSelected(sel || null);
                  }}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">-- Select --</option>
                  {municipalities.map((m) => (
                    <option key={m.name} value={m.name}>{m.name}</option>
                  ))}
                </select>
                {selected && (
                  <div className="mt-2 p-2 border rounded">
                    <h3 className="font-semibold">{selected.name}</h3>
                    <p>{selected.phone}</p>
                    <ul>
                      {Object.entries(selected.emails).map(([key, value]) => (
                        <li key={key}><a href={`mailto:${value}`}>{value}</a></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Photo Evidence */}
              <div className="space-y-4">
                <Label>Photo Evidence *</Label>
                {!image && !showCamera && (
                  <div className="grid grid-cols-2 gap-4">
                    <Button type="button" variant="outline" onClick={startCamera} className="h-32 flex-col gap-2">
                      <Camera className="w-8 h-8" /> Take Photo
                    </Button>
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="h-32 flex-col gap-2">
                      <Upload className="w-8 h-8" /> Upload Photo
                    </Button>
                  </div>
                )}

                {showCamera && (
                  <div className="space-y-2">
                    <video ref={videoRef} autoPlay playsInline className="w-full rounded border" />
                    <div className="flex gap-2">
                      <Button type="button" onClick={capturePhoto} className="flex-1">Capture Photo</Button>
                      <Button type="button" variant="outline" onClick={stopCamera}>Cancel</Button>
                    </div>
                  </div>
                )}

                {image && (
                  <div className="relative">
                    <img src={image} alt="Leak evidence" className="w-full rounded border" />
                    <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => setImage(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileUpload} className="hidden" />
                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" size="lg">Submit Report</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportLeak;
