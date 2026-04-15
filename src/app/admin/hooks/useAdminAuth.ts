import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface UseAdminAuthReturn {
  isLoggedIn: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

export function useAdminAuth(): UseAdminAuthReturn {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/admin/auth/verify", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        router.push("/admin");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      router.push("/admin");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      router.push("/admin");
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return {
    isLoggedIn,
    isLoading,
    logout,
  };
}
