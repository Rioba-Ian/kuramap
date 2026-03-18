
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin, Info, ArrowRight, Vote, Navigation } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-voter');

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage?.imageUrl || "https://picsum.photos/seed/kenya-vote/1200/600"}
            alt="Voters in Kenya"
            fill
            className="object-cover brightness-[0.4]"
            data-ai-hint="kenya voter registration"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-white space-y-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-headline font-bold leading-tight">
              Every Vote Starts with Your <span className="text-secondary">First Step.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mt-4 leading-relaxed">
              Find your nearest IEBC registration center, check your eligibility, and get personalized routes to start your journey as a first-time voter in Kenya.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
                <Link href="/find" className="gap-2">
                  Find a Center <MapPin className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white">
                <Link href="/eligibility" className="gap-2">
                  How to Register <Info className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Summary */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-headline font-bold text-primary mb-4">Empowering First-Time Voters</h2>
            <p className="text-muted-foreground">We simplify the registration process so you can focus on making your voice heard.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-background border hover:border-primary/20 transition-all group">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-headline font-bold mb-3">Live Search</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Find registration centers by constituency, ward, or your current location. No more guessing where to go.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-background border hover:border-primary/20 transition-all group">
              <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
                <Navigation className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-headline font-bold mb-3">AI Route Guide</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get optimal routes via walking, Matatu, or driving. We help you find the most convenient path to register.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-background border hover:border-primary/20 transition-all group">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <Vote className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-headline font-bold mb-3">Community Reviews</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Check wait times and staff helpfulness through aggregated community feedback for each station.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick CTA */}
      <section className="py-16 bg-primary text-white overflow-hidden relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-3xl font-headline font-bold mb-4">Ready to register?</h2>
              <p className="text-white/80">Make sure you have your ID or Passport ready. Check the eligibility requirements before you head out.</p>
            </div>
            <Button asChild size="lg" variant="secondary" className="px-10 h-14 text-lg">
              <Link href="/eligibility" className="gap-2">
                View Requirements <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 h-full w-1/3 bg-white/5 skew-x-12 transform translate-x-1/2"></div>
      </section>
    </div>
  );
}
