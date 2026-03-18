
"use client";

import { useState, useEffect } from "react";
import { summarizeRegistrationCenterReviews } from "@/ai/flows/registration-center-review-summary-flow";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Quote } from "lucide-react";

interface ReviewSummaryProps {
  reviews: string[];
}

export function ReviewSummary({ reviews }: ReviewSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      if (reviews.length === 0) return;
      setLoading(true);
      try {
        const result = await summarizeRegistrationCenterReviews({ reviews });
        setSummary(result.summary);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [reviews]);

  if (reviews.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary font-bold">
        <MessageSquare className="h-5 w-5" />
        <h3>Community Summary</h3>
      </div>
      
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[80%]" />
        </div>
      ) : summary ? (
        <Card className="bg-primary/5 border-none shadow-none">
          <CardContent className="p-4 relative">
            <Quote className="h-8 w-8 text-primary/10 absolute -top-1 -left-1" />
            <p className="text-sm text-primary leading-relaxed z-10 relative">
              {summary}
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Recent Feedback</h4>
        {reviews.map((review, i) => (
          <div key={i} className="text-sm p-3 rounded-lg border bg-white shadow-sm italic text-muted-foreground">
            "{review}"
          </div>
        ))}
      </div>
    </div>
  );
}
