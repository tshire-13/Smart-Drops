import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Droplet, LogOut, Map as MapIcon, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LeakMap from "@/components/LeakMap";
import LeakTable from "@/components/LeakTable";
import { Leak } from "@/types/leak";

// Mock data
const mockLeaks: Leak[] = [
  {
    id: "1",
    reporterName: "John Doe",
    reporterContact: "john@example.com",
    latitude: 40.7128,
    longitude: -74.0060,
    locationDescription: "Corner of Main St and Oak Ave",
    severity: "High",
    description: "Large water main break, significant flow",
    imageUrl: "https://smart--drop.s3.eu-north-1.amazonaws.com/1759591555951-download.png",
    timestamp: "2025-01-15T10:30:00Z",
    status: "Active",
  },
  {
    id: "2",
    reporterName: "Jane Smith",
    reporterContact: "555-0123",
    latitude: 40.7580,
    longitude: -73.9855,
    locationDescription: "Central Park entrance",
    severity: "Medium",
    description: "Fire hydrant leaking moderately",
    imageUrl: "https://th.bing.com/th/id/OIP.k1jY-S3nHd4C12t2ulRo0AHaEK?w=287&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3",
    timestamp: "2025-01-15T14:15:00Z",
    status: "Active",
  },
  {
    id: "3",
    reporterName: "Mike Johnson",
    reporterContact: "mike@example.com",
    latitude: 40.7489,
    longitude: -73.9680,
    locationDescription: "Near subway station",
    severity: "Low",
    description: "Small drip from pipe joint",
    imageUrl: "https://th.bing.com/th/id/OIP.1Z4rAu6WWTGLaT2bBgYl-AHaE7?w=257&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3",
    timestamp: "2025-01-15T16:45:00Z",
    status: "Active",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [leaks, setLeaks] = useState(mockLeaks);

  const handleLogout = () => {
    navigate("/municipality-login");
  };

  const handleMarkFixed = (id: string) => {
    setLeaks((prev) => prev.filter((leak) => leak.id !== id));
  };

  const stats = {
    total: leaks.length,
    high: leaks.filter((l) => l.severity === "High").length,
    medium: leaks.filter((l) => l.severity === "Medium").length,
    low: leaks.filter((l) => l.severity === "Low").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Droplet className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">LeakWatch</h1>
              <p className="text-sm text-muted-foreground">Municipality Dashboard</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Active Leaks</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>High Severity</CardDescription>
              <CardTitle className="text-3xl text-severity-high">{stats.high}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Medium Severity</CardDescription>
              <CardTitle className="text-3xl text-severity-medium">{stats.medium}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Low Severity</CardDescription>
              <CardTitle className="text-3xl text-severity-low">{stats.low}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Leak Reports</CardTitle>
            <CardDescription>
              View and manage all active water leak reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="map" className="space-y-4">
              <TabsList>
                <TabsTrigger value="map">
                  <MapIcon className="w-4 h-4 mr-2" />
                  Map View
                </TabsTrigger>
                <TabsTrigger value="table">
                  <List className="w-4 h-4 mr-2" />
                  Table View
                </TabsTrigger>
              </TabsList>

              <TabsContent value="map" className="space-y-4">
                <LeakMap leaks={leaks} onMarkFixed={handleMarkFixed} />
              </TabsContent>

              <TabsContent value="table" className="space-y-4">
                <LeakTable leaks={leaks} onMarkFixed={handleMarkFixed} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
