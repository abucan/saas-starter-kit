import type { R } from './result';

// Utility Types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

// ID Types
export type UserId = string;
export type TeamId = string;
export type ProjectId = string;
export type EnvironmentId = string;
export type SecretId = string;
export type InvitationId = string;

// Pagination Types
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

// Timestamp Types
export type Timestamps = {
  createdAt: Date;
  updatedAt: Date;
};

// Action Response Type
export type ActionResponse<T = void> = Promise<R<T>>;

// Form State Type
export type FormState<T = void> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
};
