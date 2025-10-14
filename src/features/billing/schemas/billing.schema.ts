import { z } from 'zod';

export const checkoutSchema = z.object({
  plan: z.enum(['starter', 'pro']),
  interval: z.enum(['monthly', 'yearly']),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
