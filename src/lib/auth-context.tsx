"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, getAuth, type Auth } from "firebase/auth";
import { app } from "./firebase";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  authError: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    try {
      const auth: Auth = getAuth(app);
      unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
    } catch (error) {
      console.error("Firebase Auth initialization error:", error);
      setAuthError(error instanceof Error ? error.message : "Auth initialization failed");
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Simple route protection
  useEffect(() => {
    if (!loading && !authError) {
      if (pathname?.startsWith("/admin") && !user && pathname !== "/admin/login") {
        router.push("/admin/login");
      }
      if (pathname === "/admin/login" && user) {
        router.push("/admin");
      }
    }
  }, [user, loading, pathname, router, authError]);

  return (
    <AuthContext.Provider value={{ user, loading, authError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
