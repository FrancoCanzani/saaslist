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
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { updateProfileAction } from "../actions";
import { Profile } from "../types";

interface ProfileFormProps {
  profile: Profile | null;
  userEmail: string;
}

export function ProfileForm({ profile, userEmail }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: userEmail,
      name: profile?.name || "",
      bio: profile?.bio || "",
      avatar_url: profile?.avatar_url || "",
      twitter: profile?.twitter || "",
      website: profile?.website || "",
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        try {
          await updateProfileAction({
            name: value.name || undefined,
            bio: value.bio || undefined,
            avatar_url: value.avatar_url || undefined,
            twitter: value.twitter || undefined,
            website: value.website || undefined,
          });
          toast.success("Profile updated successfully");
          router.refresh();
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Failed to update profile",
          );
        }
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <FieldGroup>
        <form.Field name="email">
          {(field) => (
            <Field>
              <FieldLabel>Email</FieldLabel>
              <FieldDescription>
                Your email address (cannot be changed)
              </FieldDescription>
              <Input value={userEmail} disabled className="bg-muted" />
            </Field>
          )}
        </form.Field>

        <form.Field name="name">
          {(field) => (
            <Field>
              <FieldLabel>Name</FieldLabel>
              <FieldDescription>Your display name</FieldDescription>
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Your name"
                disabled={isPending}
                className="text-sm"
              />
              <FieldError>{field.state.meta.errors}</FieldError>
            </Field>
          )}
        </form.Field>

        <form.Field name="bio">
          {(field) => (
            <Field>
              <FieldLabel>Bio</FieldLabel>
              <FieldDescription>
                A short description about yourself (max 500 characters)
              </FieldDescription>
              <Textarea
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Tell us about yourself..."
                disabled={isPending}
                className="text-sm resize-none min-h-20"
                rows={8}
              />
              <FieldError>{field.state.meta.errors}</FieldError>
            </Field>
          )}
        </form.Field>

        <form.Field name="avatar_url">
          {(field) => (
            <Field>
              <FieldLabel>Avatar URL</FieldLabel>
              <FieldDescription>URL to your profile picture</FieldDescription>
              <Input
                type="url"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="https://example.com/avatar.jpg"
                disabled={isPending}
                className="text-sm"
              />
              <FieldError>{field.state.meta.errors}</FieldError>
            </Field>
          )}
        </form.Field>

        <form.Field name="twitter">
          {(field) => (
            <Field>
              <FieldLabel>Twitter</FieldLabel>
              <FieldDescription>Your Twitter profile URL</FieldDescription>
              <Input
                type="url"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="https://twitter.com/username"
                disabled={isPending}
                className="text-sm"
              />
              <FieldError>{field.state.meta.errors}</FieldError>
            </Field>
          )}
        </form.Field>

        <form.Field name="website">
          {(field) => (
            <Field>
              <FieldLabel>Website</FieldLabel>
              <FieldDescription>
                Your personal or company website
              </FieldDescription>
              <Input
                type="url"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="https://example.com"
                disabled={isPending}
                className="text-sm"
              />
              <FieldError>{field.state.meta.errors}</FieldError>
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit" size="xs" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
