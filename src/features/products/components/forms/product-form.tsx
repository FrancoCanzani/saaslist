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
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { z } from "zod";
import { productSchema } from "../../schemas";
import type { Platform, PricingModel } from "../../types";
import { ImagesUpload } from "./images-upload";
import { LogoUpload } from "./logo-upload";
import ProductTagsSelector from "./product-tags-selector";
import { TechStackSelector } from "./tech-stack-selector";

interface ProductFormProps {
  onSubmit: (
    data: z.infer<typeof productSchema> & {
      imagesToDelete?: string[];
      removeLogo?: boolean;
    },
  ) => Promise<void>;
  defaultValues?: Partial<z.infer<typeof productSchema>>;
  existingImages?: string[];
  existingLogoUrl?: string;
  isSubmitting?: boolean;
  submitButtonText?: string;
  onCancel?: () => void;
}

type FormValues = {
  name: string;
  tagline: string;
  website_url: string;
  repo_url: string;
  description: string;
  tags: string[];
  techstack: string[];
  logo_url: string;
  logo_file: File | null;
  image_files: File[];
  demo_url: string;
  pricing_model: PricingModel;
  twitter_url: string;
  linkedin_url: string;
  instagram_url: string;
  platforms: Platform[];
};

const step_titles = [
  "basic information",
  "product details",
  "tech stack",
  "media & assets",
  "social links",
] as const;

const total_steps = step_titles.length;

const step_fields: Record<number, (keyof FormValues)[]> = {
  0: ["name", "tagline", "website_url", "description"],
  1: ["platforms", "pricing_model", "tags"],
  2: ["techstack"],
  3: ["logo_file", "logo_url", "image_files", "demo_url"],
  4: ["twitter_url", "linkedin_url", "instagram_url", "repo_url"],
};

export function ProductForm({
  onSubmit,
  defaultValues,
  existingImages = [],
  existingLogoUrl,
  isSubmitting,
  submitButtonText = "Submit Product",
  onCancel,
}: ProductFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [removeLogo, setRemoveLogo] = useState(false);
  const [keptExistingImages, setKeptExistingImages] =
    useState<string[]>(existingImages);

  const form = useForm({
    defaultValues: {
      name: defaultValues?.name || "",
      tagline: defaultValues?.tagline || "",
      website_url: defaultValues?.website_url || "",
      repo_url: defaultValues?.repo_url || "",
      description: defaultValues?.description || "",
      tags: defaultValues?.tags || [],
      techstack: defaultValues?.techstack || [],
      logo_url: defaultValues?.logo_url || "",
      logo_file: null as File | null,
      image_files: [] as File[],
      demo_url: defaultValues?.demo_url || "",
      pricing_model: defaultValues?.pricing_model || "free",
      twitter_url: defaultValues?.twitter_url || "",
      linkedin_url: defaultValues?.linkedin_url || "",
      instagram_url: defaultValues?.instagram_url || "",
      platforms: defaultValues?.platforms || ["web"],
    },
    onSubmit: async ({ value }) => {
      const submitData = {
        ...value,
        imagesToDelete: imagesToDelete.length > 0 ? imagesToDelete : undefined,
        removeLogo: removeLogo || undefined,
      };
      await onSubmit(submitData);
    },
  });

  const validateStep = (step: number): boolean => {
    const fieldsToValidate = step_fields[step];
    if (!fieldsToValidate) return true;

    const formValues = form.state.values;
    const schemaShape = productSchema.shape as Record<string, z.ZodTypeAny>;
    const fileFields = new Set(["logo_file", "image_files"]);

    for (const fieldName of fieldsToValidate) {
      if (fileFields.has(fieldName)) {
        continue;
      }

      const fieldValue = formValues[fieldName];
      const fieldSchema = schemaShape[fieldName];

      if (fieldSchema) {
        const result = fieldSchema.safeParse(fieldValue);
        if (!result.success) {
          return false;
        }
      }

      const fieldMeta =
        form.state.fieldMeta[fieldName as keyof typeof form.state.fieldMeta];
      if (fieldMeta?.errors && fieldMeta.errors.length > 0) {
        return false;
      }
    }

    return true;
  };

  const hasStepErrors = (): boolean => {
    const fieldsToValidate = step_fields[currentStep];
    if (!fieldsToValidate) return false;

    return fieldsToValidate.some((fieldName) => {
      const fieldMeta = form.state.fieldMeta[fieldName];
      return fieldMeta?.errors && fieldMeta.errors.length > 0;
    });
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < total_steps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div>
      <div className="flex items-end justify-start space-x-2 mb-6">
        <h2 className="text-xl leading-none font-medium capitalize">
          {step_titles[currentStep]}
        </h2>
        <span className="text-xs text-muted-foreground">
          {currentStep + 1} / {total_steps}
        </span>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="min-h-[400px]">
          {currentStep === 0 && (
            <FieldGroup>
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
                      <FieldLabel htmlFor="name">Name *</FieldLabel>
                      <Input
                        id="name"
                        type="text"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="My Awesome product"
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
                        placeholder="Tell us about your product..."
                      />
                      <FieldDescription className="text-xs">
                        50-1000 characters
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          )}

          {currentStep === 1 && (
            <FieldGroup>
              <form.Field
                name="platforms"
                validators={{
                  onChange: productSchema.shape.platforms,
                }}
              >
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  const platformOptions: Array<{
                    value: Platform;
                    label: string;
                  }> = [
                    { value: "web", label: "Web" },
                    { value: "ios", label: "iOS" },
                    { value: "android", label: "Android" },
                    { value: "desktop", label: "Desktop" },
                    { value: "api", label: "API" },
                    { value: "browser_extension", label: "Browser Extension" },
                  ];

                  const togglePlatform = (platform: Platform) => {
                    const current = field.state.value;
                    if (current.includes(platform)) {
                      field.handleChange(
                        current.filter((p: Platform) => p !== platform),
                      );
                    } else {
                      field.handleChange([...current, platform]);
                    }
                  };

                  return (
                    <Field>
                      <FieldLabel>Platforms *</FieldLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {platformOptions.map((option) => (
                          <Label
                            key={option.value}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Input
                              type="checkbox"
                              checked={field.state.value.includes(option.value)}
                              onChange={() => togglePlatform(option.value)}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">{option.label}</span>
                          </Label>
                        ))}
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field
                name="pricing_model"
                validators={{
                  onChange: productSchema.shape.pricing_model,
                }}
              >
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  const pricingOptions: Array<{
                    id: PricingModel;
                    title: string;
                    description: string;
                  }> = [
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
                  ];

                  return (
                    <FieldSet>
                      <FieldLegend>Pricing Model *</FieldLegend>
                      <RadioGroup
                        name={field.name}
                        value={field.state.value}
                        onValueChange={(value) =>
                          field.handleChange(value as PricingModel)
                        }
                      >
                        {pricingOptions.map((option) => (
                          <FieldLabel
                            key={option.id}
                            htmlFor={`pricing-${option.id}`}
                            className="has-[>[data-slot=field]]:!rounded-xl"
                          >
                            <Field
                              orientation="horizontal"
                              className="rounded-xl"
                              data-invalid={isInvalid}
                            >
                              <FieldContent>
                                <FieldTitle>{option.title}</FieldTitle>
                                <FieldDescription className="text-xs">
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
                      <ProductTagsSelector
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
            </FieldGroup>
          )}

          {currentStep === 2 && (
            <FieldGroup>
              <form.Field
                name="techstack"
                validators={{
                  onChange: ({ value }) => {
                    if (Array.isArray(value) && value.length > 10) {
                      return { message: "Maximum 10 technologies allowed" };
                    }
                    return undefined;
                  },
                }}
              >
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel>Technologies Used</FieldLabel>
                      <TechStackSelector
                        selected={field.state.value || []}
                        onChange={(tech) => field.handleChange(tech)}
                        maxTech={10}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          )}

          {currentStep === 3 && (
            <FieldGroup>
              <form.Field name="logo_file">
                {(field) => {
                  return (
                    <Field>
                      <FieldLabel>Logo</FieldLabel>
                      <LogoUpload
                        value={field.state.value as unknown as File | null}
                        onChange={(file) => {
                          (
                            field.handleChange as unknown as (
                              value: File | null,
                            ) => void
                          )(file);
                          if (file) {
                            setRemoveLogo(false);
                          }
                        }}
                        existingLogoUrl={
                          existingLogoUrl && !removeLogo
                            ? existingLogoUrl
                            : undefined
                        }
                        onExistingLogoRemove={() => {
                          setRemoveLogo(true);
                          (
                            field.handleChange as unknown as (
                              value: File | null,
                            ) => void
                          )(null);
                        }}
                        disabled={isSubmitting}
                      />
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="logo_url">
                {(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor="logo_url">
                        Or use a Logo URL
                      </FieldLabel>
                      <Input
                        id="logo_url"
                        type="url"
                        value={field.state.value || ""}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="https://example.com/logo.png"
                        disabled={isSubmitting}
                      />
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="image_files">
                {(field) => {
                  return (
                    <Field>
                      <FieldLabel>Product Images</FieldLabel>
                      <ImagesUpload
                        value={field.state.value as unknown as File[]}
                        onChange={(files) =>
                          (
                            field.handleChange as unknown as (
                              value: File[],
                            ) => void
                          )(files)
                        }
                        existingImages={keptExistingImages}
                        onExistingImagesChange={(images) => {
                          setKeptExistingImages(images);
                          const deleted = existingImages.filter(
                            (url) => !images.includes(url),
                          );
                          setImagesToDelete(deleted);
                        }}
                        disabled={isSubmitting}
                      />
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="demo_url">
                {(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor="demo_url">
                        Demo Video URL (YouTube)
                      </FieldLabel>
                      <Input
                        id="demo_url"
                        type="url"
                        value={field.state.value || ""}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        disabled={isSubmitting}
                      />
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          )}

          {currentStep === 4 && (
            <FieldGroup>
              <form.Field name="twitter_url">
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
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="https://twitter.com/yourhandle"
                      />
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="linkedin_url">
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
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="https://linkedin.com/company/yourcompany"
                      />
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="instagram_url">
                {(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor="instagram_url">
                        Instagram URL
                      </FieldLabel>
                      <Input
                        id="instagram_url"
                        type="url"
                        value={field.state.value || ""}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="https://instagram.com/yourhandle"
                      />
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="repo_url">
                {(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor="repo_url">
                        Repository URL (optional)
                      </FieldLabel>
                      <Input
                        id="repo_url"
                        type="url"
                        value={field.state.value || ""}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="https://github.com/username/repo"
                      />
                      <FieldDescription className="text-xs">
                        Add if your product is open source
                      </FieldDescription>
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          )}
        </div>

        <div className="flex mt-8 items-center justify-between">
          <div>
            {onCancel && (
              <Button
                type="button"
                variant="secondary"
                size="xs"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={handlePrevious}
              disabled={currentStep === 0 || isSubmitting}
            >
              Previous
            </Button>

            {currentStep < total_steps - 1 ? (
              <Button
                type="button"
                size="xs"
                onClick={(e) => {
                  e.preventDefault();
                  handleNext();
                }}
                disabled={isSubmitting || hasStepErrors()}
              >
                Next
              </Button>
            ) : (
              <Button type="submit" size="xs" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : submitButtonText}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
