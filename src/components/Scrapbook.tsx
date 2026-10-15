import type { ButtonHTMLAttributes, ReactNode } from "react";
import { photos, type PhotoKey } from "../data/photos";

export function Doodle({
  kind = "heart",
  className = "",
}: {
  kind?: "heart" | "spark" | "arrow" | "flower";
  className?: string;
}) {
  if (kind === "heart") {
    return (
      <svg className={`doodle ${className}`} viewBox="0 0 48 44" aria-hidden="true">
        <path d="M24 39C20 33 5 25 6 14 7 4 20 4 24 13 29 3 42 5 42 15c0 10-13 18-18 24Z" />
      </svg>
    );
  }
  if (kind === "arrow") {
    return (
      <svg className={`doodle ${className}`} viewBox="0 0 70 35" aria-hidden="true">
        <path d="M4 27c18 2 35-6 53-18M48 5l11 4-7 10" />
      </svg>
    );
  }
  if (kind === "flower") {
    return (
      <svg className={`doodle ${className}`} viewBox="0 0 52 62" aria-hidden="true">
        <path d="M26 27c-16 0-17-18-5-16 1-14 18-11 15 1 13-1 13 16 2 18-1 11-17 12-19 2-9 5-15-9-5-14M27 27c1 14 0 22-5 32M25 45c9-7 14-6 17-4M25 50c-6-6-10-6-14-4" />
      </svg>
    );
  }
  return (
    <svg className={`doodle ${className}`} viewBox="0 0 48 48" aria-hidden="true">
      <path d="M24 3c0 13 5 19 20 21-15 2-20 8-20 21C22 32 17 26 4 24c13-2 18-8 20-21Z" />
    </svg>
  );
}

type ActionProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "children" | "type"> & {
  onClick: () => void;
  /** Доступное имя; если не задано — берётся из текста кнопки. */
  label?: string;
  children?: ReactNode;
};

/** Единственный «кликабельный» примитив проекта: настоящая кнопка с клавиатурой и фокусом из коробки. */
export function Action({ children, onClick, className = "", label, ...rest }: ActionProps) {
  return (
    <button type="button" className={`action ${className}`} aria-label={label} onClick={() => onClick()} {...rest}>
      {children}
    </button>
  );
}

export function Tape({ className = "" }: { className?: string }) {
  return <span className={`tape ${className}`} aria-hidden="true" />;
}

/**
 * Позиции скотча на рамке Polaroid. Суффикс «-pink» — розовый скотч (по умолчанию оливковый).
 * Скотч лежит ВНУТРИ рамки, поэтому всегда остаётся на фото, как бы ни менялся размер.
 */
export type TapeSpot = "top" | "top-pink" | "top-left-pink" | "side" | "corner-tl-pink" | "corner-br";

export function Polaroid({
  photo,
  caption,
  className = "",
  onOpen,
  tapes = [],
}: {
  photo: PhotoKey;
  caption: string;
  className?: string;
  onOpen: (photo: PhotoKey, caption: string) => void;
  tapes?: TapeSpot[];
}) {
  return (
    <Action
      className={`polaroid ${className}`}
      onClick={() => onOpen(photo, caption)}
      label={`Увеличить фотографию: ${caption}`}
    >
      <img src={photos[photo]} alt="" draggable={false} />
      <span className="polaroid-caption">{caption}</span>
      {tapes.map((spot) => (
        <Tape key={spot} className={`tape-${spot.replace("-pink", "")}${spot.endsWith("-pink") ? " tape-pink" : ""}`} />
      ))}
    </Action>
  );
}

export function PageFrame({ children, tone = "" }: { children: ReactNode; tone?: string }) {
  return <section className={`paper-page ${tone}`}>{children}</section>;
}
