export type StoredSession = {
  token: string;
  user: import("@/lib/api/services/auth").AuthUser;
};
