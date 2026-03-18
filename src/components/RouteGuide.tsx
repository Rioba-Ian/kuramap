
"use client";

import { useState } from "react";
import { optimalRegistrationCenterRecommendation } from "@/ai/flows/optimal-registration-center-recommendation";
import { RegistrationCenter } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Navigation, MapPin, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface RouteGuideProps {
  centers: RegistrationCenter[];
  defaultLocation?: string;
}

export function RouteGuide({ centers, defaultLocation = "Nairobi CBD" }: RouteGuideProps) {
  const [location, setLocation] = useState(defaultLocation);
  const [transport, setTransport] = useState<any>("walking");
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);

  const getRecommendation = async () => {
    setLoading(true);
    try {
      const result = await optimalRegistrationCenterRecommendation({
        userLocation: location,
        preferredTransport: transport,
        registrationCenters: centers.map(c => ({
          name: c.name,
          address: c.address,
          coordinates: `${c.coordinates.lat}, ${c.coordinates.lng}`
        }))
      });
      setRecommendation(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="e.g. Westlands Mall" 
              className="pl-9"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Preferred Transport</label>
          <Select value={transport} onValueChange={setTransport}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="walking">Walking</SelectItem>
              <SelectItem value="public_transport">Public Transport (Matatu/Bus)</SelectItem>
              <SelectItem value="driving">Driving</SelectItem>
              <SelectItem value="cycling">Cycling</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        onClick={getRecommendation} 
        disabled={loading || !location} 
        className="w-full gap-2 bg-primary text-white"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        Find Optimal Center
      </Button>

      {recommendation && (
        <Alert className="bg-white border-2 border-primary/20 shadow-sm animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary font-bold">Recommended: {recommendation.recommendedCenterName}</AlertTitle>
          <AlertDescription className="mt-2 space-y-3">
            <p className="text-sm italic">{recommendation.reasoning}</p>
            <div className="bg-muted p-3 rounded-md text-xs">
              <div className="font-bold flex items-center gap-1 mb-1">
                <Navigation className="h-3 w-3" />
                Route Info
              </div>
              <p className="font-medium text-primary mb-1">Estimated Time: {recommendation.estimatedTravelTime}</p>
              <p>{recommendation.routeDescription}</p>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
