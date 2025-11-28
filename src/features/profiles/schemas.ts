import z from "zod";

export const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long").optional(),
  bio: z.string().max(500, "Bio is too long").optional().or(z.literal("")),
  avatar_url: z.url("Invalid URL").optional().or(z.literal("")),
  twitter: z.url("Invalid URL").optional().or(z.literal("")),
  website: z.url("Invalid URL").optional().or(z.literal("")),
});
