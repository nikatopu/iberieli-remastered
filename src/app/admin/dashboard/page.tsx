"use client";

import { useAdminAuth, useWineManager } from "../hooks";
import {
  AdminHeader,
  WineList,
  WineEditForm,
  LoadingSpinner,
  ErrorMessage,
  AdminToastProvider,
} from "../components";
import styles from "./page.module.scss";

export default function AdminDashboard() {
  const { isLoggedIn, isLoading: authLoading, logout } = useAdminAuth();
  const {
    wines,
    loading: winesLoading,
    error: winesError,
    selectedWine,
    isSaving,
    handleEditWine,
    handleSaveWine,
    handleCancelEdit,
    refetchWines,
  } = useWineManager();

  // Handle loading states
  if (authLoading || winesLoading) {
    return (
      <LoadingSpinner message="Verifying authentication and loading wines..." />
    );
  }

  // Handle authentication
  if (!isLoggedIn) {
    return <LoadingSpinner message="Redirecting to login..." />;
  }

  // Handle errors
  if (winesError) {
    return (
      <ErrorMessage
        title="Error Loading Wines"
        message={winesError}
        onRetry={refetchWines}
      />
    );
  }

  return (
    <>
      <div className={styles.adminDashboard}>
        <div className="container">
          <AdminHeader onLogout={logout} />

          <div className={styles.content}>
            {selectedWine ? (
              <WineEditForm
                wine={selectedWine}
                onSave={handleSaveWine}
                onCancel={handleCancelEdit}
                isSaving={isSaving}
              />
            ) : (
              <WineList wines={wines} onEditWine={handleEditWine} />
            )}
          </div>
        </div>
      </div>
      <AdminToastProvider />
    </>
  );
}
