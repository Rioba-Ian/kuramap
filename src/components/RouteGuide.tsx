
"use client";

import { useState, useEffect } from "react";
import { optimalRegistrationCenterRecommendation } from "@/ai/flows/optimal-registration-center-recommendation";
import { RegistrationCenter } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Navigation, MapPin, Sparkles, LocateFixed, Copy, Car, ArrowRight, Map } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface RouteGuideProps {
  centers: RegistrationCenter[];
  defaultLocation?: string;
  selectedCenter?: RegistrationCenter | null;
}

export function RouteGuide({ centers, defaultLocation = "", selectedCenter = null }: RouteGuideProps) {
  const { toast } = useToast();
  const [location, setLocation] = useState(defaultLocation);
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [transport, setTransport] = useState<any>("walking");
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);

  const handleDetectLocation = () => {
    if ("geolocation" in navigator) {
      setDetectingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoordinates({ lat: latitude, lng: longitude });
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          setDetectingLocation(false);
          toast({
            title: "Location detected",
            description: "Using your current location",
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setDetectingLocation(false);
          toast({
            variant: "destructive",
            title: "Location access denied",
            description: "Please enter your location manually or enable location services.",
          });
        }
      );
    } else {
      toast({
        variant: "destructive",
        title: "Not supported",
        description: "Your browser does not support geolocation.",
      });
    }
  };

  const getRecommendation = async () => {
    setLoading(true);
    try {
      // Use coordinates if available, otherwise use text location
      const locationString = userCoordinates
        ? `${userCoordinates.lat}, ${userCoordinates.lng}`
        : location;

      const result = await optimalRegistrationCenterRecommendation({
        userLocation: locationString,
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
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get recommendation. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-detect location on mount
  useEffect(() => {
    if (!defaultLocation) {
      handleDetectLocation();
    }
  }, []);

  // Navigation helper functions
  const copyCoordinates = async (center: RegistrationCenter) => {
    const coords = `${center.coordinates.lat}, ${center.coordinates.lng}`;
    try {
      await navigator.clipboard.writeText(coords);
      toast({
        title: "Copied!",
        description: `Coordinates: ${coords}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Please copy manually from the card.",
      });
    }
  };

  const openGoogleMaps = (center: RegistrationCenter) => {
    const origin = userCoordinates
      ? `${userCoordinates.lat},${userCoordinates.lng}`
      : location || "My Location";
    const destination = `${center.coordinates.lat},${center.coordinates.lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${destination}&travelmode=${transport === "driving" ? "driving" : transport === "public_transport" ? "transit" : "walking"}`;
    window.open(url, "_blank");
  };

  const openAppleMaps = (center: RegistrationCenter) => {
    const origin = userCoordinates
      ? `${userCoordinates.lat},${userCoordinates.lng}`
      : "";
    const destination = `${center.coordinates.lat},${center.coordinates.lng}`;
    const url = origin
      ? `http://maps.apple.com/?saddr=${origin}&daddr=${destination}`
      : `http://maps.apple.com/?daddr=${destination}`;
    window.open(url, "_blank");
  };

  const openUber = (center: RegistrationCenter) => {
    const url = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${center.coordinates.lat}&dropoff[longitude]=${center.coordinates.lng}`;
    window.open(url, "_blank");
  };

  const openBolt = (center: RegistrationCenter) => {
    // Bolt web link (mobile app deep link works on mobile)
    const url = userCoordinates
      ? `https://bolt.eu/en/ride/?pickup_latitude=${userCoordinates.lat}&pickup_longitude=${userCoordinates.lng}&destination_latitude=${center.coordinates.lat}&destination_longitude=${center.coordinates.lng}`
      : `https://bolt.eu/en/ride/?destination_latitude=${center.coordinates.lat}&destination_longitude=${center.coordinates.lng}`;
    window.open(url, "_blank");
  };

  // Get the center to show navigation for (recommended or selected)
  const targetCenter = recommendation?.recommendedCenterName
    ? centers.find((c) => c.name === recommendation.recommendedCenterName)
    : selectedCenter;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Location</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="e.g. Westlands Mall or coordinates"
                className="pl-9"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setUserCoordinates(null); // Clear coordinates when manually editing
                }}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleDetectLocation}
              disabled={detectingLocation}
              title="Use my current location"
            >
              {detectingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LocateFixed className="h-4 w-4" />
              )}
            </Button>
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

      {targetCenter && (
        <>
          <Separator className="my-4" />
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">Navigation Options</h3>

            {/* Google Maps & Apple Maps */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="w-full gap-2 justify-start"
                onClick={() => openGoogleMaps(targetCenter)}
              >
                <Map className="h-4 w-4 text-blue-600" />
                <span className="text-xs">Google Maps</span>
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2 justify-start"
                onClick={() => openAppleMaps(targetCenter)}
              >
                <Map className="h-4 w-4" />
                <span className="text-xs">Apple Maps</span>
              </Button>
            </div>

            {/* Uber & Bolt */}
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full gap-2 justify-between bg-black text-white hover:bg-black/90 hover:text-white"
                onClick={() => openUber(targetCenter)}
              >
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span className="text-sm font-medium">Book with Uber</span>
                </div>
                <span className="text-xs opacity-70">Open app</span>
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2 justify-between bg-[#34D186] text-white hover:bg-[#2BC278] hover:text-white border-[#34D186]"
                onClick={() => openBolt(targetCenter)}
              >
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span className="text-sm font-medium">Book with Bolt</span>
                </div>
                <span className="text-xs opacity-70">Open app</span>
              </Button>
            </div>

            {/* Copy Coordinates */}
            <Button
              variant="outline"
              className="w-full gap-2 justify-start"
              onClick={() => copyCoordinates(targetCenter)}
            >
              <Copy className="h-4 w-4" />
              <span className="text-sm">Copy Coordinates</span>
            </Button>

            {/* Center Details */}
            <div className="bg-muted p-3 rounded-md text-xs space-y-1">
              <p className="font-semibold">{targetCenter.name}</p>
              <p className="text-muted-foreground">{targetCenter.address}</p>
              <p className="text-muted-foreground">
                📍 {targetCenter.coordinates.lat.toFixed(6)}, {targetCenter.coordinates.lng.toFixed(6)}
              </p>
              {targetCenter.distance && (
                <p className="text-primary font-medium">
                  📏 {targetCenter.distance.toFixed(2)} km away
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
