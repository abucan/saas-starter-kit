import { z } from 'zod';

export const inviteMemberSchema = z.object({
  email: z.email('Please provide a valid email address').trim(),
  role: z.enum(['owner', 'admin', 'member']),
});

export const resendInvitationSchema = z.object({
  email: z.email('Please provide a valid email address').trim(),
  role: z.enum(['owner', 'admin', 'member']),
});

export const cancelInvitationSchema = z.object({
  invitationId: z.string().min(1, 'Invitation ID is required'),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type ResendInvitationInput = z.infer<typeof resendInvitationSchema>;
export type CancelInvitationInput = z.infer<typeof cancelInvitationSchema>;
