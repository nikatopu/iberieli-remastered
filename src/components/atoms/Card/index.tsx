import style from "./Card.module.scss";

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "wine" | "elevated";
}

export default function Card({
  children,
  onClick,
  className = "",
  variant = "default",
}: Props) {
  const classes =
    `${style.card} ${style[`card--${variant}`]} ${className}`.trim();

  if (onClick) {
    return (
      <div className={classes} onClick={onClick} role="button" tabIndex={0}>
        {children}
      </div>
    );
  }

  return <div className={classes}>{children}</div>;
}
