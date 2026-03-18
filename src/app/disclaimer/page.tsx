
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8 flex items-center gap-3">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <h1 className="text-3xl font-headline font-bold text-primary">Disclaimer</h1>
      </div>
      
      <Card className="border-destructive/20 bg-destructive/5 shadow-sm">
        <CardHeader>
          <CardTitle className="text-destructive">Legal Notice & Non-Affiliation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
          <p className="text-lg font-medium text-foreground">
            Mwanzo Vote Locator is an independent educational and utility platform.
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground underline decoration-destructive/30">Not an Official Source</h2>
            <p>
              This website is NOT the official website of the Independent Electoral and Boundaries Commission (IEBC) of Kenya. It is a third-party application developed to help citizens find public information more easily.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground underline decoration-destructive/30">No Guarantee of Accuracy</h2>
            <p>
              The data presented here is compiled from public records and community feedback. We cannot guarantee that every registration center listed is currently active or that the operating hours are exact. Users are encouraged to verify details with official IEBC communications.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground underline decoration-destructive/30">AI Content</h2>
            <p>
              Route recommendations and review summaries are generated using Artificial Intelligence. AI can sometimes produce "hallucinations" or inaccurate directions. Always prioritize safety and official signage when traveling.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground underline decoration-destructive/30">Official Resources</h2>
            <p>
              For official voter registration services, please visit: <a href="https://www.iebc.or.ke" className="text-primary font-bold hover:underline">www.iebc.or.ke</a>
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
