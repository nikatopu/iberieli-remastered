"use client";

import { useState } from "react";
import { useAdminAuth, useWineManager } from "../hooks";
import {
  AdminHeader,
  WineList,
  WineEditForm,
  ContactManager,
  DistributorManager,
  LoadingSpinner,
  ErrorMessage,
  AdminToastProvider,
} from "../components";
import styles from "./page.module.scss";

type ActiveSection = "wines" | "contacts" | "distributors";

export default function AdminDashboard() {
  const { isLoggedIn, isLoading: authLoading, logout } = useAdminAuth();
  const [activeSection, setActiveSection] = useState<ActiveSection>("wines");
  const {
    wines,
    loading: winesLoading,
    error: winesError,
    selectedWine,
    isSaving,
    handleEditWine,
    handleSaveWine,
    handleCancelEdit,
    handleDeleteWine,
    handleToggleVisible,
    refetchWines,
  } = useWineManager();

  const existingCategories = Array.from(
    new Set(wines.map((wine) => wine.category).filter(Boolean)),
  );

  if (authLoading || winesLoading) {
    return (
      <LoadingSpinner message="Verifying authentication and loading wines..." />
    );
  }

  if (!isLoggedIn) {
    return <LoadingSpinner message="Redirecting to login..." />;
  }

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

          <div className={styles.sectionToggle}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${activeSection === "wines" ? styles.toggleBtnActive : ""}`}
              onClick={() => setActiveSection("wines")}
            >
              Wine Catalogue
            </button>
            <button
              type="button"
              className={`${styles.toggleBtn} ${activeSection === "contacts" ? styles.toggleBtnActive : ""}`}
              onClick={() => setActiveSection("contacts")}
            >
              Contacts
            </button>
            <button
              type="button"
              className={`${styles.toggleBtn} ${activeSection === "distributors" ? styles.toggleBtnActive : ""}`}
              onClick={() => setActiveSection("distributors")}
            >
              Distributors
            </button>
          </div>

          <div className={styles.content}>
            {activeSection === "contacts" ? (
              <ContactManager />
            ) : activeSection === "distributors" ? (
              <DistributorManager />
            ) : selectedWine ? (
              <WineEditForm
                wine={selectedWine}
                onSave={handleSaveWine}
                onCancel={handleCancelEdit}
                onDelete={handleDeleteWine}
                isSaving={isSaving}
                existingCategories={existingCategories}
              />
            ) : (
              <WineList
                wines={wines}
                onEditWine={handleEditWine}
                onToggleVisible={handleToggleVisible}
              />
            )}
          </div>
        </div>
      </div>
      <AdminToastProvider />
    </>
  );
}
