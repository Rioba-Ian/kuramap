
import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Kuramap - Kenya Voter Registration Centers',
  description: 'Helping Kenyans find voter registration and polling centers with ease.',
  icons: {
    icon: '/logo.svg',
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
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
                  Empowering every Kenyan to exercise their right to vote through technology and data transparency.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-foreground">Navigation</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                  <li><Link href="/find" className="hover:text-primary transition-colors">Find Centers</Link></li>
                  <li><Link href="/eligibility" className="hover:text-primary transition-colors">Eligibility</Link></li>
                  <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-foreground">Legal</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                  <li><Link href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t text-center text-xs text-muted-foreground space-y-2">
              <p>&copy; {new Date().getFullYear()} Kuramap. All rights reserved.</p>
              <p className="font-bold text-destructive/80 italic">Not affiliated with the IEBC Kenya.</p>
            </div>
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
