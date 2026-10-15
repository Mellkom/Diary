import { useEffect, useRef, type RefObject } from "react";
import { Action } from "./Scrapbook";
import { pageMeta } from "../diary/model";

const pad = (n: number) => String(n).padStart(2, "0");

/** Хук модального окна: Esc закрывает, фокус уходит внутрь и возвращается на прежний элемент. */
export function useModalBehavior(onClose: () => void, initialFocus: RefObject<HTMLElement | null>) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    initialFocus.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (previous && previous.isConnected) previous.focus({ preventScroll: true });
    };
  }, [initialFocus]);
}

export default function Contents({
  currentViews,
  isBook,
  onSelect,
  onClose,
}: {
  currentViews: number[];
  isBook: boolean;
  onSelect: (view: number) => void;
  onClose: () => void;
}) {
  const firstRef = useRef<HTMLButtonElement>(null);
  useModalBehavior(onClose, firstRef);

  return (
    <div className={`overlay ${isBook ? "is-book" : ""}`} role="dialog" aria-modal="true" aria-labelledby="contents-title">
      <Action className="overlay-backdrop" onClick={onClose} label="Закрыть оглавление" tabIndex={-1} />
      <div className="contents-sheet">
        <div className="sheet-handle" aria-hidden="true" />
        <h2 id="contents-title" className="script-heading contents-heading">Оглавление</h2>
        <div className="contents-subtitle">семь маленьких глав о большой дружбе</div>
        <ul className="contents-list">
          {pageMeta.map((meta, index) => {
            const current = currentViews.includes(index);
            const isPage = meta.kind === "page";
            return (
              <li key={meta.title}>
                <button
                  ref={index === currentViews[0] ? firstRef : undefined}
                  type="button"
                  className={`action contents-row ${current ? "current" : ""}`}
                  aria-current={current ? "page" : undefined}
                  onClick={() => onSelect(index)}
                >
                  <span className="contents-number">{isPage ? pad(index) : "·"}</span>
                  <span>{meta.title}</span>
                  <span className="dots" aria-hidden="true" />
                  <span className="contents-page">{isPage ? `стр. ${index}` : meta.kind === "cover" ? "начало" : "конец"}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <Action className="close-sheet" onClick={onClose}>Закрыть</Action>
      </div>
    </div>
  );
}
