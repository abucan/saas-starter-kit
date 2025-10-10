import type { R } from './result';

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

export type UserId = string;
export type TeamId = string;
export type ProjectId = string;
export type EnvironmentId = string;
export type SecretId = string;
export type InvitationId = string;

export type PaginationParams = {
  page: number;
  pageSize: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export type Timestamps = {
  createdAt: Date;
  updatedAt: Date;
};

export type ActionResponse<T = void> = Promise<R<T>>;

export type FormState<T = void> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
};
