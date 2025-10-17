# Database Documentation

## Overview

Keyvaultify uses **Drizzle ORM** with **SQLite** (development) and **Turso** (production) for database management. The database is organized into feature-based schemas with type-safe repositories.

## Schema Structure

### Authentication Schema (`auth-schema.ts`)

Located at: `src/db/schemas/auth-schema.ts`

#### Tables

**user**

- Primary user account table
- Fields: `id`, `name`, `email`, `emailVerified`, `image`, `createdAt`, `updatedAt`
- Indexes: `email`

**session**

- User session management (Better Auth)
- Fields: `id`, `expiresAt`, `token`, `createdAt`, `updatedAt`, `ipAddress`, `userAgent`, `userId`, `activeOrganizationId`
- Indexes: `userId`, `token`
- Foreign Keys: `userId` → `user.id` (cascade delete)

**account**

- OAuth provider accounts
- Fields: `id`, `accountId`, `providerId`, `userId`, `accessToken`, `refreshToken`, `idToken`, `accessTokenExpiresAt`, `refreshTokenExpiresAt`, `scope`, `password`, `createdAt`, `updatedAt`
- Indexes: `userId`
- Foreign Keys: `userId` → `user.id` (cascade delete)

**verification**

- Email verification and password reset codes
- Fields: `id`, `identifier`, `value`, `expiresAt`, `createdAt`, `updatedAt`

**organization**

- Multi-tenant organizations/teams
- Fields: `id`, `name`, `slug`, `logo`, `createdAt`, `metadata`
- Unique: `slug`

**member**

- Organization membership and roles
- Fields: `id`, `organizationId`, `userId`, `role`, `createdAt`
- Indexes: `organizationId`, `userId`
- Foreign Keys:
  - `organizationId` → `organization.id` (cascade delete)
  - `userId` → `user.id` (cascade delete)

**invitation**

- Team invitations
- Fields: `id`, `organizationId`, `email`, `role`, `status`, `expiresAt`, `inviterId`
- Indexes: `organizationId`, `email`
- Foreign Keys:
  - `organizationId` → `organization.id` (cascade delete)
  - `inviterId` → `user.id` (cascade delete)

### Subscription Schema (`subscription-schema.ts`)

Located at: `src/db/schemas/subscription-schema.ts`

#### Tables

**stripe_customers**

- Stripe customer records linked to organizations
- Fields: `organizationId` (PK), `stripeCustomerId`, `createdAt`, `updatedAt`
- Indexes: `stripeCustomerId`
- Unique: `stripeCustomerId`

**subscriptions**

- Subscription and payment records
- Fields: `id`, `organizationId`, `stripeSubscriptionId`, `stripeCustomerId`, `status`, `mode`, `stripePriceId`, `stripeProductId`, `quantity`, `currency`, `unitAmount`, `currentPeriodStart`, `currentPeriodEnd`, `cancelAt`, `cancelAtPeriodEnd`, `createdAt`, `updatedAt`
- Indexes: `organizationId`, `stripeSubscriptionId`, `stripeCustomerId`, `status`
- Unique: `stripeSubscriptionId`

## Relations

Drizzle relations enable type-safe `.with()` queries:

```typescript
// User has many sessions, accounts, members, invitations
userRelations: (sessions, accounts, members, invitations);

// Member belongs to user and organization
memberRelations: (user, organization);

// Organization has many members and invitations
organizationRelations: (members, invitations);

// Invitation belongs to organization and inviter (user)
invitationRelations: (organization, inviter);
```

## Available Repositories

### User Repository (`features/user/repositories/user.repository.ts`)

**Methods:**

- `findById(id: string)` - Find user by ID
- `findByEmail(email: string)` - Find user by email
- `create(data: NewUser)` - Create new user
- `update(id: string, data: Partial<User>)` - Update user
- `delete(id: string)` - Delete user
- `updateImage(id: string, imageUrl: string)` - Update user avatar
- `updateName(id: string, name: string)` - Update user name

**Example:**

```typescript
import { userRepository } from '@/features/user/repositories/user.repository';

// Find user
const user = await userRepository.findByEmail('user@example.com');

// Update user
await userRepository.updateName(userId, 'John Doe');
```

### Team Repository (`features/team/repositories/team.repository.ts`)

**Organization Methods:**

- `findById(id: string)` - Find organization by ID
- `findBySlug(slug: string)` - Find organization by slug
- `findByUserId(userId: string)` - Find all organizations for a user
- `create(data: NewOrganization)` - Create new organization
- `update(id: string, data: Partial<Organization>)` - Update organization
- `delete(id: string)` - Delete organization

**Member Methods:**

- `findMembersByOrgId(orgId: string)` - Get all members of an organization
- `findMemberByUserAndOrg(userId: string, orgId: string)` - Find specific member
- `addMember(data: NewMember)` - Add member to organization
- `updateMemberRole(memberId: string, role: string)` - Update member role
- `removeMember(memberId: string)` - Remove member from organization
- `countOwners(orgId: string)` - Count owners in organization

**Invitation Methods:**

- `findInvitationsByOrgId(orgId: string)` - Get all invitations for organization
- `findInvitationById(id: string)` - Find invitation by ID
- `createInvitation(data: NewInvitation)` - Create invitation
- `updateInvitationStatus(id: string, status: string)` - Update invitation status
- `deleteInvitation(id: string)` - Delete invitation

**Complex Queries:**

- `getOrganizationWithMembers(orgId: string)` - Get organization with all members (JOIN)
- `getUserOrganizationsWithRole(userId: string)` - Get user's organizations with their role

**Example:**

```typescript
import { teamRepository } from '@/features/team/repositories/team.repository';

// Create organization
const org = await teamRepository.create({
  id: crypto.randomUUID(),
  name: 'Acme Corp',
  slug: 'acme-corp',
  createdAt: new Date(),
});

// Add member
await teamRepository.addMember({
  id: crypto.randomUUID(),
  organizationId: org.id,
  userId: userId,
  role: 'owner',
  createdAt: new Date(),
});

// Get organization with members
const orgWithMembers = await teamRepository.getOrganizationWithMembers(org.id);
```

### Billing Repository (`features/billing/repositories/billing.repository.ts`)

**Customer Methods:**

- `findCustomerByOrgId(orgId: string)` - Find Stripe customer by organization ID
- `findCustomerByStripeId(stripeCustomerId: string)` - Find by Stripe customer ID
- `createCustomer(data: NewStripeCustomer)` - Create customer record
- `updateCustomer(orgId: string, data: Partial<StripeCustomer>)` - Update customer

**Subscription Methods:**

- `findSubscriptionByOrgId(orgId: string)` - Find active subscription for organization
- `findSubscriptionByStripeId(stripeSubscriptionId: string)` - Find by Stripe subscription ID
- `findActiveSubscriptions()` - Find all active subscriptions
- `createSubscription(data: NewSubscription)` - Create subscription record
- `updateSubscription(id: string, data: Partial<Subscription>)` - Update subscription
- `updateSubscriptionStatus(stripeSubscriptionId: string, status: string)` - Update status
- `cancelSubscription(stripeSubscriptionId: string)` - Mark subscription as canceled
- `deleteSubscription(id: string)` - Delete subscription record

**Complex Queries:**

- `getSubscriptionWithCustomer(orgId: string)` - Get subscription with customer details
- `findExpiredSubscriptions()` - Find subscriptions past their end date

**Helper Methods:**

- `isSubscriptionActive(subscription: Subscription)` - Check if subscription is active
- `getSubscriptionEndDate(subscription: Subscription)` - Get subscription end date

**Example:**

```typescript
import { billingRepository } from '@/features/billing/repositories/billing.repository';

// Create customer
const customer = await billingRepository.createCustomer({
  organizationId: orgId,
  stripeCustomerId: 'cus_xxx',
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Check subscription status
const subscription = await billingRepository.findSubscriptionByOrgId(orgId);
const isActive = billingRepository.isSubscriptionActive(subscription);
```

## Migrations

### Generate Migration

After modifying schema files, generate a migration:

```bash
pnpm db:generate
```

This creates a new migration file in `drizzle/migrations/`

### Run Migrations

Apply pending migrations to the database:

```bash
pnpm db:migrate
```

### Push Schema (Development Only)

Push schema changes directly without creating migration files:

```bash
pnpm db:push
```

⚠️ **Warning:** Only use `db:push` in development. Always use migrations in production.

### View Database

Open Drizzle Studio to inspect your database:

```bash
pnpm db:studio
```

## Common Patterns

### Creating Records with Timestamps

```typescript
await userRepository.create({
  id: crypto.randomUUID(),
  name: 'John Doe',
  email: 'john@example.com',
  emailVerified: false,
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

### Relational Queries

```typescript
// Get organization with members
const org = await db.query.organization.findFirst({
  where: eq(organization.id, orgId),
  with: {
    members: {
      with: {
        user: true, // Include user details for each member
      },
    },
  },
});
```

### Checking Permissions

```typescript
// Check if user is owner before allowing action
const ownerCount = await teamRepository.countOwners(orgId);
if (ownerCount <= 1) {
  throw new Error('Cannot remove last owner');
}
```

### Transaction Pattern

```typescript
import { db } from '@/lib/sqlite-db';

await db.transaction(async (tx) => {
  // Create organization
  const [org] = await tx.insert(organization).values(orgData).returning();

  // Add creator as owner
  await tx.insert(member).values({
    id: crypto.randomUUID(),
    organizationId: org.id,
    userId: userId,
    role: 'owner',
    createdAt: new Date(),
  });
});
```

## Type Safety

All repositories use Drizzle's inferred types:

```typescript
import type { User, NewUser } from '@/db/schemas/auth-schema';
import type {
  Subscription,
  NewSubscription,
} from '@/db/schemas/subscription-schema';

// NewUser = Insert type (what you provide)
// User = Select type (what you get back)
```

## Best Practices

1. **Always use repositories** - Never import `db` directly in features
2. **Handle timestamps** - Always set `updatedAt` when updating records
3. **Use transactions** - For operations that modify multiple tables
4. **Index foreign keys** - Already done for performance
5. **Validate before insert** - Use Zod schemas before calling repository methods
6. **Type everything** - No `any` types, leverage Drizzle's type inference
7. **Colocate repositories** - Keep repositories in their feature folders

## Database Connection

### Development (SQLite)

```env
DATABASE_URL=./dev.db
```

### Production (Turso)

```env
DATABASE_URL=libsql://your-database.turso.io
DATABASE_AUTH_TOKEN=your-token-here
```

Connection is configured in `src/lib/sqlite-db.ts`

## Troubleshooting

### "Cannot find relation"

- Make sure relations are defined in schema files
- Check that you've imported `relations` from `drizzle-orm`

### "Migration failed"

- Check for syntax errors in schema
- Ensure foreign key references are correct
- Drop local database and re-migrate if needed (dev only)

### "Type errors in repository"

- Regenerate types: `pnpm db:generate`
- Restart TypeScript server in your editor

## Further Reading

- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Drizzle Relations](https://orm.drizzle.team/docs/rqb)
- [Better Auth Database Schema](https://www.better-auth.com/docs/concepts/database)
