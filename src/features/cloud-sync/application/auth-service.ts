import { signIn, signOut } from "next-auth/react";
import { UserProfile } from "../types/auth.types";

export class AuthService {
  static async signIn(provider: string, options?: any) {
    return signIn(provider, options);
  }

  static async signOut() {
    return signOut();
  }

  static mapToUserProfile(nextUser: any): UserProfile | null {
    if (!nextUser) return null;

    return {
      id: nextUser.id || nextUser.email,
      name: nextUser.name || "Trainer",
      email: nextUser.email,
      avatar: nextUser.image,
      createdAt: new Date().toISOString(), // Mock, would ideally come from DB
      updatedAt: new Date().toISOString(),
    };
  }
}
