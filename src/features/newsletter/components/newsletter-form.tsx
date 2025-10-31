"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { useTransition } from "react";
import { toast } from "sonner";
import { subscribeToNewsletter } from "../actions";
import { newsletterSubscriptionSchema } from "../schemas";

interface NewsletterFormProps {
  defaultName?: string;
  defaultEmail?: string;
  isLoggedIn?: boolean;
}

export function NewsletterForm({
  defaultName = "",
  defaultEmail = "",
  isLoggedIn = false,
}: NewsletterFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    defaultValues: {
      name: defaultName,
      email: defaultEmail,
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        try {
          const result = await subscribeToNewsletter(value);
          if (result.success) {
            const message =
              result.action === "resubscribed"
                ? "Successfully resubscribed to newsletter!"
                : "Successfully subscribed to newsletter!";
            toast.success(message);
            form.reset();
          }
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Failed to subscribe",
          );
        }
      });
    },
  });

  if (isLoggedIn) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="max-w-xl mx-auto space-y-6"
      >
        <div className="space-y-4 p-4 rounded-lg border">
          <div className="flex flex-col items-center gap-1">
            <p className="font-medium">{defaultName}</p>
            <p className="text-sm text-muted-foreground">{defaultEmail}</p>
          </div>
          <p className="text-sm text-center">
            You'll receive the newsletter at this email address every Sunday.
          </p>
        </div>

        <Button
        type="submit"
        variant={"secondary"}
        disabled={isPending}
        className="w-full"
        >
          {isPending ? "Subscribing..." : "Subscribe to Newsletter"}
        </Button>

        <p className="text-xs text-center">
          By subscribing, you agree to receive weekly emails. You can
          unsubscribe at any time.
        </p>
      </form>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="max-w-xl mx-auto space-y-6"
    >
      <FieldGroup>
        <form.Field
          name="name"
          validators={{
            onChange: newsletterSubscriptionSchema.shape.name,
          }}
        >
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor="name">Name *</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="John Doe"
                  disabled={isPending}
                />
                <FieldDescription>
                  We'll use this to personalize your newsletter
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field
          name="email"
          validators={{
            onChange: newsletterSubscriptionSchema.shape.email,
          }}
        >
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor="email">Email *</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="john@example.com"
                  disabled={isPending}
                />
                <FieldDescription>
                  Your email address where we'll send the newsletter every
                  Sunday
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <Button
        type="submit"
        variant={"secondary"}
        disabled={isPending}
        className="w-full"
      >
        {isPending ? "Subscribing..." : "Subscribe to Newsletter"}
      </Button>

      <p className="text-xs text-center">
        By subscribing, you agree to receive weekly emails. You can unsubscribe
        at any time.
      </p>
    </form>
  );
}
