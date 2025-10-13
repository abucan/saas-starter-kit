export type { User } from '@/lib/auth/auth';

export type UpdateProfileInputProps = {
  name?: string;
  image?: string;
};

export type UpdateProfileResult = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};
