"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addDays, differenceInDays, format } from "date-fns";
import { Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { getLoginUrl } from "@/utils/helpers";
import { useCurrentUser } from "@/hooks/use-current-user";

const pricingPlans = [
  {
    id: "daily",
    name: "Daily Boost",
    type: "daily",
    pricePerDay: 5,
    description: "Perfect for product launches and short campaigns.",
    features: [
      "Featured on homepage marquee",
      "Featured badge on your product listing",
      "Products marked as featured",
    ],
    cta: "Get started",
    popular: false,
  },
  {
    id: "monthly",
    name: "Growth Plan",
    type: "fixed",
    price: 39,
    description: "Best value for sustained visibility and growth.",
    features: [
      "Featured on homepage marquee",
      "Featured badge on your product listing",
      "Products marked as featured for 30 days",
    ],
    cta: "Get started",
    popular: true,
  },
  {
    id: "lifetime",
    name: "Lifetime",
    type: "fixed",
    price: 199,
    description: "One-time payment for permanent premium visibility.",
    features: [
      "Permanent featured status",
      "Featured on homepage marquee",
      "Featured badge on your product listing",
      "Products always marked as featured",
    ],
    cta: "Get started",
    popular: false,
  },
];

const faqs = [
  {
    question: "How quickly will my product be featured?",
    answer:
      "For monthly and lifetime plans, your product becomes featured immediately after payment confirmation (usually within minutes). For daily passes, your product will be featured starting on your selected start date. You'll see the featured status activate automatically.",
  },
  {
    question: "Where exactly will my product be featured?",
    answer:
      "Featured products get premium placement across the platform: they appear at the top of homepage product lists, leaderboard, browse page, and category pages. They're also displayed in the homepage marquee (rotating logo display) and show a featured badge on product cards and listing pages for maximum visibility.",
  },
  {
    question: "What does the featured badge look like?",
    answer:
      "The featured badge appears on your product card with a gold olive branch icon and 'Featured' text, making your product easily identifiable as a featured listing. This badge appears everywhere your product is displayed.",
  },
  {
    question: "Can I pause or cancel my plan?",
    answer:
      "Daily plans run for your selected dates and end automatically. Monthly plans can be cancelled anytime with no penalty - your featured status will remain active until the end of your current billing period. Lifetime plans are non-refundable but provide permanent featured status.",
  },
  {
    question: "What makes this different from a free listing?",
    answer:
      "Free listings are sorted by upvotes and recency, competing with all other products. Featured listings are prioritized at the top of all product lists (homepage, leaderboard, browse, categories), appear in the homepage marquee, and display a featured badge - giving them significantly increased visibility and credibility.",
  },
  {
    question: "Can I schedule my featured status for a future date?",
    answer:
      "Yes! With the Daily Boost plan, you can select any future date range. Your product will automatically become featured on your chosen start date. This is perfect for coordinating with product launches or marketing campaigns.",
  },
  {
    question: "Do you offer custom or enterprise plans?",
    answer:
      "For multiple products, larger campaigns, or specific needs, please contact us to discuss custom packages and additional features.",
  },
];

export default function AdvertisePage() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 6),
  });
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoadingUser && !currentUser?.user) {
      router.push(getLoginUrl(pathname));
    }
  }, [currentUser, isLoadingUser, router, pathname]);

  const calculateDailyPrice = () => {
    if (!dateRange?.from || !dateRange?.to) return 0;
    const days = differenceInDays(dateRange.to, dateRange.from) + 1;
    return days * 5;
  };

  const dailyDays =
    dateRange?.from && dateRange?.to
      ? differenceInDays(dateRange.to, dateRange.from) + 1
      : 0;
  const dailyPrice = calculateDailyPrice();

  const handleCheckout = async (planType: string) => {
    setProcessing(planType);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planType,
          dateRange:
            planType === "daily"
              ? {
                  from: dateRange?.from?.toISOString(),
                  to: dateRange?.to?.toISOString(),
                }
              : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push(getLoginUrl(pathname));
          return;
        }
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to start checkout",
      );
      setProcessing(null);
    }
  };

  if (isLoadingUser || !currentUser?.user) {
    return (
      <main className="py-12 max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </main>
    );
  }

  return (
    <main className="py-12 max-w-5xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl leading-tight font-medium tracking-tighter xl:leading-tight text-balance mb-4">
          We've got a plan that's perfect for you
        </h1>
        <h2 className="text-muted-foreground text-sm md:text-base text-balance">
          Get your product in front of entrepreneurs and early adopters
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6 md:gap-8 px-4 md:px-6 max-w-6xl mx-auto">
        {pricingPlans.map((plan) => {
          const isDaily = plan.type === "daily";
          const price = isDaily ? dailyPrice : plan.price;
          const isProcessing = processing === plan.id;

          return (
            <Card
              key={plan.id}
              className={cn(
                "relative flex flex-col space-y-4 p-4 md:p-6",
                plan.popular
                  ? "border-primary shadow-lg md:scale-105"
                  : "bg-card",
              )}
            >
              <div className="flex items-center w-full justify-between gap-2">
                <h3 className="text-lg font-medium">{plan.name}</h3>
                {plan.popular && (
                  <Badge className="rounded shrink-0">Popular</Badge>
                )}
                {plan.id === "lifetime" && (
                  <Badge variant="secondary" className="rounded text-xs">
                    Limited spots
                  </Badge>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-semibold tracking-tight">
                    ${price}
                  </span>
                  <div className="flex flex-col text-xs md:text-sm text-muted-foreground">
                    {isDaily ? (
                      <>
                        <span>
                          ${plan.pricePerDay}/day
                          {dailyDays > 0 ? ` × ${dailyDays}` : ""}
                        </span>
                      </>
                    ) : (
                      <span>
                        {plan.id === "monthly" ? "/month" : "one-time"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                {plan.description}
              </p>

              {isDaily && (
                <Popover>
                  <PopoverTrigger asChild className="w-full">
                    <button
                      className={cn(
                        "w-full justify-start underline text-left font-normal text-sm",
                        !dateRange && "text-muted-foreground",
                      )}
                    >
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "MMM dd")} -{" "}
                            {format(dateRange.to, "MMM dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "MMM dd, y")
                        )
                      ) : (
                        <span>Pick your dates</span>
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              )}

              <Button
                size="default"
                className="w-full"
                disabled={
                  isProcessing ||
                  (isDaily && (!dateRange?.from || !dateRange?.to))
                }
                onClick={() => handleCheckout(plan.id)}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  plan.cta
                )}
              </Button>

              <div className="flex-1 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  What's Included
                </p>
                <ul className="space-y-2.5">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <Check className="size-4 shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="px-6 py-12 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-medium tracking-tighter mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-sm">
            Everything you need to know about advertising on SaasList
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </main>
  );
}
