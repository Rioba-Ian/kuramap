
"use client";

import Link from "next/link";
import { Vote, MapPin, Info, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Find Centers", href: "/find", icon: MapPin },
  { name: "Eligibility", href: "/eligibility", icon: Info },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-headline font-bold text-primary text-xl">
            <Vote className="h-6 w-6" />
            <span>Mwanzo Vote</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>
          {/* Mobile Bottom Nav is more common in Kenyan mobile-first apps, but keeping it simple here */}
          <div className="md:hidden flex items-center gap-4">
             {/* Optional: Mobile menu trigger */}
          </div>
        </div>
      </div>
    </nav>
  );
}
