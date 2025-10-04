import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, MapPin, ShieldCheck, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center">
                <Droplet className="w-12 h-12 text-secondary-foreground" />
              </div>
            </div>
            <h1 className="text-5xl font-bold">LeakWatch</h1>
            <p className="text-xl text-primary-foreground/90">
              Empowering communities to report and track water leaks in real-time
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={() => navigate("/report")}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                Report a Leak
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/municipality-login")}
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Municipality Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle>1. Report</CardTitle>
              <CardDescription>
                Citizens spot a leak and quickly report it with GPS location and photo evidence
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle>2. Track</CardTitle>
              <CardDescription>
                Municipalities receive instant notifications and view all reports on an interactive map
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle>3. Fix</CardTitle>
              <CardDescription>
                Repair crews respond efficiently and mark leaks as fixed when resolved
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1.2M</div>
              <div className="text-muted-foreground">Gallons Saved Daily</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Leaks Reported</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Resolution Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto border-2 border-secondary">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">See a Leak? Report It Now</CardTitle>
            <CardDescription className="text-lg">
              Every report helps conserve water and protect our community's resources
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button size="lg" onClick={() => navigate("/report")} className="bg-secondary hover:bg-secondary/90">
              Report a Water Leak
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 LeakWatch. Protecting water resources, one report at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
