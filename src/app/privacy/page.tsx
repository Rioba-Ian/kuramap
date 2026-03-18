
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8 flex items-center gap-3">
        <ShieldCheck className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-headline font-bold text-primary">Privacy Policy</h1>
      </div>
      
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Data Protection Compliance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Mwanzo Vote Locator is committed to protecting your privacy. In accordance with the <strong>Kenya Data Protection Act (2019)</strong>, we ensure that your personal data is handled with transparency and security.
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">1. Data We Collect</h2>
            <p>
              This application is primarily a locator tool. We collect:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Location Data:</strong> When you use the "Near Me" feature, we access your device's GPS coordinates. This data is processed client-side and is not stored on our servers.</li>
              <li><strong>Usage Data:</strong> We may collect anonymized usage patterns to improve our AI routing algorithms.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">2. How We Use Data</h2>
            <p>
              Your data is used solely to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate directions to voter registration centers.</li>
              <li>Filter registration centers based on your proximity.</li>
              <li>Improve the AI-generated route recommendations.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">3. Third-Party Services</h2>
            <p>
              We use Leaflet and OpenStreetMap for map services and Google Gemini (via Genkit) for AI routing. These services may have their own privacy policies regarding data processing.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">4. Your Rights</h2>
            <p>
              Under the Kenya Data Protection Act, you have the right to access, correct, or request the deletion of any data we hold about you. Since we do not store personal identifiers (like names or IDs), these rights primarily apply to the local storage and session data on your device.
            </p>
          </section>

          <p className="text-sm italic pt-6">Last Updated: March 2024</p>
        </CardContent>
      </Card>
    </div>
  );
}
