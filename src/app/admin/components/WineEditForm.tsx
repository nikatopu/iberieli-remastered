import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { IWine } from "@/data/types";
import { createImagePreview, cleanupImagePreview } from "../utils/imageUpload";
import styles from "./WineEditForm.module.scss";

interface WineEditFormProps {
  wine: IWine;
  onSave: (
    description: string,
    tastingNotes: string,
    imageFile?: File,
  ) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

export default function WineEditForm({
  wine,
  onSave,
  onCancel,
  isSaving,
}: WineEditFormProps) {
  const [description, setDescription] = useState(wine.description);
  const [tastingNotes, setTastingNotes] = useState(wine.tastingNotes);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup preview URL on unmount or when file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        cleanupImagePreview(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (5MB max)
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_SIZE) {
        toast.error("Image must be less than 5MB");
        return;
      }

      // Clean up previous preview
      if (previewUrl) {
        cleanupImagePreview(previewUrl);
      }

      // Set new file and create preview
      setSelectedFile(file);
      const newPreviewUrl = createImagePreview(file);
      setPreviewUrl(newPreviewUrl);
    } else {
      // Clear selection
      setSelectedFile(null);
      if (previewUrl) {
        cleanupImagePreview(previewUrl);
        setPreviewUrl(null);
      }
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      cleanupImagePreview(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(description, tastingNotes, selectedFile || undefined);
  };

  return (
    <div className={styles.editForm}>
      <Card variant="elevated">
        <div className={styles.editHeader}>
          <div className={styles.winePreview}>
            <div className={styles.imageContainer}>
              <img
                src={previewUrl || wine.image}
                alt={wine.name}
                className={styles.previewImage}
              />
              {previewUrl && (
                <div className={styles.previewBadge}>New Image</div>
              )}
            </div>
            <div>
              <h2>Edit Wine: {wine.name}</h2>
              <p className={styles.grapeInfo}>{wine.grapeBlend}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="image">Wine Image</label>
            <div className={styles.imageUpload}>
              <input
                ref={fileInputRef}
                type="file"
                id="image"
                accept="image/*"
                onChange={handleFileSelect}
                className={styles.fileInput}
                disabled={isSaving}
              />
              <div className={styles.imageUploadControls}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSaving}
                >
                  Choose New Image
                </Button>
                {selectedFile && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveImage}
                    disabled={isSaving}
                    className={styles.removeButton}
                  >
                    Remove
                  </Button>
                )}
              </div>
              {selectedFile && (
                <small className={styles.fileInfo}>
                  Selected: {selectedFile.name} (
                  {Math.round(selectedFile.size / 1024)}KB)
                </small>
              )}
              <small className={styles.helpText}>
                Supported formats: JPG, PNG, WebP. Max size: 5MB.
              </small>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Short Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
              rows={3}
              placeholder="Brief wine description for wine cards..."
              required
            />
            <small className={styles.charCount}>
              {description.length} characters
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tastingNotes">Tasting Notes</label>
            <textarea
              id="tastingNotes"
              value={tastingNotes}
              onChange={(e) => setTastingNotes(e.target.value)}
              className={styles.textarea}
              rows={6}
              placeholder="Detailed tasting notes..."
              required
            />
            <small className={styles.charCount}>
              {tastingNotes.length} characters
            </small>
          </div>

          <div className={styles.formActions}>
            <Button
              type="submit"
              disabled={isSaving}
              className={styles.saveButton}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
