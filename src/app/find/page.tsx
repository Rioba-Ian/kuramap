"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { RegistrationCenter } from "@/lib/data";
import { VoterCenterCard } from "@/components/VoterCenterCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
 Search,
 Map as MapIcon,
 List,
 Navigation,
 X,
 LocateFixed,
 Loader2,
} from "lucide-react";
import {
 Sheet,
 SheetContent,
 SheetHeader,
 SheetTitle,
 SheetDescription,
} from "@/components/ui/sheet";
import { ReviewSummary } from "@/components/ReviewSummary";
import { RouteGuide } from "@/components/RouteGuide";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ConstituencyCombobox } from "@/components/ConstituencyCombobox";
import {
 usePollingStations,
 getUniqueConstituencies,
 getUniqueWards,
} from "@/hooks/use-polling-stations-supabase";
import { useBoundaries } from "@/hooks/use-boundaries-supabase";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Dynamically import map component to avoid SSR issues with Leaflet
const InteractiveMap = dynamic(
 () => import("@/components/InteractiveMap").then((mod) => mod.InteractiveMap),
 {
  ssr: false,
  loading: () => (
   <div className="h-[600px] w-full bg-muted animate-pulse rounded-3xl flex items-center justify-center">
    <MapIcon className="h-12 w-12 text-primary/20" />
   </div>
  ),
 },
);

export default function FindCentersPage() {
 const { toast } = useToast();
 const [search, setSearch] = useState("");
 const [selectedCenter, setSelectedCenter] =
  useState<RegistrationCenter | null>(null);
 const [showRouteTool, setShowRouteTool] = useState(false);
 const [userLocation, setUserLocation] = useState<{
  lat: number;
  lng: number;
 } | null>(null);
 const [selectedConstituency, setSelectedConstituency] = useState<string>("all");
 const [selectedWard, setSelectedWard] = useState<string>("all");

 // Fetch boundaries for constituency/ward detection
 const {
  detectedConstituency,
  loading: loadingBoundaries,
  detectLocation,
 } = useBoundaries();

 // Determine effective constituency filter
 // If user hasn't manually selected a constituency, use detected one
 const effectiveConstituency =
  selectedConstituency !== "all"
   ? selectedConstituency
   : detectedConstituency?.name;

 // Fetch polling stations from Supabase + PostGIS
 const {
  stations: allStations,
  loading: loadingStations,
  error: stationsError,
 } = usePollingStations({
  userLocation,
  maxDistance: 50000, // 50km
  maxResults: 1000,
  constituency: effectiveConstituency,
  ward: selectedWard !== "all" ? selectedWard : undefined,
  searchQuery: search,
 });

 // Detect constituency when user location changes
 useEffect(() => {
  if (userLocation) {
   detectLocation(userLocation);
  }
 }, [userLocation, detectLocation]);

 // Show toast when constituency is detected
 useEffect(() => {
  if (detectedConstituency) {
   toast({
    title: "Location detected",
    description: `You are in ${detectedConstituency.name} constituency`,
   });
  }
 }, [detectedConstituency, toast]);

 // Get unique constituencies and wards for filter dropdowns
 const constituencies = useMemo(
  () => getUniqueConstituencies(allStations),
  [allStations],
 );
 const wards = useMemo(
  () => getUniqueWards(allStations, selectedConstituency),
  [allStations, selectedConstituency],
 );

 const handleLocateUser = () => {
  if ("geolocation" in navigator) {
   navigator.geolocation.getCurrentPosition(
    (position) => {
     const { latitude, longitude } = position.coords;
     setUserLocation({ lat: latitude, lng: longitude });
    },
    (error) => {
     console.error("Geolocation error:", error);
     toast({
      variant: "destructive",
      title: "Location access denied",
      description: "Please enable location services or search manually.",
     });
    },
   );
  } else {
   toast({
    variant: "destructive",
    title: "Not supported",
    description: "Your browser does not support geolocation.",
   });
  }
 };

 const handleClearFilters = () => {
  setSelectedConstituency("all");
  setSelectedWard("all");
  setSearch("");
 };

 // Check if we're auto-filtering by detected constituency
 const isAutoFiltered = selectedConstituency === "all" && detectedConstituency;

 // Auto-locate on mount
 useEffect(() => {
  handleLocateUser();
 }, []);

 const isLoading = loadingStations || loadingBoundaries;

 return (
  <div className="min-h-screen bg-background flex flex-col">
   <div className="bg-white border-b shadow-sm py-6">
    <div className="container mx-auto px-4">
     <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
       <div>
        <h1 className="text-2xl font-headline font-bold text-primary">
         Find a Registration Center
        </h1>
        <p className="text-sm text-muted-foreground">
         {isLoading ? (
          <span className="flex items-center gap-2">
           <Loader2 className="h-3 w-3 animate-spin" />
           Loading polling stations...
          </span>
         ) : (
          `Showing ${allStations.length} centers ${
           isAutoFiltered
            ? `in ${detectedConstituency.name}`
            : userLocation
              ? "near you"
              : "in Kenya"
          }`
         )}
        </p>
       </div>
       <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xl">
        <div className="relative flex-1">
         <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
         <Input
          placeholder="Search by name, constituency or ward..."
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
        <Button
         variant="outline"
         onClick={handleLocateUser}
         className="gap-2 shrink-0"
        >
         <LocateFixed className="h-4 w-4" /> Near Me
        </Button>
       </div>
      </div>

      {/* Detected Constituency Banner */}
      {detectedConstituency && (
       <Alert className="bg-primary/5 border-primary/20">
        <MapIcon className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between gap-4">
         <div>
          <span className="font-semibold">Your Constituency:</span>{" "}
          {detectedConstituency.name}
          {isAutoFiltered && (
           <span className="block text-xs text-muted-foreground mt-1">
            Showing centers in your constituency only
           </span>
          )}
         </div>
         {isAutoFiltered && (
          <Button
           variant="outline"
           size="sm"
           onClick={() => setSelectedConstituency("all")}
           className="shrink-0 text-xs h-7"
          >
           Show All Kenya
          </Button>
         )}
        </AlertDescription>
       </Alert>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
       <span className="text-sm text-muted-foreground">Filter by:</span>
       <ConstituencyCombobox
        value={selectedConstituency}
        onChange={setSelectedConstituency}
        constituencies={constituencies}
        placeholder="All Constituencies"
       />

       {selectedConstituency !== "all" && (
        <Select value={selectedWard} onValueChange={setSelectedWard}>
         <SelectTrigger className="w-[200px] h-9">
          <SelectValue placeholder="All Wards" />
         </SelectTrigger>
         <SelectContent>
          <SelectItem value="all">All Wards</SelectItem>
          {wards.map((ward) => (
           <SelectItem key={ward} value={ward}>
            {ward}
           </SelectItem>
          ))}
         </SelectContent>
        </Select>
       )}

       {(selectedConstituency !== "all" || selectedWard !== "all" || search) && (
        <Button
         variant="ghost"
         size="sm"
         onClick={handleClearFilters}
         className="gap-1 h-9"
        >
         <X className="h-3 w-3" /> Clear Filters
        </Button>
       )}

       {(selectedConstituency !== "all" || selectedWard !== "all") && (
        <div className="flex gap-1 ml-auto">
         {selectedConstituency !== "all" && (
          <Badge variant="secondary" className="gap-1">
           {selectedConstituency}
           <button onClick={() => setSelectedConstituency("all")}>
            <X className="h-3 w-3" />
           </button>
          </Badge>
         )}
         {selectedWard !== "all" && (
          <Badge variant="secondary" className="gap-1">
           {selectedWard}
           <button onClick={() => setSelectedWard("all")}>
            <X className="h-3 w-3" />
           </button>
          </Badge>
         )}
        </div>
       )}
      </div>

      {/* Error State */}
      {stationsError && (
       <Alert variant="destructive">
        <AlertDescription>
         Failed to load polling stations. Please try again later.
        </AlertDescription>
       </Alert>
      )}
     </div>
    </div>
   </div>

   <div className="container mx-auto px-4 py-8 flex-1">
    <Tabs defaultValue="list" className="w-full">
     <div className="flex justify-between items-center mb-6">
      <TabsList className="bg-white border">
       <TabsTrigger value="list" className="gap-2">
        <List className="h-4 w-4" /> List View
       </TabsTrigger>
       <TabsTrigger value="map" className="gap-2">
        <MapIcon className="h-4 w-4" /> Interactive Map
       </TabsTrigger>
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
       {allStations.map((center) => (
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
       {allStations.length === 0 && !isLoading && (
        <div className="col-span-full py-20 text-center">
         <p className="text-muted-foreground">
          No centers found matching your search. Try another location.
         </p>
        </div>
       )}
      </div>
     </TabsContent>

     <TabsContent value="map" className="mt-0">
      <div className="h-[600px] w-full relative">
       <InteractiveMap
        centers={allStations}
        onSelectCenter={setSelectedCenter}
        userLocation={userLocation}
       />
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
   <Sheet
    open={!!selectedCenter}
    onOpenChange={(open) => !open && setSelectedCenter(null)}
   >
    <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
     {selectedCenter && (
      <div className="space-y-8 py-6">
       <SheetHeader>
        <SheetTitle className="text-2xl font-headline text-primary">
         {selectedCenter.name}
        </SheetTitle>
        <SheetDescription className="flex items-center gap-2">
         <MapIcon className="h-4 w-4" /> {selectedCenter.address}
        </SheetDescription>
       </SheetHeader>

       <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted p-4 rounded-xl text-center">
         <p className="text-xs font-bold uppercase text-muted-foreground mb-1">
          Constituency
         </p>
         <p className="font-semibold">{selectedCenter.constituency}</p>
        </div>
        <div className="bg-muted p-4 rounded-xl text-center">
         <p className="text-xs font-bold uppercase text-muted-foreground mb-1">
          Operating Hours
         </p>
         <p className="font-semibold text-xs">
          {selectedCenter.operatingHours}
         </p>
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
    <SheetContent
     side="bottom"
     className="h-[80vh] sm:h-auto sm:max-w-2xl mx-auto rounded-t-3xl p-6"
    >
     <SheetHeader className="mb-6">
      <SheetTitle className="flex items-center gap-2 text-primary font-bold text-xl">
       <Navigation className="h-6 w-6" />
       AI Route Assistant
      </SheetTitle>
      <SheetDescription>
       We'll recommend the best registration center based on your current
       location and preferred transport.
      </SheetDescription>
     </SheetHeader>

     <RouteGuide centers={allStations} selectedCenter={selectedCenter} />
    </SheetContent>
   </Sheet>
  </div>
 );
}
