"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { productSchema } from "../schemas";
import { LabelSelector } from "./label-selector";

interface ProductFormProps {
  onSubmit: (data: z.infer<typeof productSchema>) => Promise<void>;
  defaultValues?: Partial<z.infer<typeof productSchema>>;
  isSubmitting?: boolean;
}

const sections = [
  { id: "main-info", label: "Main Info" },
  { id: "images-media", label: "Images & Media" },
  { id: "pricing", label: "Pricing" },
  { id: "social-media", label: "Social Media" },
];

export function ProductForm({
  onSubmit,
  defaultValues,
  isSubmitting,
}: ProductFormProps) {
  const form = useForm({
    defaultValues: {
      name: defaultValues?.name || "",
      tagline: defaultValues?.tagline || "",
      website_url: defaultValues?.website_url || "",
      repo_url: defaultValues?.repo_url,
      is_open_source: !!defaultValues?.repo_url || false,
      description: defaultValues?.description || "",
      tags: defaultValues?.tags || [],
      logo_url: defaultValues?.logo_url,
      demo_url: defaultValues?.demo_url,
      pricing_model: defaultValues?.pricing_model || "free",
      promo_code: defaultValues?.promo_code,
      twitter_url: defaultValues?.twitter_url,
      linkedin_url: defaultValues?.linkedin_url,
      product_hunt_url: defaultValues?.product_hunt_url,
      platforms: defaultValues?.platforms || ["web"],
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <div>
      <div className="flex gap-8">
        <nav className="hidden md:block w-48 shrink-0 sticky top-24 h-fit">
          <div className="space-y-1">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block w-full text-left p-2 text-sm text-gray-600 hover:text-gray-900"
              >
                {section.label}
              </a>
            ))}
          </div>
        </nav>

        <form
          className="flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="gap-10">
            <div id="main-info" className="scroll-mt-24 space-y-10">
              <form.Field
                name="name"
                validators={{
                  onChange: productSchema.shape.name,
                }}
              >
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor="name">
                        Name of the Launch *
                      </FieldLabel>
                      <Input
                        id="name"
                        type="text"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="My Awesome SaaS"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field
                name="tagline"
                validators={{
                  onChange: productSchema.shape.tagline,
                }}
              >
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor="tagline">Tagline *</FieldLabel>
                      <Input
                        id="tagline"
                        type="text"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="The best way to manage your tasks"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field
                name="website_url"
                validators={{
                  onChange: productSchema.shape.website_url,
                }}
              >
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor="website_url">
                        Website URL *
                      </FieldLabel>
                      <Input
                        id="website_url"
                        type="url"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="https://example.com"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field
                name="platforms"
                validators={{
                  onChange: productSchema.shape.platforms,
                }}
              >
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  const platformOptions = [
                    { value: "web", label: "Web" },
                    { value: "ios", label: "iOS" },
                    { value: "android", label: "Android" },
                    { value: "desktop", label: "Desktop" },
                    { value: "api", label: "API" },
                    { value: "browser_extension", label: "Browser Extension" },
                  ];

                  const togglePlatform = (platform: string) => {
                    const current = field.state.value;
                    if (current.includes(platform as any)) {
                      field.handleChange(current.filter((p) => p !== platform));
                    } else {
                      field.handleChange([...current, platform as any]);
                    }
                  };

                  return (
                    <Field>
                      <FieldLabel>Platform Availability *</FieldLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {platformOptions.map((option) => (
                          <Label
                            key={option.value}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Input
                              type="checkbox"
                              checked={field.state.value.includes(
                                option.value as any,
                              )}
                              onChange={() => togglePlatform(option.value)}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">{option.label}</span>
                          </Label>
                        ))}
                      </div>
                      <FieldDescription>
                        Select all platforms where your product is available
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="is_open_source">
                {(field) => {
                  return (
                    <>
                      <Field orientation="horizontal">
                        <Input
                          id="is_open_source"
                          type="checkbox"
                          checked={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <FieldLabel htmlFor="is_open_source">
                          Is this open source?
                        </FieldLabel>
                      </Field>

                      {field.state.value && (
                        <form.Field
                          name="repo_url"
                          validators={{
                            onChangeListenTo: ["is_open_source"],
                            onChange: productSchema.shape.repo_url,
                          }}
                        >
                          {(repoField) => {
                            const isInvalid =
                              repoField.state.meta.isTouched &&
                              !repoField.state.meta.isValid;
                            return (
                              <Field>
                                <FieldLabel htmlFor="repo_url">
                                  Repository URL *
                                </FieldLabel>
                                <Input
                                  id="repo_url"
                                  type="url"
                                  value={repoField.state.value || ""}
                                  onBlur={repoField.handleBlur}
                                  onChange={(e) =>
                                    repoField.handleChange(
                                      e.target.value || undefined,
                                    )
                                  }
                                  aria-invalid={isInvalid}
                                  placeholder="https://github.com/username/repo"
                                />
                                {isInvalid && (
                                  <FieldError
                                    errors={repoField.state.meta.errors}
                                  />
                                )}
                              </Field>
                            );
                          }}
                        </form.Field>
                      )}
                    </>
                  );
                }}
              </form.Field>

              <form.Field
                name="description"
                validators={{
                  onChange: productSchema.shape.description,
                }}
              >
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor="description">
                        Description *
                      </FieldLabel>
                      <Textarea
                        id="description"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="min-h-[120px]"
                        aria-invalid={isInvalid}
                        placeholder="Tell us about your product, its features, and what makes it unique..."
                      />
                      <FieldDescription>
                        Detailed description (50-1000 characters)
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field
                name="tags"
                validators={{
                  onChange: productSchema.shape.tags,
                }}
              >
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel>Launch Tags * (up to 3)</FieldLabel>
                      <LabelSelector
                        selectedTags={field.state.value}
                        onTagsChange={(tags) => field.handleChange(tags)}
                        maxTags={3}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </div>

            <FieldSeparator />

            <div id="images-media" className="scroll-mt-24 space-y-10">
              <form.Field
                name="logo_url"
                validators={{
                  onChange: productSchema.shape.logo_url,
                }}
              >
                {(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor="logo_url">Logo</FieldLabel>
                      <div className="space-y-4">
                        <div>
                          <Input
                            id="logo_url"
                            type="url"
                            value={field.state.value || ""}
                            onBlur={field.handleBlur}
                            onChange={(e) =>
                              field.handleChange(e.target.value || undefined)
                            }
                            placeholder="https://example.com/logo.png"
                          />
                        </div>

                        <div className="">
                          <p className="text-sm mb-2">Or upload a logo:</p>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // TODO: Upload to Supabase Storage
                                console.log("Logo file selected:", file.name);
                                // For now, just show a placeholder
                                alert(
                                  "File upload coming soon! For now, please use a URL.",
                                );
                              }
                            }}
                            className="w-full text-sm"
                          />
                          <FieldDescription>
                            Upload will be available soon
                          </FieldDescription>
                        </div>
                      </div>
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field
                name="demo_url"
                validators={{
                  onChange: productSchema.shape.demo_url,
                }}
              >
                {(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor="demo_url">
                        Demo Video URL (Loom or YouTube)
                      </FieldLabel>
                      <Input
                        id="demo_url"
                        type="url"
                        value={field.state.value || ""}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(e.target.value || undefined)
                        }
                        className="w-full border px-3 py-2"
                        placeholder="https://loom.com/share/..."
                      />
                    </Field>
                  );
                }}
              </form.Field>
            </div>

            <FieldSeparator />

            <div id="pricing" className="scroll-mt-24 space-y-10">
              <form.Field
                name="pricing_model"
                validators={{
                  onChange: productSchema.shape.pricing_model,
                }}
              >
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  
                  const pricingOptions = [
                    {
                      id: "free",
                      title: "Free",
                      description: "Completely free to use",
                    },
                    {
                      id: "freemium",
                      title: "Freemium",
                      description: "Free tier with paid upgrades",
                    },
                    {
                      id: "premium",
                      title: "Premium",
                      description: "Paid subscription required",
                    },
                  ] as const;

                  return (
                    <FieldSet>
                      <FieldLegend>Pricing Model *</FieldLegend>
                      <FieldDescription>
                        How do you monetize your product?
                      </FieldDescription>
                      <RadioGroup
                        name={field.name}
                        value={field.state.value}
                        onValueChange={(value) =>
                          field.handleChange(
                            value as "free" | "freemium" | "premium",
                          )
                        }
                      >
                        {pricingOptions.map((option) => (
                          <FieldLabel
                            key={option.id}
                            htmlFor={`pricing-${option.id}`}
                          >
                            <Field
                              orientation="horizontal"
                              data-invalid={isInvalid}
                            >
                              <FieldContent>
                                <FieldTitle>{option.title}</FieldTitle>
                                <FieldDescription>
                                  {option.description}
                                </FieldDescription>
                              </FieldContent>
                              <RadioGroupItem
                                value={option.id}
                                id={`pricing-${option.id}`}
                                aria-invalid={isInvalid}
                              />
                            </Field>
                          </FieldLabel>
                        ))}
                      </RadioGroup>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldSet>
                  );
                }}
              </form.Field>

              <form.Field
                name="promo_code"
                validators={{
                  onChange: productSchema.shape.promo_code,
                }}
              >
                {(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor="promo_code">Promo Code</FieldLabel>
                      <Input
                        id="promo_code"
                        type="text"
                        value={field.state.value || ""}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(e.target.value || undefined)
                        }
                        placeholder="SUMMER2024"
                      />
                    </Field>
                  );
                }}
              </form.Field>
            </div>

            <FieldSeparator />

            <div id="social-media" className="scroll-mt-24 space-y-10">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Social Media</h3>

                <form.Field
                  name="twitter_url"
                  validators={{
                    onChange: productSchema.shape.twitter_url,
                  }}
                >
                  {(field) => {
                    return (
                      <Field>
                        <FieldLabel htmlFor="twitter_url">
                          Twitter/X URL
                        </FieldLabel>
                        <Input
                          id="twitter_url"
                          type="url"
                          value={field.state.value || ""}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(e.target.value || undefined)
                          }
                          placeholder="https://twitter.com/yourhandle"
                        />
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field
                  name="linkedin_url"
                  validators={{
                    onChange: productSchema.shape.linkedin_url,
                  }}
                >
                  {(field) => {
                    return (
                      <Field>
                        <FieldLabel htmlFor="linkedin_url">
                          LinkedIn URL
                        </FieldLabel>
                        <Input
                          id="linkedin_url"
                          type="url"
                          value={field.state.value || ""}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(e.target.value || undefined)
                          }
                          placeholder="https://linkedin.com/company/yourcompany"
                        />
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field
                  name="product_hunt_url"
                  validators={{
                    onChange: productSchema.shape.product_hunt_url,
                  }}
                >
                  {(field) => {
                    return (
                      <Field>
                        <FieldLabel htmlFor="product_hunt_url">
                          Product Hunt URL
                        </FieldLabel>
                        <Input
                          id="product_hunt_url"
                          type="url"
                          value={field.state.value || ""}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(e.target.value || undefined)
                          }
                          placeholder="https://producthunt.com/posts/yourproduct"
                        />
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
            </div>
          </FieldGroup>

          <div className="mt-8 gap-4 flex justify-end">
            <Button variant={"outline"} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
