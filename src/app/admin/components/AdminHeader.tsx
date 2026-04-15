import Button from "@/components/atoms/Button";
import styles from "./AdminHeader.module.scss";

interface AdminHeaderProps {
  onLogout: () => void;
}

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1>Iberieli Admin Dashboard</h1>
        <Button variant="outline" onClick={onLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
