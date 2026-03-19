
"use client";

import Link from "next/link";
import Image from "next/image";
import { Vote, MapPin, Info, Home, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Find Centers", href: "/find", icon: MapPin },
  { name: "Eligibility", href: "/eligibility", icon: Info },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="Kuramap Logo"
              width={120}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </Link>
          
          {/* Desktop Navigation */}
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

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="text-left">
                  <SheetTitle className="flex items-center gap-2 pb-4 border-b">
                    <Image
                      src="/logo.svg"
                      alt="Kuramap Logo"
                      width={120}
                      height={32}
                      className="h-8 w-auto"
                    />
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-lg font-medium rounded-xl transition-colors",
                        pathname === item.href 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="absolute bottom-8 left-0 w-full px-8 text-center">
                  <p className="text-xs text-muted-foreground italic">
                    Helping Kenyans navigate their first vote.
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
