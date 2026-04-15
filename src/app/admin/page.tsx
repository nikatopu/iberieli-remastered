"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import style from "./page.module.scss";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in via secure cookie
    checkAuthStatus();
  }, [router]);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/admin/auth/verify", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        router.push("/admin/dashboard");
      }
    } catch (error) {
      // User is not authenticated, stay on login page
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!username || !password) {
      setError("Username and password are required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={style.loginPage}>
      <div className="container">
        <div className={style.loginContainer}>
          <Card variant="elevated" className={style.loginCard}>
            <div className={style.loginHeader}>
              <img
                src="/photos/Logo Only.webp"
                alt="Iberieli Logo"
                className={style.logo}
              />
              <h1>Admin Login</h1>
              <p>Access the Iberieli admin panel</p>
            </div>

            <form onSubmit={handleLogin} className={style.loginForm}>
              <div className={style.inputGroup}>
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className={style.input}
                  required
                />
              </div>

              <div className={style.inputGroup}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className={style.input}
                  required
                />
              </div>

              {error && <div className={style.error}>{error}</div>}

              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className={style.loginButton}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
