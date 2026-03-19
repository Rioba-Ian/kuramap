import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
 title: "Kuramap - Kenya Voter Registration Centers",
 description:
  "Find your nearest voter registration center in Kenya. Search 26,000+ polling stations by location, constituency, or ward. Get directions via Google Maps, Uber, or Bolt.",
 keywords: [
  "Kenya voter registration",
  "polling stations Kenya",
  "IEBC registration centers",
  "voter registration locations",
  "Kenya elections",
  "find polling station",
  "voter registration near me",
  "IEBC Kenya",
  "Kenyan democracy",
  "first time voter Kenya",
  "voter education",
  "civic engagement Kenya",
  "constituency lookup",
  "ward finder Kenya",
 ],
 authors: [{ name: "Kuramap" }],
 creator: "Kuramap",
 publisher: "Kuramap",
 formatDetection: {
  email: false,
  address: false,
  telephone: false,
 },
 metadataBase: new URL("https://kuramap.vercel.app"),
 alternates: {
  canonical: "/",
 },
 openGraph: {
  title: "Kuramap - Find Your Voter Registration Center in Kenya",
  description:
   "Locate your nearest voter registration center from 26,000+ polling stations across Kenya. Get AI-powered directions and navigate with ease.",
  url: "https://kuramap.vercel.app",
  siteName: "Kuramap",
  images: [
   {
    url: "/preview-small.png",
    width: 1200,
    height: 630,
    alt: "Kuramap - Kenya Voter Registration Center Finder",
   },
  ],
  locale: "en_KE",
  type: "website",
 },
 twitter: {
  card: "summary_large_image",
  title: "Kuramap - Find Your Voter Registration Center",
  description:
   "Search 26,000+ polling stations in Kenya. Get directions, find your constituency, and register to vote.",
  images: ["/preview-small.png"],
  creator: "@kuramap",
 },
 robots: {
  index: true,
  follow: true,
  googleBot: {
   index: true,
   follow: true,
   "max-video-preview": -1,
   "max-image-preview": "large",
   "max-snippet": -1,
  },
 },
 icons: {
  icon: "/logo.svg",
  apple: "/logo.svg",
 },
 manifest: "/site.webmanifest",
 other: {
  "theme-color": "#005F02",
  "color-scheme": "light",
  "mobile-web-app-capable": "yes",
  "apple-mobile-web-app-capable": "yes",
  "apple-mobile-web-app-status-bar-style": "default",
  "apple-mobile-web-app-title": "Kuramap",
  "application-name": "Kuramap",
  "msapplication-TileColor": "#005F02",
  "msapplication-tap-highlight": "no",
 },
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
  <html lang="en">
   <head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
     rel="preconnect"
     href="https://fonts.gstatic.com"
     crossOrigin="anonymous"
    />
    <link
     href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
     rel="stylesheet"
    />
   </head>
   <body className="font-body antialiased bg-background text-foreground min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <footer className="py-12 border-t bg-white">
     <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
       <div className="space-y-4">
        <Image
         src="/logo.svg"
         alt="Kuramap Logo"
         width={140}
         height={36}
         className="h-9 w-auto mx-auto md:mx-0"
        />
        <p className="text-sm text-muted-foreground leading-relaxed">
         Empowering every Kenyan to exercise their right to vote through
         technology and data transparency.
        </p>
       </div>
       <div className="space-y-4">
        <h3 className="font-bold text-foreground">Navigation</h3>
        <ul className="text-sm text-muted-foreground space-y-2">
         <li>
          <Link href="/" className="hover:text-primary transition-colors">
           Home
          </Link>
         </li>
         <li>
          <Link href="/find" className="hover:text-primary transition-colors">
           Find Centers
          </Link>
         </li>
         <li>
          <Link
           href="/eligibility"
           className="hover:text-primary transition-colors"
          >
           Eligibility
          </Link>
         </li>
         <li>
          <Link href="/faq" className="hover:text-primary transition-colors">
           FAQ
          </Link>
         </li>
        </ul>
       </div>
       <div className="space-y-4">
        <h3 className="font-bold text-foreground">Legal</h3>
        <ul className="text-sm text-muted-foreground space-y-2">
         <li>
          <Link
           href="/privacy"
           className="hover:text-primary transition-colors"
          >
           Privacy Policy
          </Link>
         </li>
         <li>
          <Link href="/terms" className="hover:text-primary transition-colors">
           Terms of Service
          </Link>
         </li>
         <li>
          <Link
           href="/disclaimer"
           className="hover:text-primary transition-colors"
          >
           Disclaimer
          </Link>
         </li>
        </ul>
       </div>
      </div>
      <div className="pt-8 border-t text-center text-xs text-muted-foreground space-y-2">
       <p>&copy; {new Date().getFullYear()} Kuramap. All rights reserved.</p>
       <p className="font-bold text-destructive/80 italic">
        Not affiliated with the IEBC Kenya.
       </p>
      </div>
     </div>
    </footer>
    <Toaster />
   </body>
  </html>
 );
}
