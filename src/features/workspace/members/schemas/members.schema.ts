import { z } from 'zod';

export const updateMemberRoleSchema = z.object({
  memberId: z.string().min(1, 'Member ID is required'),
  role: z.enum(['owner', 'admin', 'member']),
});

export const removeMemberSchema = z.object({
  memberId: z.string().min(1, 'Member ID is required'),
});

export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
export type RemoveMemberInput = z.infer<typeof removeMemberSchema>;
