
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin, Info, ArrowRight, Vote, Navigation, AlertCircle } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-voter');

  return (
    <div className="flex flex-col">
      {/* Disclaimer Banner */}
      <div className="bg-secondary/10 border-b border-secondary/20 py-2">
        <div className="container mx-auto px-4 flex items-center justify-center gap-2 text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-widest">
          <AlertCircle className="h-3 w-3 text-secondary" />
          <span>Independent Tool • Not Affiliated with IEBC Kenya</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage?.imageUrl || "https://images.unsplash.com/photo-1693902997450-7e912c0d3554?q=80&w=1974&auto=format&fit=crop"}
            alt="Voters context in Kenya"
            fill
            className="object-cover brightness-[0.4]"
            data-ai-hint="kenya landscape"
            priority
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-white space-y-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-headline font-bold leading-tight">
              Every Vote Starts with Your <span className="text-secondary">First Step.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mt-4 leading-relaxed">
              Find your nearest registration center, check your eligibility, and get personalized routes to start your journey as a first-time voter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 h-14 rounded-full">
                <Link href="/find" className="gap-2">
                  Find a Center <MapPin className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white h-14 rounded-full">
                <Link href="/eligibility" className="gap-2">
                  How to Register <Info className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Summary */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <Badge variant="secondary" className="mb-4">Community Initiative</Badge>
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-4">Empowering First-Time Voters</h2>
            <p className="text-muted-foreground text-lg">We simplify the path to active citizenship so you can focus on making your voice heard.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-10 rounded-3xl bg-background border border-border/50 hover:border-primary/20 transition-all group shadow-sm">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                <MapPin className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-headline font-bold mb-4">Live Search</h3>
              <p className="text-muted-foreground leading-relaxed">
                Locate registration centers instantly by constituency, ward, or proximity. No more guessing where the nearest office is.
              </p>
            </div>

            <div className="p-10 rounded-3xl bg-background border border-border/50 hover:border-primary/20 transition-all group shadow-sm">
              <div className="h-14 w-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-8 group-hover:scale-110 transition-transform">
                <Navigation className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-headline font-bold mb-4">AI Route Guide</h3>
              <p className="text-muted-foreground leading-relaxed">
                Smart route optimization for walking, public transport (Matatu), or driving. Find the most convenient path to register.
              </p>
            </div>

            <div className="p-10 rounded-3xl bg-background border border-border/50 hover:border-primary/20 transition-all group shadow-sm">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                <Vote className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-headline font-bold mb-4">Verified Info</h3>
              <p className="text-muted-foreground leading-relaxed">
                Access up-to-date eligibility requirements and center details verified by our community feedback system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick CTA */}
      <section className="py-20 bg-primary text-white overflow-hidden relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl text-center md:text-left space-y-4">
              <h2 className="text-4xl font-headline font-bold">Ready to register?</h2>
              <p className="text-white/70 text-lg italic">
                Note: This is an independent tool. Please verify with IEBC for the most current deadlines.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary" className="px-12 h-16 text-lg rounded-full shadow-xl hover:scale-105 transition-transform">
              <Link href="/eligibility" className="gap-2">
                Check Requirements <ArrowRight className="h-6 w-6" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 h-full w-1/3 bg-white/5 skew-x-12 transform translate-x-1/2"></div>
      </section>
    </div>
  );
}

function Badge({ children, className, variant = "default" }: { children: React.ReactNode, className?: string, variant?: "default" | "secondary" }) {
  return (
    <span className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${variant === 'secondary' ? 'bg-secondary/20 text-secondary' : 'bg-primary text-primary-foreground'} ${className}`}>
      {children}
    </span>
  );
}
