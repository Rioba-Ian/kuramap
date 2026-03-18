
"use client";

import { RegistrationCenter } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, MessageSquare, Navigation, MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistance } from "@/lib/geospatial";

interface VoterCenterCardProps {
  center: RegistrationCenter;
  onSelect?: (center: RegistrationCenter) => void;
  onShowRoute?: (center: RegistrationCenter) => void;
}

export function VoterCenterCard({ center, onSelect, onShowRoute }: VoterCenterCardProps) {
  // Check if distance is available (added by sortByDistance helper)
  const distance = (center as any).distance;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md border-l-4 border-l-primary">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg font-headline font-semibold text-primary">
            {center.name}
          </CardTitle>
          <div className="flex flex-col gap-1 items-end">
            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
              {center.constituency}
            </Badge>
            {distance !== undefined && (
              <Badge variant="outline" className="text-[10px] gap-1">
                <MapPinned className="h-3 w-3" />
                {formatDistance(distance)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mt-1 shrink-0 text-accent" />
          <span>{center.address}, {center.ward} Ward</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 shrink-0 text-accent" />
          <span>{center.operatingHours}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageSquare className="h-4 w-4 shrink-0 text-accent" />
          <span>{center.reviews.length} Community Reviews</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => onSelect?.(center)}
        >
          Details & Reviews
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          className="flex-1 gap-2"
          onClick={() => onShowRoute?.(center)}
        >
          <Navigation className="h-3 w-3" />
          Get Route
        </Button>
      </CardFooter>
    </Card>
  );
}
