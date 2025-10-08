import { eq, and, desc, count } from 'drizzle-orm';
import { db } from '@/lib/db';
import { organization, member, invitation } from '@/lib/db/schemas/auth.schema';
import type {
  Organization,
  NewOrganization,
  Member,
  NewMember,
  Invitation,
  NewInvitation,
} from '@/lib/db/schemas/auth.schema';

/**
 * Team/Organization repository for database operations
 */
export const teamRepository = {
  // ========================================
  // ORGANIZATION METHODS
  // ========================================

  /**
   * Find organization by ID
   * @param id - Organization ID
   * @returns Organization object or undefined if not found
   */
  async findById(id: string): Promise<Organization | undefined> {
    return await db.query.organization.findFirst({
      where: eq(organization.id, id),
    });
  },

  /**
   * Find organization by slug
   * @param slug - Organization slug
   * @returns Organization object or undefined if not found
   */
  async findBySlug(slug: string): Promise<Organization | undefined> {
    return await db.query.organization.findFirst({
      where: eq(organization.slug, slug),
    });
  },

  /**
   * Find all organizations for a user
   * @param userId - User ID
   * @returns Array of organizations
   */
  async findByUserId(userId: string): Promise<Organization[]> {
    const members = await db.query.member.findMany({
      where: eq(member.userId, userId),
      with: {
        organization: true,
      },
    });
    return members.map((m) => m.organization);
  },

  /**
   * Create a new organization
   * @param data - New organization data
   * @returns Created organization object
   */
  async create(data: NewOrganization): Promise<Organization> {
    const [created] = await db.insert(organization).values(data).returning();
    return created as Organization;
  },

  /**
   * Update organization by ID
   * @param id - Organization ID
   * @param data - Partial organization data to update
   * @returns Updated organization object
   */
  async update(id: string, data: Partial<Organization>): Promise<Organization> {
    const [updated] = await db
      .update(organization)
      .set(data)
      .where(eq(organization.id, id))
      .returning();
    return updated as Organization;
  },

  /**
   * Delete organization by ID (cascades to members and invitations)
   * @param id - Organization ID
   */
  async delete(id: string): Promise<void> {
    await db.delete(organization).where(eq(organization.id, id));
  },

  // ========================================
  // MEMBER METHODS
  // ========================================

  /**
   * Get all members of an organization
   * @param orgId - Organization ID
   * @returns Array of members
   */
  async findMembersByOrgId(orgId: string): Promise<Member[]> {
    return await db.query.member.findMany({
      where: eq(member.organizationId, orgId),
      orderBy: [desc(member.createdAt)],
    });
  },

  /**
   * Find specific member by user and organization
   * @param userId - User ID
   * @param orgId - Organization ID
   * @returns Member object or undefined if not found
   */
  async findMemberByUserAndOrg(
    userId: string,
    orgId: string
  ): Promise<Member | undefined> {
    return await db.query.member.findFirst({
      where: and(eq(member.userId, userId), eq(member.organizationId, orgId)),
    });
  },

  /**
   * Add member to organization
   * @param data - New member data
   * @returns Created member object
   */
  async addMember(data: NewMember): Promise<Member> {
    const [created] = await db.insert(member).values(data).returning();
    return created as Member;
  },

  /**
   * Update member role
   * @param memberId - Member ID
   * @param role - New role
   * @returns Updated member object
   */
  async updateMemberRole(memberId: string, role: string): Promise<Member> {
    const [updated] = await db
      .update(member)
      .set({ role })
      .where(eq(member.id, memberId))
      .returning();
    return updated as Member;
  },

  /**
   * Remove member from organization
   * @param memberId - Member ID
   */
  async removeMember(memberId: string): Promise<void> {
    await db.delete(member).where(eq(member.id, memberId));
  },

  /**
   * Count owners in organization
   * @param orgId - Organization ID
   * @returns Number of owners
   */
  async countOwners(orgId: string): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(member)
      .where(and(eq(member.organizationId, orgId), eq(member.role, 'owner')));
    return result[0]?.count ?? 0;
  },

  // ========================================
  // INVITATION METHODS
  // ========================================

  /**
   * Get all invitations for organization
   * @param orgId - Organization ID
   * @returns Array of invitations
   */
  async findInvitationsByOrgId(orgId: string): Promise<Invitation[]> {
    return await db.query.invitation.findMany({
      where: eq(invitation.organizationId, orgId),
      orderBy: [desc(invitation.expiresAt)],
    });
  },

  /**
   * Find invitation by ID
   * @param id - Invitation ID
   * @returns Invitation object or undefined if not found
   */
  async findInvitationById(id: string): Promise<Invitation | undefined> {
    return await db.query.invitation.findFirst({
      where: eq(invitation.id, id),
    });
  },

  /**
   * Create invitation
   * @param data - New invitation data
   * @returns Created invitation object
   */
  async createInvitation(data: NewInvitation): Promise<Invitation> {
    const [created] = await db.insert(invitation).values(data).returning();
    return created as Invitation;
  },

  /**
   * Update invitation status
   * @param id - Invitation ID
   * @param status - New status
   * @returns Updated invitation object
   */
  async updateInvitationStatus(
    id: string,
    status: string
  ): Promise<Invitation> {
    const [updated] = await db
      .update(invitation)
      .set({ status })
      .where(eq(invitation.id, id))
      .returning();
    return updated as Invitation;
  },

  /**
   * Delete invitation
   * @param id - Invitation ID
   */
  async deleteInvitation(id: string): Promise<void> {
    await db.delete(invitation).where(eq(invitation.id, id));
  },

  // ========================================
  // COMPLEX QUERIES
  // ========================================

  /**
   * Get organization with all members (including user details)
   * @param orgId - Organization ID
   * @returns Organization with members array
   */
  async getOrganizationWithMembers(orgId: string) {
    return await db.query.organization.findFirst({
      where: eq(organization.id, orgId),
      with: {
        members: {
          with: {
            user: true,
          },
        },
      },
    });
  },

  /**
   * Get user's organizations with their role
   * @param userId - User ID
   * @returns Array of organizations with member role
   */
  async getUserOrganizationsWithRole(userId: string) {
    return await db.query.member.findMany({
      where: eq(member.userId, userId),
      with: {
        organization: true,
      },
      orderBy: [desc(member.createdAt)],
    });
  },
};
