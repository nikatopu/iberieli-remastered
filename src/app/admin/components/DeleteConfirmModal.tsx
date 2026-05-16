import styles from "./DeleteConfirmModal.module.scss";

interface DeleteConfirmModalProps {
  wineName: string;
  onConfirm: () => void;
  onAbort: () => void;
  isDeleting: boolean;
}

export default function DeleteConfirmModal({
  wineName,
  onConfirm,
  onAbort,
  isDeleting,
}: DeleteConfirmModalProps) {
  return (
    <div className={styles.overlay} onClick={onAbort}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.iconWrap}>
          <span className={styles.icon}>⚠</span>
        </div>

        <h2 className={styles.title}>Delete Wine?</h2>
        <p className={styles.body}>
          You are about to permanently delete{" "}
          <strong>&ldquo;{wineName}&rdquo;</strong>. This will remove all data
          associated with this wine including tasting notes, vinification
          details, and images. This action cannot be undone.
        </p>

        <div className={styles.actions}>
          <button
            className={styles.deleteBtn}
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Yes, delete wine"}
          </button>
          <button
            className={styles.abortBtn}
            onClick={onAbort}
            disabled={isDeleting}
          >
            No, abort
          </button>
        </div>
      </div>
    </div>
  );
}
