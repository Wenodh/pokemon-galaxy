export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type AuthProvider = "google" | "github" | "email";

export interface AuthState {
  user: UserProfile | null;
  status: "loading" | "authenticated" | "unauthenticated";
}
