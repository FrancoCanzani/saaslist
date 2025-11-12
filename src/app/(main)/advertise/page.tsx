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
import { Check } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

const pricingPlans = [
  {
    id: "daily",
    name: "Daily Boost",
    type: "daily",
    pricePerDay: 10,
    description: "Perfect for product launches and short campaigns.",
    features: [
      "Featured on homepage rotation",
      "Highlighted in your category listings",
      "Pinned to top of relevant tags",
      "'Sponsored' badge on your listing",
      "1 newsletter feature placement",
      "Priority email support",
    ],
    cta: "Get started",
    popular: false,
  },
  {
    id: "monthly",
    name: "Growth Plan",
    type: "fixed",
    price: 99,
    description: "Best value for sustained visibility and growth.",
    features: [
      "Featured on homepage for 30 days",
      "Pinned position in all relevant categories",
      "Premium highlight styling on all listings",
      "4 newsletter feature placements",
      "Highlighted in browse page",
      "Social media mention (1x)",
      "Priority support",
      "Weekly performance report",
    ],
    cta: "Get started",
    popular: true,
  },
  {
    id: "lifetime",
    name: "Lifetime",
    type: "fixed",
    price: 999,
    description: "One-time payment for permanent premium visibility.",
    features: [
      "Permanent homepage featured rotation",
      "Always pinned in relevant categories",
      "Exclusive 'Partner' badge",
      "Unlimited newsletter placements",
      "Featured in monthly roundup posts",
      "Monthly social media mentions",
      "Custom featured section (optional)",
      "Dedicated account manager",
      "Priority in all future features",
    ],
    cta: "Get started",
    popular: false,
  },
];

const faqs = [
  {
    question: "How quickly will my sponsored listing go live?",
    answer:
      "Your sponsored listing goes live within 24 hours of payment confirmation. We'll send you a confirmation email once it's active.",
  },
  {
    question: "Where exactly will my product be featured?",
    answer:
      "Your product will appear in multiple places: homepage featured rotation (alongside top products), pinned to the top of relevant category pages, highlighted in tag pages, and featured in our weekly newsletter sent every Sunday.",
  },
  {
    question: "Can I choose which categories my product is featured in?",
    answer:
      "Yes! When you upgrade, you'll select the categories and tags that match your product. Your product will then be prominently featured in those specific sections for maximum relevant exposure.",
  },
  {
    question: "Can I pause or cancel my plan?",
    answer:
      "Daily plans run for your selected dates and end automatically. Monthly plans can be cancelled anytime with no penalty. Lifetime plans are non-refundable but include unlimited modifications and support.",
  },
  {
    question: "How does the newsletter feature work?",
    answer:
      "Our newsletter goes out every Sunday to all subscribers. Featured products are showcased with logo, tagline, description, and a direct link. Daily plans get 1 placement, Monthly plans get 4 placements (one per week), and Lifetime plans get monthly features.",
  },
  {
    question: "What makes this different from a free listing?",
    answer:
      "Free listings are sorted by upvotes and recency, competing with all other products. Sponsored listings get permanent visibility in featured sections, highlighted styling with badges, newsletter placements, and priority positioning in categories regardless of upvotes.",
  },
  {
    question: "Do you offer custom or enterprise plans?",
    answer:
      "Yes! For multiple products, larger campaigns, or specific needs, contact us for custom packages with additional features and dedicated account management.",
  },
];

export default function AdvertisePage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const calculateDailyPrice = () => {
    if (!dateRange?.from || !dateRange?.to) return 0;
    const days = differenceInDays(dateRange.to, dateRange.from) + 1;
    return days * 10;
  };

  const dailyDays =
    dateRange?.from && dateRange?.to
      ? differenceInDays(dateRange.to, dateRange.from) + 1
      : 0;
  const dailyPrice = calculateDailyPrice();

  return (
    <main className="py-12 max-w-5xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl leading-tight font-medium font-mono tracking-tighter xl:leading-tight text-balance mb-4">
          We've got a plan that's perfect for you
        </h1>
        <h2 className="text-muted-foreground text-sm md:text-base text-balance">
          Get your SaaS in front of entrepreneurs and early adopters
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6 md:gap-8 px-4 md:px-6 max-w-6xl mx-auto">
        {pricingPlans.map((plan) => {
          const isDaily = plan.type === "daily";
          const price = isDaily ? dailyPrice : plan.price;

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
                <h3 className="text-lg font-mono font-medium">{plan.name}</h3>
                {plan.popular && (
                  <Badge className="rounded shrink-0">Popular</Badge>
                )}
                {plan.id === "lifetime" && (
                  <Badge
                    variant="secondary"
                    className="rounded bg-blaze-orange/10 text-blaze-orange border-blaze-orange/20 shrink-0 text-xs"
                  >
                    13/50 spots
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
                disabled={isDaily && (!dateRange?.from || !dateRange?.to)}
              >
                {plan.cta}
              </Button>

              <div className="flex-1 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  What's Included
                </p>
                <ul className="space-y-2.5">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <Check className="size-4 text-blaze-orange shrink-0 mt-0.5" />
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
          <h2 className="text-3xl font-medium font-mono tracking-tighter mb-2">
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
