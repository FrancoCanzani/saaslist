import z from "zod";

export const feedbackSchema = z.object({
  message: z
    .string()
    .min(10, "Feedback must be at least 10 characters")
    .max(1000, "Feedback must be less than 1000 characters"),
});

export type Feedback = z.infer<typeof feedbackSchema>;

