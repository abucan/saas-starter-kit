import { z } from 'zod';

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters')
    .transform((val) => val.trim()),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(50, 'Slug must be less than 50 characters')
    .transform((val) => val.trim().toLowerCase())
    .refine(
      (val) => SLUG_REGEX.test(val),
      'Slug can only contain lowercase letters, numbers, and hyphens'
    )
    .refine(
      (val) => !val.startsWith('pw-'),
      'Slug cannot start with "pw-" (reserved for personal workspaces)'
    ),
});

export const updateWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, 'Name must be at least 1 character')
    .max(50, 'Name must be less than 50 characters')
    .transform((val) => val.trim())
    .optional(),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(50, 'Slug must be less than 50 characters')
    .transform((val) => val.trim().toLowerCase())
    .refine(
      (val) => SLUG_REGEX.test(val),
      'Slug can only contain lowercase letters, numbers, and hyphens'
    )
    .refine(
      (val) => !val.startsWith('pw-'),
      'Slug cannot start with "pw-" (reserved for personal workspaces)'
    )
    .optional(),
  logo: z
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('').transform(() => undefined))
    .or(z.null()),
  defaultRole: z.enum(['owner', 'admin', 'member']).optional(),
});

export const switchWorkspaceSchema = z.object({
  workspaceId: z.string().min(1, 'Workspace ID is required'),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
export type SwitchWorkspaceInput = z.infer<typeof switchWorkspaceSchema>;
