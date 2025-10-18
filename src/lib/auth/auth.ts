import { headers } from 'next/headers';
import { stripe } from '@better-auth/stripe';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { emailOTP, organization } from 'better-auth/plugins';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

import { db } from '@/lib/db';
import * as schema from '@/lib/db/schemas/auth.schema';
import { AppError, ERROR_CODES } from '@/lib/errors';

import {
  sendDeleteAccountVerification,
  sendOTPEmail,
  sendWorkspaceInviteEmail,
} from '../email/service';
import {
  isPersonalOrganization,
  isSoleOwner,
  OTP_EXPIRY_SECONDS,
  OTP_LENGTH,
} from '../utils';

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema,
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
    expiresIn: 60 * 60 * 24 * 7,
  },
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      prompt: 'select_account consent',
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      prompt: 'select_account consent',
    },
  },
  plugins: [
    emailOTP({
      otpLength: OTP_LENGTH,
      expiresIn: OTP_EXPIRY_SECONDS,
      sendVerificationOnSignUp: true,
      allowedAttempts: 3,
      sendVerificationOTP: async ({ email, otp }) => {
        await sendOTPEmail({ email, otp, type: 'sign-in' });
      },
    }),
    organization({
      requireEmailVerificationOnInvitation: true,
      sendInvitationEmail: async ({ invitation, organization, inviter }) => {
        const acceptUrl = `${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation/${invitation.id}`;
        await sendWorkspaceInviteEmail({
          email: invitation.email,
          teamName: organization.name,
          acceptUrl,
          inviterName: inviter?.user?.name || inviter?.user?.email,
        });
      },
      organizationDeletion: {
        afterDelete: async ({ user }) => {
          const personalSlug = `pw-${user.id}`;
          const personalOrg = await auth.api.checkOrganizationSlug({
            body: {
              slug: personalSlug,
            },
          });

          if (personalOrg) {
            await auth.api.setActiveOrganization({
              body: {
                organizationSlug: personalSlug,
              },
            });
          }
        },
      },
    }),
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: [
          {
            name: 'starter',
            priceId: process.env.STRIPE_PRICE_STARTER_MONTHLY!,
            annualDiscountPriceId: process.env.STRIPE_PRICE_STARTER_YEARLY!,
            limits: {
              workspaces: 2,
            },
            group: 'paid',
          },
          {
            name: 'pro',
            priceId: process.env.STRIPE_PRICE_PRO_MONTHLY!,
            annualDiscountPriceId: process.env.STRIPE_PRICE_PRO_YEARLY!,
            limits: {
              workspaces: 5,
            },
            group: 'paid',
          },
        ],
      },
    }),
    nextCookies(),
  ],
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const personalSlug = `pw-${session.userId}`;

          const personalOrg = await db.query.organization.findFirst({
            where: eq(schema.organization.slug, personalSlug),
            columns: { id: true, slug: true },
          });

          return {
            data: {
              ...session,
              activeOrganizationId: personalOrg?.id,
            },
          };
        },
      },
    },
    user: {
      create: {
        after: async (user) => {
          let slug = `pw-${user.id}`;
          let attempts = 0;
          const maxAttempts = 3;

          while (attempts < maxAttempts) {
            try {
              const existing = await db.query.organization.findFirst({
                where: eq(schema.organization.slug, slug),
                columns: { id: true, slug: true },
              });

              if (!existing?.id || !existing?.slug) {
                await auth.api.createOrganization({
                  body: {
                    name: 'Personal Workspace',
                    slug,
                    userId: user.id,
                    metadata: { isPersonal: true, default_role: 'member' },
                  },
                });
                break;
              } else {
                const random = Math.floor(1000 + Math.random() * 9000);
                slug = `pw-${user.id}-${random}`;
                attempts++;
              }
            } catch {
              if (attempts >= maxAttempts - 1) {
                throw new AppError(
                  ERROR_CODES.INTERNAL_ERROR,
                  'Failed to create personal workspace',
                  500
                );
              }
              attempts++;
            }
          }
        },
      },
    },
  },
  user: {
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, token, url }) => {
        await sendDeleteAccountVerification({
          user,
          url,
          token,
        });
      },
      beforeDelete: async (user) => {
        const organizations = await auth.api.listOrganizations({
          headers: await headers(),
          query: { userId: user.id },
        });

        for (const org of organizations) {
          if (isPersonalOrganization(org as { metadata: unknown })) {
            await auth.api.deleteOrganization({
              headers: await headers(),
              body: { organizationId: org.id },
            });
            continue;
          }

          const members = await auth.api.listMembers({
            headers: await headers(),
            query: { organizationId: org.id },
          });

          if (isSoleOwner(members.members, user.id)) {
            throw new AppError(
              ERROR_CODES.FORBIDDEN,
              `Cannot delete account. You are the only owner of "${org.name}". Transfer ownership or delete the organization first.`,
              403
            );
          }
        }
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
export type Organization = typeof auth.$Infer.Organization;
export type Member = typeof auth.$Infer.Member;
