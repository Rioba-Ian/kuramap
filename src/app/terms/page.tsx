
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8 flex items-center gap-3">
        <FileText className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-headline font-bold text-primary">Terms and Conditions</h1>
      </div>
      
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Usage Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing Mwanzo Vote Locator, you agree to be bound by these terms. This site is a community-driven tool intended to assist Kenyan citizens in exercising their right to vote.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">2. Non-Affiliation</h2>
            <p className="bg-destructive/10 p-4 rounded-lg text-destructive font-semibold">
              CRITICAL NOTICE: Mwanzo Vote Locator is an independent initiative. We are NOT affiliated with, authorized by, or endorsed by the Independent Electoral and Boundaries Commission (IEBC) of Kenya.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">3. Accuracy of Information</h2>
            <p>
              While we strive to keep information up to date, registration center locations and operating hours are subject to change by the IEBC without notice. AI-generated routes are recommendations and should be verified with local knowledge.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">4. Prohibited Use</h2>
            <p>
              You may not use this tool for any illegal purposes or to distribute misinformation regarding the electoral process in Kenya.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">5. Limitation of Liability</h2>
            <p>
              Mwanzo Vote Locator is provided "as-is". We are not liable for any delays, errors, or missed registration opportunities resulting from the use of this tool.
            </p>
          </section>

          <p className="text-sm italic pt-6">Last Updated: March 2024</p>
        </CardContent>
      </Card>
    </div>
  );
}
