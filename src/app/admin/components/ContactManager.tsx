"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Card from "@/components/atoms/Card";
import styles from "./ContactManager.module.scss";

interface ContactEntry {
  id: number;
  contactId: string;
  label: string;
  phone: string | null;
  email: string | null;
  person: string | null;
  languages: string | null;
  note: string | null;
  visible: boolean;
}

type EditState = {
  label: string;
  phone: string;
  email: string;
  person: string;
  languages: string;
  note: string;
};

export default function ContactManager() {
  const [contacts, setContacts] = useState<ContactEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editState, setEditState] = useState<EditState>({
    label: "",
    phone: "",
    email: "",
    person: "",
    languages: "",
    note: "",
  });

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/contacts", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch contacts");
      const data: ContactEntry[] = await res.json();
      setContacts(data);
    } catch {
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleEdit = (contact: ContactEntry) => {
    setEditingId(contact.contactId);
    setEditState({
      label: contact.label,
      phone: contact.phone ?? "",
      email: contact.email ?? "",
      person: contact.person ?? "",
      languages: contact.languages ?? "",
      note: contact.note ?? "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSave = async (contactId: string) => {
    setIsSaving(true);
    const loadingToast = toast.loading("Saving contact...");
    try {
      const res = await fetch("/api/admin/contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          contactId,
          label: editState.label.trim(),
          phone: editState.phone.trim() || null,
          email: editState.email.trim() || null,
          person: editState.person.trim() || null,
          languages: editState.languages.trim() || null,
          note: editState.note.trim() || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to save contact");
      const data = await res.json();
      setContacts((prev) =>
        prev.map((c) => (c.contactId === contactId ? data.contact : c)),
      );
      toast.success("Contact saved", { id: loadingToast });
      setEditingId(null);
    } catch {
      toast.error("Failed to save contact", { id: loadingToast });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVisible = async (contact: ContactEntry) => {
    const newVisible = !contact.visible;
    try {
      const res = await fetch("/api/admin/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ contactId: contact.contactId, visible: newVisible }),
      });
      if (!res.ok) throw new Error("Failed to toggle visibility");
      const data = await res.json();
      setContacts((prev) =>
        prev.map((c) => (c.contactId === contact.contactId ? data.contact : c)),
      );
      toast.success(newVisible ? "Contact shown" : "Contact hidden");
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading contacts...</div>;
  }

  if (editingId) {
    const contact = contacts.find((c) => c.contactId === editingId);
    if (!contact) return null;

    return (
      <div className={styles.editFormWrap}>
        <div className={styles.editFormHeader}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={handleCancelEdit}
          >
            ← Back
          </button>
          <h2>Edit: {contact.label}</h2>
        </div>

        <Card variant="elevated">
          <div className={styles.editForm}>
            <section className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Contact Details</h3>

              <div className={styles.formGroup}>
                <label htmlFor="contactLabel">Label</label>
                <textarea
                  id="contactLabel"
                  value={editState.label}
                  onChange={(e) => setEditState((s) => ({ ...s, label: e.target.value }))}
                  className={styles.textarea}
                  rows={1}
                  placeholder="Contact label..."
                  disabled={isSaving}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="contactPhone">Phone</label>
                <textarea
                  id="contactPhone"
                  value={editState.phone}
                  onChange={(e) => setEditState((s) => ({ ...s, phone: e.target.value }))}
                  className={styles.textarea}
                  rows={1}
                  placeholder="(+995) ..."
                  disabled={isSaving}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="contactEmail">Email</label>
                <textarea
                  id="contactEmail"
                  value={editState.email}
                  onChange={(e) => setEditState((s) => ({ ...s, email: e.target.value }))}
                  className={styles.textarea}
                  rows={1}
                  placeholder="name@iberieli.com"
                  disabled={isSaving}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="contactPerson">Contact Person</label>
                <textarea
                  id="contactPerson"
                  value={editState.person}
                  onChange={(e) => setEditState((s) => ({ ...s, person: e.target.value }))}
                  className={styles.textarea}
                  rows={1}
                  placeholder="Full name..."
                  disabled={isSaving}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="contactLanguages">Languages</label>
                <textarea
                  id="contactLanguages"
                  value={editState.languages}
                  onChange={(e) => setEditState((s) => ({ ...s, languages: e.target.value }))}
                  className={styles.textarea}
                  rows={1}
                  placeholder="Georgian, English..."
                  disabled={isSaving}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="contactNote">Note</label>
                <textarea
                  id="contactNote"
                  value={editState.note}
                  onChange={(e) => setEditState((s) => ({ ...s, note: e.target.value }))}
                  className={styles.textarea}
                  rows={3}
                  placeholder="Additional information..."
                  disabled={isSaving}
                />
              </div>
            </section>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.saveBtn}
                onClick={() => handleSave(editingId)}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                Cancel
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.contactManager}>
      <div className={styles.sectionHeader}>
        <h2>Contact Entries</h2>
      </div>

      {contacts.length === 0 ? (
        <div className={styles.empty}>No contacts found.</div>
      ) : (
        <div className={styles.contactGrid}>
          {contacts.map((contact) => (
            <div key={contact.contactId} className={styles.contactCard}>
              <h3 className={styles.cardLabel}>{contact.label}</h3>

              <div className={styles.cardDetails}>
                {contact.person && (
                  <div className={styles.detailItem}>
                    <strong>Person</strong>
                    <span>{contact.person}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className={styles.detailItem}>
                    <strong>Phone</strong>
                    <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                  </div>
                )}
                {contact.email && (
                  <div className={styles.detailItem}>
                    <strong>Email</strong>
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </div>
                )}
                {contact.languages && (
                  <div className={styles.detailItem}>
                    <strong>Languages</strong>
                    <span>{contact.languages}</span>
                  </div>
                )}
                {contact.note && (
                  <p className={styles.noteSnippet}>
                    {contact.note.length > 100
                      ? contact.note.slice(0, 100) + "..."
                      : contact.note}
                  </p>
                )}
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.visibilityToggle}>
                  <button
                    type="button"
                    className={`${styles.toggleSwitch} ${contact.visible ? styles.toggleOn : styles.toggleOff}`}
                    onClick={() => handleToggleVisible(contact)}
                    aria-label={contact.visible ? "Hide contact" : "Show contact"}
                  >
                    <span className={styles.toggleThumb} />
                  </button>
                  <span>{contact.visible ? "Visible" : "Hidden"}</span>
                </div>
                <button
                  type="button"
                  className={styles.editBtn}
                  onClick={() => handleEdit(contact)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
