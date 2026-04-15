import Button from "@/components/atoms/Button";
import styles from "./ErrorMessage.module.scss";

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({
  title = "Error",
  message,
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className={styles.adminDashboard}>
      <div className="container">
        <div className={styles.error}>
          <h2>{title}</h2>
          <p>{message}</p>
          {onRetry && <Button onClick={onRetry}>Retry</Button>}
        </div>
      </div>
    </div>
  );
}
