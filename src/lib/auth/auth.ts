import 'server-only';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { emailOTP, organization } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schemas/auth.schema';
import { AppError, ERROR_CODES } from '@/lib/errors';
import { eq } from 'drizzle-orm';
import { OTP_EXPIRY_SECONDS, OTP_LENGTH } from '../utils';
// import { cookies } from 'next/headers';

export const bAuth = betterAuth({
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
      sendVerificationOTP: async ({}) => {
        // await sendOTPEmail(email, otp);
      },
    }),

    organization({
      requireEmailVerificationOnInvitation: true,
      sendInvitationEmail: async ({}) => {
        // const acceptUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invitation/${invitationId}`;
        // await sendInvitationEmail({});
      },
      organizationDeletion: {
        afterDelete: async ({ user }) => {
          const personalSlug = `pw-${user.id}`;
          const personalOrg = await bAuth.api.checkOrganizationSlug({
            body: {
              slug: personalSlug,
            },
          });

          if (personalOrg) {
            await bAuth.api.setActiveOrganization({
              body: {
                organizationSlug: personalSlug,
              },
            });
          }
        },
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
                await bAuth.api.createOrganization({
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
      beforeDelete: async (user) => {
        const organizations = await bAuth.api.listOrganizations({
          query: {
            userId: user.id,
          },
        });

        for (const org of organizations) {
          const metadata = org.metadata as { isPersonal?: boolean } | null;
          if (metadata?.isPersonal) continue;

          const members = await bAuth.api.listMembers({
            query: {
              organizationId: org.id,
            },
          });
          const owners = members.members.filter((m) => m.role === 'owner');

          if (owners.length === 1 && owners[0]?.userId === user.id) {
            throw new AppError(
              ERROR_CODES.FORBIDDEN,
              `Cannot delete account. You are the only owner of "${org.name}". Transfer ownership or delete the organization first.`,
              403
            );
          }
        }
      },
      afterDelete: async ({}) => {
        // TODO: Enable this later if needed
        /*
        try {
          ;(await cookies()).delete(SESSION_COOKIE_NAME)
        } catch (error: unknown) {
          console.error('Error during post-delete cleanup:', error)
        }
        */
      },
    },
  },
});

export type Session = typeof bAuth.$Infer.Session;
export type User = typeof bAuth.$Infer.Session.user;
export type Organization = typeof bAuth.$Infer.Organization;
export type Member = typeof bAuth.$Infer.Member;
