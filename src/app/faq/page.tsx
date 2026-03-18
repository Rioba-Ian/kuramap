
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      question: "Is Mwanzo Vote Locator an official IEBC tool?",
      answer: "No. This is an independent tool created to help first-time voters navigate the registration process more easily using modern AI and mapping tech."
    },
    {
      question: "Can I register to vote directly on this website?",
      answer: "No. Voter registration in Kenya requires physical presence at an IEBC center for biometric capture. This tool only helps you find where those centers are."
    },
    {
      question: "How accurate are the AI routes?",
      answer: "Our AI uses current mapping data to suggest the best transport methods, but road conditions and matatu routes can change. Use them as a guide, not absolute instructions."
    },
    {
      question: "Does the app store my location?",
      answer: "We do not store your exact GPS location on our servers. It is processed in your browser to show nearby centers and is cleared when you close the session."
    },
    {
      question: "What should I carry to the registration center?",
      answer: "You must carry your ORIGINAL National ID card or a valid Kenyan Passport. Photocopies or police abstracts are not accepted for registration."
    },
    {
      question: "Is there a deadline for voter registration?",
      answer: "Voter registration is usually a continuous process (CVR) at IEBC constituency offices, though mass registration drives have specific start and end dates. Check official IEBC updates for upcoming deadlines."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full text-primary mb-4">
          <HelpCircle className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-headline font-bold text-primary mb-4">Frequently Asked Questions</h1>
        <p className="text-muted-foreground text-lg">
          Everything you need to know about Mwanzo Vote Locator and the registration process.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border rounded-xl px-6 bg-white shadow-sm">
            <AccordionTrigger className="text-left font-bold text-lg hover:no-underline py-6">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-6 text-base leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      <div className="mt-16 p-8 bg-secondary/5 rounded-3xl border border-dashed text-center">
        <h2 className="text-xl font-bold mb-2">Still have questions?</h2>
        <p className="text-muted-foreground mb-6">We're here to help you get registered.</p>
        <p className="text-sm">For official inquiries, contact IEBC at <span className="font-bold">020 2877000</span></p>
      </div>
    </div>
  );
}
