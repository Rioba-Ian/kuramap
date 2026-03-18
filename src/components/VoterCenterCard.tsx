
"use client";

import { RegistrationCenter } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, MessageSquare, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoterCenterCardProps {
  center: RegistrationCenter;
  onSelect?: (center: RegistrationCenter) => void;
  onShowRoute?: (center: RegistrationCenter) => void;
}

export function VoterCenterCard({ center, onSelect, onShowRoute }: VoterCenterCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md border-l-4 border-l-primary">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-headline font-semibold text-primary">
            {center.name}
          </CardTitle>
          <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
            {center.constituency}
          </Badge>
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
