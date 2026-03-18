
"use client";

import { useState, useMemo } from "react";
import { REGISTRATION_CENTERS, RegistrationCenter } from "@/lib/data";
import { VoterCenterCard } from "@/components/VoterCenterCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Map as MapIcon, List, Navigation, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ReviewSummary } from "@/components/ReviewSummary";
import { RouteGuide } from "@/components/RouteGuide";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FindCentersPage() {
  const [search, setSearch] = useState("");
  const [selectedCenter, setSelectedCenter] = useState<RegistrationCenter | null>(null);
  const [showRouteTool, setShowRouteTool] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const filteredCenters = useMemo(() => {
    return REGISTRATION_CENTERS.filter(center => 
      center.name.toLowerCase().includes(search.toLowerCase()) ||
      center.constituency.toLowerCase().includes(search.toLowerCase()) ||
      center.ward.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-white border-b shadow-sm py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-headline font-bold text-primary">Find a Registration Center</h1>
              <p className="text-sm text-muted-foreground">Showing {filteredCenters.length} centers near you</p>
            </div>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search constituency or ward..." 
                className="pl-9 bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button 
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex-1">
        <Tabs defaultValue="list" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="bg-white border">
              <TabsTrigger value="list" className="gap-2"><List className="h-4 w-4" /> List</TabsTrigger>
              <TabsTrigger value="map" className="gap-2"><MapIcon className="h-4 w-4" /> Map</TabsTrigger>
            </TabsList>
            <Button 
              variant="secondary" 
              className="gap-2 hidden sm:flex"
              onClick={() => setShowRouteTool(true)}
            >
              <Navigation className="h-4 w-4" /> AI Route Assistant
            </Button>
          </div>

          <TabsContent value="list" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCenters.map((center) => (
                <VoterCenterCard 
                  key={center.id} 
                  center={center} 
                  onSelect={setSelectedCenter}
                  onShowRoute={() => {
                    setSelectedCenter(center);
                    setShowRouteTool(true);
                  }}
                />
              ))}
              {filteredCenters.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <p className="text-muted-foreground">No centers found matching your search. Try another location.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="map" className="mt-0">
            <div className="h-[600px] w-full bg-muted rounded-3xl border-2 border-white shadow-inner flex items-center justify-center relative overflow-hidden">
              {/* Mock Map Background */}
              <div className="absolute inset-0 opacity-40">
                <div className="grid grid-cols-12 h-full">
                  {Array.from({length: 144}).map((_, i) => (
                    <div key={i} className="border border-primary/5"></div>
                  ))}
                </div>
              </div>
              <div className="relative z-10 text-center px-4">
                <MapIcon className="h-12 w-12 text-primary/20 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">Interactive Map Implementation</p>
                <p className="text-xs text-muted-foreground/60 max-w-xs mx-auto mt-2">
                  Visualize {filteredCenters.length} pins for your search results. In a full production environment, this integrates with Google Maps or Mapbox.
                </p>
              </div>
              
              {/* Fake pins */}
              {filteredCenters.map((center, i) => (
                <button
                  key={center.id}
                  className="absolute p-2 bg-primary text-white rounded-full shadow-lg transform hover:scale-125 transition-transform"
                  style={{
                    top: `${20 + (i * 15) % 60}%`,
                    left: `${20 + (i * 17) % 60}%`
                  }}
                  onClick={() => setSelectedCenter(center)}
                >
                  <MapPin size={20} />
                </button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button for Route Assistant on mobile */}
      <Button 
        size="lg"
        className="fixed bottom-6 right-6 sm:hidden rounded-full shadow-2xl bg-secondary h-14 w-14 p-0 flex items-center justify-center"
        onClick={() => setShowRouteTool(true)}
      >
        <Navigation className="h-6 w-6" />
      </Button>

      {/* Center Details Sheet */}
      <Sheet open={!!selectedCenter} onOpenChange={(open) => !open && setSelectedCenter(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          {selectedCenter && (
            <div className="space-y-8 py-6">
              <SheetHeader>
                <SheetTitle className="text-2xl font-headline text-primary">{selectedCenter.name}</SheetTitle>
                <SheetDescription className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> {selectedCenter.address}
                </SheetDescription>
              </SheetHeader>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-xl text-center">
                  <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Constituency</p>
                  <p className="font-semibold">{selectedCenter.constituency}</p>
                </div>
                <div className="bg-muted p-4 rounded-xl text-center">
                  <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Operating Hours</p>
                  <p className="font-semibold text-xs">{selectedCenter.operatingHours}</p>
                </div>
              </div>

              <ReviewSummary reviews={selectedCenter.reviews} />

              <div className="pt-6 border-t">
                <Button className="w-full gap-2" onClick={() => setShowRouteTool(true)}>
                  <Navigation className="h-4 w-4" /> Find Best Way There
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Route Assistant Dialog */}
      <Sheet open={showRouteTool} onOpenChange={setShowRouteTool}>
        <SheetContent side="bottom" className="h-[80vh] sm:h-auto sm:max-w-2xl mx-auto rounded-t-3xl p-6">
          <SheetHeader className="mb-6">
            <SheetTitle className="flex items-center gap-2 text-primary font-bold text-xl">
              <Navigation className="h-6 w-6" />
              AI Route Assistant
            </SheetTitle>
            <SheetDescription>
              We'll recommend the best registration center based on your current location and preferred transport.
            </SheetDescription>
          </SheetHeader>
          
          <RouteGuide centers={REGISTRATION_CENTERS} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

function MapPin({size}: {size: number}) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
