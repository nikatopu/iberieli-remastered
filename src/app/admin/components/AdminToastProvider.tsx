"use client";

import { Toaster } from "react-hot-toast";

export default function AdminToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "var(--bg-primary)",
          color: "var(--text-primary)",
          border: "1px solid var(--border-light)",
          borderRadius: "0.5em",
          boxShadow: "0 0.25em 0.5em rgba(0, 0, 0, 0.1)",
          fontSize: "0.9em",
        },
        success: {
          iconTheme: {
            primary: "var(--primary-wine)",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#e74c3c",
            secondary: "#fff",
          },
        },
      }}
    />
  );
}
