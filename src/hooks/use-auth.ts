import { useAuth as useClerkAuth, useUser } from "@clerk/react";

export function useAuth() {
  const { isLoaded: isAuthLoaded, isSignedIn, signOut, userId } = useClerkAuth();
  const { isLoaded: isUserLoaded, user: clerkUser } = useUser();
  const email = clerkUser?.primaryEmailAddress?.emailAddress;
  const user = clerkUser
    ? {
        name: clerkUser.fullName ?? clerkUser.username ?? email ?? "AFRINNET member",
        email,
      }
    : null;

  const isLoading = !isAuthLoaded || (Boolean(isSignedIn) && !isUserLoaded);

  return {
    isLoading,
    isAuthenticated: Boolean(isSignedIn),
    user,
    signOut,
    userId,
  };
}
