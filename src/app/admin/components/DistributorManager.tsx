"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { COUNTRIES, countryFlag } from "@/data/countries";
import { displayHost } from "@/lib/urls";
import styles from "./DistributorManager.module.scss";

interface DistributorEntry {
  id: number;
  countryCode: string;
  countryName: string;
  url: string;
  name: string | null;
  visible: boolean;
}

interface DraftState {
  countryCode: string;
  url: string;
  name: string;
}

const EMPTY_DRAFT: DraftState = { countryCode: "", url: "", name: "" };

export default function DistributorManager() {
  const [distributors, setDistributors] = useState<DistributorEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  /** null = not editing, "new" = add form, otherwise the row id being edited. */
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [draft, setDraft] = useState<DraftState>(EMPTY_DRAFT);
  const [pendingDelete, setPendingDelete] = useState<DistributorEntry | null>(
    null,
  );

  const fetchDistributors = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/distributors", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch distributors");
      setDistributors(await res.json());
    } catch {
      toast.error("Failed to load distributors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistributors();
  }, []);

  /** A country can hold one distributor, so used ones drop out of the picker. */
  const availableCountries = useMemo(() => {
    const taken = new Set(
      distributors.filter((d) => d.id !== editing).map((d) => d.countryCode),
    );
    return COUNTRIES.filter((c) => !taken.has(c.code));
  }, [distributors, editing]);

  const startAdd = () => {
    setDraft(EMPTY_DRAFT);
    setEditing("new");
  };

  const startEdit = (entry: DistributorEntry) => {
    setDraft({
      countryCode: entry.countryCode,
      url: entry.url,
      name: entry.name ?? "",
    });
    setEditing(entry.id);

    // Scroll to the edit distributor section smoothly
    const editSection = document.getElementById("edit-distributor-section");
    if (editSection) {
      editSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setDraft(EMPTY_DRAFT);
  };

  const handleSave = async () => {
    if (!draft.countryCode) {
      toast.error("Pick a country");
      return;
    }
    if (!draft.url.trim()) {
      toast.error("Add a link to the distributor");
      return;
    }

    setIsSaving(true);
    const loadingToast = toast.loading("Saving distributor...");
    const isNew = editing === "new";

    try {
      const res = await fetch("/api/admin/distributors", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: isNew ? undefined : editing,
          countryCode: draft.countryCode,
          url: draft.url,
          name: draft.name,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save distributor");

      setDistributors((prev) => {
        const next = isNew
          ? [...prev, data.distributor]
          : prev.map((d) => (d.id === editing ? data.distributor : d));
        return next.sort((a, b) => a.countryName.localeCompare(b.countryName));
      });

      toast.success(isNew ? "Distributor added" : "Distributor updated", {
        id: loadingToast,
      });
      cancelEdit();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save distributor",
        { id: loadingToast },
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVisible = async (entry: DistributorEntry) => {
    const nextVisible = !entry.visible;
    try {
      const res = await fetch("/api/admin/distributors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: entry.id, visible: nextVisible }),
      });
      if (!res.ok) throw new Error("Failed to toggle visibility");
      const data = await res.json();
      setDistributors((prev) =>
        prev.map((d) => (d.id === entry.id ? data.distributor : d)),
      );
      toast.success(
        nextVisible
          ? `${entry.countryName} is now shown`
          : `${entry.countryName} is now hidden`,
      );
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    const target = pendingDelete;
    const loadingToast = toast.loading("Deleting distributor...");

    try {
      const res = await fetch("/api/admin/distributors", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: target.id }),
      });
      if (!res.ok) throw new Error("Failed to delete distributor");

      setDistributors((prev) => prev.filter((d) => d.id !== target.id));
      toast.success(`${target.countryName} removed`, { id: loadingToast });
      setPendingDelete(null);
      if (editing === target.id) cancelEdit();
    } catch {
      toast.error("Failed to delete distributor", { id: loadingToast });
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading distributors...</div>;
  }

  return (
    <div className={styles.manager}>
      <div className={styles.sectionHeader}>
        <div>
          <h2>Distributors</h2>
          <p className={styles.hint}>
            One distributor per country. Visitors from these countries are sent
            straight to the local link; everyone else is invited to enquire
            about importing.
          </p>
        </div>
        {editing === null && (
          <button type="button" className={styles.addBtn} onClick={startAdd}>
            + Add distributor
          </button>
        )}
      </div>

      {editing !== null && (
        <div className={styles.editCard} id={"edit-distributor-section"}>
          <h3>{editing === "new" ? "Add distributor" : "Edit distributor"}</h3>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="distCountry">Country</label>
              <select
                id="distCountry"
                className={styles.select}
                value={draft.countryCode}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, countryCode: e.target.value }))
                }
                disabled={isSaving}
              >
                <option value="">Select a country...</option>
                {availableCountries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="distUrl">Link to distributor</label>
              <input
                id="distUrl"
                type="url"
                className={styles.input}
                value={draft.url}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, url: e.target.value }))
                }
                placeholder="https://example.com"
                disabled={isSaving}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="distName">
                Distributor name{" "}
                <span className={styles.optional}>optional</span>
              </label>
              <input
                id="distName"
                type="text"
                className={styles.input}
                value={draft.name}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, name: e.target.value }))
                }
                placeholder="Shown to visitors — defaults to the domain"
                disabled={isSaving}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.saveBtn}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={cancelEdit}
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {distributors.length === 0 ? (
        <div className={styles.empty}>
          No distributors yet. Add one and it will show up on the wine pages,
          the contact page and the about page.
        </div>
      ) : (
        <div className={styles.grid}>
          {distributors.map((entry) => (
            <div
              key={entry.id}
              className={`${styles.card} ${entry.visible ? "" : styles.cardHidden}`}
            >
              <div className={styles.cardHead}>
                <span className={styles.flag} aria-hidden="true">
                  {countryFlag(entry.countryCode)}
                </span>
                <h3 className={styles.cardCountry}>{entry.countryName}</h3>
              </div>

              <div className={styles.cardDetails}>
                <div className={styles.detailItem}>
                  <strong>Distributor</strong>
                  <span>{entry.name ?? displayHost(entry.url)}</span>
                </div>
                <div className={styles.detailItem}>
                  <strong>Link</strong>
                  <a href={entry.url} target="_blank" rel="noopener noreferrer">
                    {displayHost(entry.url)}
                  </a>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.visibilityToggle}>
                  <button
                    type="button"
                    className={`${styles.toggleSwitch} ${entry.visible ? styles.toggleOn : styles.toggleOff}`}
                    onClick={() => handleToggleVisible(entry)}
                    aria-label={
                      entry.visible ? "Hide distributor" : "Show distributor"
                    }
                  >
                    <span className={styles.toggleThumb} />
                  </button>
                  <span>{entry.visible ? "Visible" : "Hidden"}</span>
                </div>

                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={styles.editBtn}
                    onClick={() => startEdit(entry)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => setPendingDelete(entry)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pendingDelete && (
        <div
          className={styles.overlay}
          onClick={() => setPendingDelete(null)}
          role="presentation"
        >
          <div
            className={styles.confirmModal}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Remove {pendingDelete.countryName}?</h3>
            <p>
              Visitors from {pendingDelete.countryName} will stop seeing{" "}
              {pendingDelete.name ?? displayHost(pendingDelete.url)} and will be
              asked to enquire about importing instead.
            </p>
            <div className={styles.confirmActions}>
              <button
                type="button"
                className={styles.confirmDeleteBtn}
                onClick={handleDelete}
              >
                Yes, remove it
              </button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setPendingDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
