'use client'

import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { productSchema } from '../schemas'
import { LabelSelector } from './label-selector'

interface ProductFormProps {
  onSubmit: (data: z.infer<typeof productSchema>) => Promise<void>
  defaultValues?: Partial<z.infer<typeof productSchema>>
  isSubmitting?: boolean
}

export function ProductForm({ onSubmit, defaultValues, isSubmitting }: ProductFormProps) {

  const form = useForm({
    defaultValues: {
      name: defaultValues?.name || '',
      tagline: defaultValues?.tagline || '',
      website_url: defaultValues?.website_url || '',
      repo_url: defaultValues?.repo_url,
      is_open_source: !!defaultValues?.repo_url || false,
      description: defaultValues?.description || '',
      tags: defaultValues?.tags || [],
      logo_url: defaultValues?.logo_url,
      demo_url: defaultValues?.demo_url,
      pricing_model: defaultValues?.pricing_model || 'free',
      promo_code: defaultValues?.promo_code,
      twitter_url: defaultValues?.twitter_url,
      linkedin_url: defaultValues?.linkedin_url,
      product_hunt_url: defaultValues?.product_hunt_url,
      platforms: defaultValues?.platforms || ['web'],
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })


  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.Field
          name="name"
          validators={{
            onChange: productSchema.shape.name,
          }}
        >
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field>
                <FieldLabel htmlFor="name">
                  Name of the Launch *
                </FieldLabel>
                <input
                  id="name"
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full border px-3 py-2"
                  aria-invalid={isInvalid}
                  placeholder="My Awesome SaaS"
                />
                <FieldDescription>
                  The name of your product
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field
          name="tagline"
          validators={{
            onChange: productSchema.shape.tagline,
          }}
        >
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field>
                <FieldLabel htmlFor="tagline">
                  Tagline *
                </FieldLabel>
                <input
                  id="tagline"
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full border px-3 py-2"
                  aria-invalid={isInvalid}
                  placeholder="The best way to manage your tasks"
                />
                <FieldDescription>
                  A short, catchy description
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field
          name="website_url"
          validators={{
            onChange: productSchema.shape.website_url,
          }}
        >
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field>
                <FieldLabel htmlFor="website_url">
                  Website URL *
                </FieldLabel>
                <input
                  id="website_url"
                  type="url"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full border px-3 py-2"
                  aria-invalid={isInvalid}
                  placeholder="https://example.com"
                />
                <FieldDescription>
                  Link to your product website
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field
          name="platforms"
          validators={{
            onChange: productSchema.shape.platforms,
          }}
        >
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            const platformOptions = [
              { value: 'web', label: 'Web' },
              { value: 'ios', label: 'iOS' },
              { value: 'android', label: 'Android' },
              { value: 'desktop', label: 'Desktop' },
              { value: 'api', label: 'API' },
              { value: 'browser_extension', label: 'Browser Extension' },
            ]

            const togglePlatform = (platform: string) => {
              const current = field.state.value
              if (current.includes(platform as any)) {
                field.handleChange(current.filter((p) => p !== platform))
              } else {
                field.handleChange([...current, platform as any])
              }
            }

            return (
              <Field>
                <FieldLabel>
                  Platform Availability *
                </FieldLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {platformOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={field.state.value.includes(option.value as any)}
                        onChange={() => togglePlatform(option.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
                <FieldDescription>
                  Select all platforms where your product is available
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="is_open_source">
          {(field) => {
            return (
              <>
                <Field orientation="horizontal">
                  <input
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
                      onChangeListenTo: ['is_open_source'],
                      onChange: productSchema.shape.repo_url,
                    }}
                  >
                    {(repoField) => {
                      const isInvalid = repoField.state.meta.isTouched && !repoField.state.meta.isValid
                      return (
                        <Field>
                          <FieldLabel htmlFor="repo_url">
                            Repository URL *
                          </FieldLabel>
                          <input
                            id="repo_url"
                            type="url"
                            value={repoField.state.value || ''}
                            onBlur={repoField.handleBlur}
                            onChange={(e) => repoField.handleChange(e.target.value || undefined)}
                            className="w-full border px-3 py-2"
                            aria-invalid={isInvalid}
                            placeholder="https://github.com/username/repo"
                          />
                          <FieldDescription>
                            Link to your GitHub/GitLab repository
                          </FieldDescription>
                          {isInvalid && <FieldError errors={repoField.state.meta.errors} />}
                        </Field>
                      )
                    }}
                  </form.Field>
                )}
              </>
            )
          }}
        </form.Field>

        <form.Field
          name="description"
          validators={{
            onChange: productSchema.shape.description,
          }}
        >
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field>
                <FieldLabel htmlFor="description">
                  Description *
                </FieldLabel>
                <textarea
                  id="description"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full border px-3 py-2 min-h-[120px]"
                  aria-invalid={isInvalid}
                  placeholder="Tell us about your product, its features, and what makes it unique..."
                />
                <FieldDescription>
                  Detailed description (50-1000 characters)
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field
          name="tags"
          validators={{
            onChange: productSchema.shape.tags,
          }}
        >
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field>
                <FieldLabel>
                  Launch Tags * (up to 3)
                </FieldLabel>
                <LabelSelector
                  selectedTags={field.state.value}
                  onTagsChange={(tags) => field.handleChange(tags)}
                  maxTags={3}
                />
                <FieldDescription>
                  Select up to 3 tags to help people find your product
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field
          name="logo_url"
          validators={{
            onChange: productSchema.shape.logo_url,
          }}
        >
          {(field) => {
            return (
              <Field>
                <FieldLabel htmlFor="logo_url">
                  Logo
                </FieldLabel>
                <div className="space-y-4">
                  <div>
                    <input
                      id="logo_url"
                      type="url"
                      value={field.state.value || ''}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value || undefined)}
                      className="w-full border px-3 py-2"
                      placeholder="https://example.com/logo.png"
                    />
                    <FieldDescription>
                      Direct link to your product logo
                    </FieldDescription>
                  </div>
                  
                  <div className="border p-4">
                    <p className="text-sm mb-2">Or upload a logo:</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          // TODO: Upload to Supabase Storage
                          console.log('Logo file selected:', file.name)
                          // For now, just show a placeholder
                          alert('File upload coming soon! For now, please use a URL.')
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
            )
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
                <input
                  id="demo_url"
                  type="url"
                  value={field.state.value || ''}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value || undefined)}
                  className="w-full border px-3 py-2"
                  placeholder="https://loom.com/share/..."
                />
                <FieldDescription>
                  Link to a Loom or YouTube demo video
                </FieldDescription>
              </Field>
            )
          }}
        </form.Field>

        <form.Field
          name="pricing_model"
          validators={{
            onChange: productSchema.shape.pricing_model,
          }}
        >
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field>
                <FieldLabel htmlFor="pricing_model">
                  Pricing Model *
                </FieldLabel>
                <select
                  id="pricing_model"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value as 'free' | 'freemium' | 'premium')}
                  className="w-full border px-3 py-2"
                  aria-invalid={isInvalid}
                >
                  <option value="free">Free</option>
                  <option value="freemium">Freemium</option>
                  <option value="premium">Premium</option>
                </select>
                <FieldDescription>
                  How do you monetize your product?
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
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
                <FieldLabel htmlFor="promo_code">
                  Promo Code
                </FieldLabel>
                <input
                  id="promo_code"
                  type="text"
                  value={field.state.value || ''}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value || undefined)}
                  className="w-full border px-3 py-2"
                  placeholder="SUMMER2024"
                />
                <FieldDescription>
                  Optional promo code for early users
                </FieldDescription>
              </Field>
            )
          }}
        </form.Field>

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
                  <input
                    id="twitter_url"
                    type="url"
                    value={field.state.value || ''}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value || undefined)}
                    className="w-full border px-3 py-2"
                    placeholder="https://twitter.com/yourhandle"
                  />
                  <FieldDescription>
                    Your Twitter/X profile or product account
                  </FieldDescription>
                </Field>
              )
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
                  <input
                    id="linkedin_url"
                    type="url"
                    value={field.state.value || ''}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value || undefined)}
                    className="w-full border px-3 py-2"
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                  <FieldDescription>
                    Your LinkedIn company or profile page
                  </FieldDescription>
                </Field>
              )
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
                  <input
                    id="product_hunt_url"
                    type="url"
                    value={field.state.value || ''}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value || undefined)}
                    className="w-full border px-3 py-2"
                    placeholder="https://producthunt.com/posts/yourproduct"
                  />
                  <FieldDescription>
                    Link to your Product Hunt launch (if applicable)
                  </FieldDescription>
                </Field>
              )
            }}
          </form.Field>
        </div>
      </FieldGroup>

      <div className="mt-8 flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="border px-6 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Product'}
        </button>
      </div>
    </form>
  )
}

