"use client";

import { AuthService } from "@/features/cloud-sync/application/auth-service";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");

  const handleProviderSignIn = (provider: string) => {
    AuthService.signIn(provider, { callbackUrl: "/settings" });
  };

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    AuthService.signIn("email", { email, callbackUrl: "/settings" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold text-center">Sign In to Pokémon Galaxy</h1>
        <p className="text-center text-zinc-600 dark:text-zinc-400">
          Sync your favorites, teams, and collections across devices.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => handleProviderSignIn("google")}
            className="w-full py-2 px-4 border border-zinc-300 dark:border-zinc-700 rounded flex items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <span>Sign in with Google</span>
          </button>
          <button
            onClick={() => handleProviderSignIn("github")}
            className="w-full py-2 px-4 border border-zinc-300 dark:border-zinc-700 rounded flex items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <span>Sign in with GitHub</span>
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-300 dark:border-zinc-700"></span>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-zinc-900 text-zinc-500">Or continue with</span>
          </div>
        </div>

        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="trainer@example.com"
              className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Send Magic Link
          </button>
        </form>

        <div className="text-center">
          <a href="/" className="text-sm text-zinc-500 hover:underline">
            Back to Home (Stay Offline)
          </a>
        </div>
      </div>
    </div>
  );
}
