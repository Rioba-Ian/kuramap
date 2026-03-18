
import { ELIGIBILITY_CRITERIA } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, FileText, UserCheck, AlertCircle } from "lucide-react";

export default function EligibilityPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-4">
            Voter Registration Eligibility
          </h1>
          <p className="text-muted-foreground text-lg">
            Find out if you qualify to register as a voter in Kenya and what documents you'll need to carry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {ELIGIBILITY_CRITERIA.map((item, index) => (
            <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-headline">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-secondary/5 border-secondary/20 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-secondary">
              <FileText className="h-6 w-6" />
              Mandatory Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              To be registered, you MUST present one of the following original documents:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <li className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3 border border-secondary/10">
                <UserCheck className="h-5 w-5 text-secondary" />
                <span className="font-medium">Valid National ID Card</span>
              </li>
              <li className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3 border border-secondary/10">
                <FileText className="h-5 w-5 text-secondary" />
                <span className="font-medium">Valid Kenyan Passport</span>
              </li>
            </ul>
            <div className="mt-6 flex items-start gap-3 bg-white p-4 rounded-xl text-sm border-l-4 border-l-destructive shadow-sm">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-muted-foreground italic">
                Please note: Waiting slips, photocopies of ID/Passport, or Police Abstracts are <span className="font-bold text-destructive">NOT</span> acceptable for voter registration.
              </p>
            </div>
          </CardContent>
        </Card>

        <section className="bg-white p-8 rounded-3xl border shadow-sm">
          <h2 className="text-2xl font-headline font-bold text-primary mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-2">Can I register at any center?</h3>
              <p className="text-muted-foreground">Yes, you can register at any designated registration center, usually within the constituency you intend to vote in.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Is there a fee for registration?</h3>
              <p className="text-muted-foreground">No, voter registration is a free service provided by the IEBC for all eligible Kenyan citizens.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">What if I lost my ID?</h3>
              <p className="text-muted-foreground">You must obtain a replacement ID from the Registrar of Persons first. You cannot register with an abstract.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
