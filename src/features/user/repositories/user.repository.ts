import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { user } from '@/lib/db/schemas/auth.schema';
import type { User, NewUser } from '@/lib/db/schemas/auth.schema';

export const userRepository = {
  /**
   * Find user by ID
   * @param id - User ID
   * @returns User object or undefined if not found
   */
  async findById(id: string): Promise<User | undefined> {
    return await db.query.user.findFirst({
      where: eq(user.id, id),
    });
  },

  /**
   * Find user by email
   * @param email - User email address
   * @returns User object or undefined if not found
   */
  async findByEmail(email: string): Promise<User | undefined> {
    return await db.query.user.findFirst({
      where: eq(user.email, email),
    });
  },

  /**
   * Create a new user
   * @param data - New user data
   * @returns Created user object
   */
  async create(data: NewUser): Promise<User> {
    const [created] = await db.insert(user).values(data).returning();
    return created as User;
  },

  /**
   * Update user by ID
   * @param id - User ID
   * @param data - Partial user data to update
   * @returns Updated user object
   */
  async update(id: string, data: Partial<User>): Promise<User> {
    const [updated] = await db
      .update(user)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(user.id, id))
      .returning();
    return updated as User;
  },

  /**
   * Delete user by ID
   * @param id - User ID
   */
  async delete(id: string): Promise<void> {
    await db.delete(user).where(eq(user.id, id));
  },

  /**
   * Update user avatar image
   * @param id - User ID
   * @param imageUrl - New image URL
   * @returns Updated user object
   */
  async updateImage(id: string, imageUrl: string): Promise<User> {
    const [updated] = await db
      .update(user)
      .set({ image: imageUrl, updatedAt: new Date() })
      .where(eq(user.id, id))
      .returning();
    return updated as User;
  },

  /**
   * Update user name
   * @param id - User ID
   * @param name - New name
   * @returns Updated user object
   */
  async updateName(id: string, name: string): Promise<User> {
    const [updated] = await db
      .update(user)
      .set({ name, updatedAt: new Date() })
      .where(eq(user.id, id))
      .returning();
    return updated as User;
  },
};
