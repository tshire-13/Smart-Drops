import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Leak } from "@/types/leak";

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface LeakMapProps {
  leaks: Leak[];
  onMarkFixed: (id: string) => void;
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "High":
      return "bg-severity-high";
    case "Medium":
      return "bg-severity-medium";
    case "Low":
      return "bg-severity-low";
    default:
      return "bg-muted";
  }
};

const LeakMap = ({ leaks, onMarkFixed }: LeakMapProps) => {
  const center: [number, number] = leaks.length > 0 
    ? [leaks[0].latitude, leaks[0].longitude]
    : [40.7128, -74.0060]; // Default to NYC

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {leaks.map((leak) => (
          <Marker
            key={leak.id}
            position={[leak.latitude, leak.longitude]}
          >
            <Popup maxWidth={300}>
              <div className="space-y-3 p-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-base">{leak.locationDescription}</h3>
                  <Badge className={getSeverityColor(leak.severity)}>
                    {leak.severity}
                  </Badge>
                </div>
                
                {leak.imageUrl && (
                  <img
                    src={leak.imageUrl}
                    alt="Leak"
                    className="w-full h-40 object-cover rounded"
                  />
                )}
                
                <div className="space-y-1 text-sm">
                  <p><strong>Description:</strong> {leak.description}</p>
                  <p><strong>Reporter:</strong> {leak.reporterName}</p>
                  <p><strong>Contact:</strong> {leak.reporterContact}</p>
                  <p><strong>Reported:</strong> {new Date(leak.timestamp).toLocaleString()}</p>
                </div>

                <Button
                  size="sm"
                  onClick={() => onMarkFixed(leak.id)}
                  className="w-full"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark as Fixed
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LeakMap;
