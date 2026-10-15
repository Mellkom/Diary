import { useEffect, useRef, useState } from "react";
import { Action } from "./Scrapbook";
import { useModalBehavior } from "./Contents";
import { photos, type PhotoKey } from "../data/photos";

export type ViewerItem = { photo: PhotoKey; caption: string };

/**
 * Увеличенный просмотр. Фото показывается целиком (object-fit: contain), без растяжения:
 * размер рамки определяется самой фотографией и ограничен доступной областью экрана.
 */
export default function PhotoViewer({ item, reducedMotion, onClose }: { item: ViewerItem; reducedMotion: boolean; onClose: () => void }) {
  const [closing, setClosing] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const requestClose = () => {
    if (reducedMotion) onClose();
    else setClosing(true);
  };
  useModalBehavior(requestClose, closeRef);

  // Страховка: если animationend не придёт (фоновая вкладка), окно всё равно закроется.
  useEffect(() => {
    if (!closing) return;
    const timer = window.setTimeout(onClose, 400);
    return () => window.clearTimeout(timer);
  }, [closing, onClose]);

  return (
    <div
      className={`photo-viewer ${closing ? "is-closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={item.caption}
      onAnimationEnd={(event) => {
        if (closing && event.target === event.currentTarget) onClose();
      }}
    >
      <Action className="viewer-backdrop" onClick={requestClose} label="Закрыть фотографию" tabIndex={-1} />
      <figure className="enlarged-polaroid">
        <img src={photos[item.photo]} alt={item.caption} draggable={false} />
        <figcaption className="enlarged-caption">{item.caption}</figcaption>
      </figure>
      <button ref={closeRef} type="button" className="action viewer-close" aria-label="Закрыть" onClick={requestClose}>
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}
