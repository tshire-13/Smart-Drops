export interface Leak {
  id: string;
  reporterName: string;
  reporterContact: string;
  latitude: number;
  longitude: number;
  locationDescription: string;
  severity: "High" | "Medium" | "Low";
  description: string;
  imageUrl: string;
  timestamp: string;
  status: string;
}
