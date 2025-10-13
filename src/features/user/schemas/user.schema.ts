import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name must be at least 1 character')
    .max(100, 'Name must be less than 100 characters')
    .transform((val) => val.trim())
    .optional(),
  image: z
    .string()
    .url('Must be a valid URL')
    .refine((url) => url.startsWith('https://'), 'Image must use HTTPS')
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
