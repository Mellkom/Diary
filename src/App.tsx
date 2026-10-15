import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type TouchEvent } from "react";
import Book from "./components/Book";
import Contents from "./components/Contents";
import PhotoViewer, { type ViewerItem } from "./components/PhotoViewer";
import { Action } from "./components/Scrapbook";
import { photos, type PhotoKey } from "./data/photos";
import { useMediaQuery } from "./hooks/useMediaQuery";
import {
  lastView,
  pageAnnouncement,
  pageLabel,
  snapView,
  stepView,
  visibleViews,
  type Flip,
} from "./diary/model";
import Cover from "./pages/Cover";
import Envelope from "./pages/Envelope";
import Finale from "./pages/Finale";
import Funny from "./pages/Funny";
import Future from "./pages/Future";
import Greeting from "./pages/Greeting";
import InsideCover from "./pages/InsideCover";
import Letter from "./pages/Letter";
import Memories from "./pages/Memories";

/** Длительность перелистывания. Та же величина уходит в CSS (--flip-ms), так что JS и анимация не расходятся. */
const FLIP_MS = { book: 950, single: 640 } as const;
const SWIPE_DISTANCE = 50;

export default function App() {
  const isBook = useMediaQuery("(min-width: 900px) and (min-height: 620px)");
  const isLandscape = useMediaQuery("(orientation: landscape) and (max-height: 619px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const mode = isBook ? "book" : "single";
  const flipMs = FLIP_MS[mode];

  // view — закоммиченное положение; flip — идущая анимация; pending — одно отложенное действие.
  const [view, setView] = useState(0);
  const [flip, setFlip] = useState<Flip | null>(null);
  const viewRef = useRef(0);
  const flipRef = useRef<Flip | null>(null);
  const pendingRef = useRef<number | null>(null);
  const envRef = useRef({ isBook, reducedMotion });

  const [contentsOpen, setContentsOpen] = useState(false);
  const [viewer, setViewer] = useState<ViewerItem | null>(null);

  // Состояние интерактивных страниц живёт здесь, чтобы не сбрасываться при уходе со страницы.
  const [checkedPlans, setCheckedPlans] = useState<number[]>([1]);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

  useLayoutEffect(() => {
    envRef.current = { isBook, reducedMotion };
  });

  const commitView = useCallback((next: number) => {
    viewRef.current = next;
    setView(next);
  }, []);
  const commitFlip = useCallback((next: Flip | null) => {
    flipRef.current = next;
    setFlip(next);
  }, []);

  const begin = useCallback(
    (target: number) => {
      const from = viewRef.current;
      if (target === from) return;
      if (envRef.current.reducedMotion) {
        commitView(target);
        return;
      }
      commitFlip({ from, to: target, dir: target > from ? "forward" : "backward", settling: false });
    },
    [commitFlip, commitView],
  );

  const finishFlip = useCallback(() => {
    const current = flipRef.current;
    if (!current || current.settling) return;
    commitView(current.to);
    commitFlip({ ...current, settling: true });
  }, [commitFlip, commitView]);

  // Новая пара страниц уже стоит под листом; снимаем лист через два кадра — без вспышки и скачка.
  useEffect(() => {
    if (!flip?.settling) return;
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => commitFlip(null));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [flip, commitFlip]);

  // Страховка на случай, если animationend не придёт (фоновая вкладка и т. п.).
  useEffect(() => {
    if (!flip || flip.settling) return;
    const timer = window.setTimeout(finishFlip, flipMs + 350);
    return () => window.clearTimeout(timer);
  }, [flip, flipMs, finishFlip]);

  // После окончания листа выполняем отложенное действие (если было).
  useEffect(() => {
    if (flip || pendingRef.current === null) return;
    const target = pendingRef.current;
    pendingRef.current = null;
    begin(target);
  }, [flip, begin]);

  // Смена режима (поворот экрана, изменение окна): отменяем анимацию и приводим страницу к допустимой.
  useEffect(() => {
    commitFlip(null);
    pendingRef.current = null;
    commitView(snapView(viewRef.current, isBook));
  }, [isBook, commitFlip, commitView]);

  /** Шаг вперёд/назад. Во время листа запоминаем ровно одно следующее действие. */
  const step = useCallback(
    (dir: "next" | "prev") => {
      const book = envRef.current.isBook;
      const active = flipRef.current;
      if (active) {
        if (pendingRef.current === null) {
          const target = stepView(active.to, dir, book);
          if (target !== active.to) pendingRef.current = target;
        }
        return;
      }
      begin(stepView(viewRef.current, dir, book));
    },
    [begin],
  );

  /** Переход на конкретную страницу (оглавление, «открыть», «перелистать снова»). */
  const goTo = useCallback(
    (raw: number) => {
      const target = snapView(raw, envRef.current.isBook);
      setContentsOpen(false);
      if (flipRef.current) {
        pendingRef.current = target;
        return;
      }
      begin(target);
    },
    [begin],
  );

  const modalOpen = contentsOpen || viewer !== null;

  useEffect(() => {
    if (modalOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "ArrowRight") step("next");
      else if (event.key === "ArrowLeft") step("prev");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalOpen, step]);

  // Свайп: только явно горизонтальный жест, чтобы не конфликтовать с вертикальной прокруткой.
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (event: TouchEvent) => {
    if (modalOpen || event.touches.length !== 1) {
      touchStart.current = null;
      return;
    }
    touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  };
  const onTouchEnd = (event: TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || modalOpen) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) >= SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? "next" : "prev");
  };

  // Скачиваем И декодируем фото заранее, чтобы они не «выпрыгивали» посреди или сразу после листа.
  useEffect(() => {
    Object.values(photos).forEach((src) => {
      const image = new Image();
      image.src = src;
      image.decode?.().catch(() => {});
    });
  }, []);

  const openPhoto = useCallback((photo: PhotoKey, caption: string) => setViewer({ photo, caption }), []);
  const closePhoto = useCallback(() => setViewer(null), []);
  const closeContents = useCallback(() => setContentsOpen(false), []);

  const togglePlan = useCallback(
    (index: number) =>
      setCheckedPlans((items) => (items.includes(index) ? items.filter((item) => item !== index) : [...items, index])),
    [],
  );
  const toggleEnvelope = useCallback(() => setEnvelopeOpen((value) => !value), []);

  const renderPage = (index: number): ReactNode => {
    switch (index) {
      case 0:
        return <Cover onOpen={() => goTo(1)} onPhoto={openPhoto} />;
      case 1:
        return <Greeting onPhoto={openPhoto} />;
      case 2:
        return <Memories onPhoto={openPhoto} />;
      case 3:
        return <Funny onPhoto={openPhoto} />;
      case 4:
        return <Letter />;
      case 5:
        return <Envelope open={envelopeOpen} onToggle={toggleEnvelope} />;
      case 6:
        return <Future checked={checkedPlans} onToggle={togglePlan} onPhoto={openPhoto} />;
      case 7:
        return <Finale onAgain={() => goTo(0)} onPhoto={openPhoto} />;
      default:
        return <InsideCover />;
    }
  };

  const shownView = snapView(view, isBook);
  const targetView = flip ? flip.to : shownView;
  const atCover = targetView === 0;
  const atEnd = targetView >= lastView(isBook);
  const moving = flip !== null && !flip.settling;

  const stageClass = [
    "stage",
    isBook ? "is-book" : isLandscape ? "is-single is-land" : "is-single",
    atCover ? "is-cover" : "",
    moving ? "is-flipping" : "",
  ].join(" ");

  return (
    <main
      className="app-shell"
      style={{ "--flip-ms": `${flipMs}ms` } as CSSProperties}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchCancel={() => (touchStart.current = null)}
    >
      <div className="diary-root" inert={modalOpen}>
        <div className={stageClass}>
          <Book mode={mode} view={shownView} flip={flip} renderPage={renderPage} onFlipEnd={finishFlip} />

          {!atCover && (
            <Action className="contents-trigger" onClick={() => setContentsOpen(true)} label="Открыть оглавление">
              <span className="contents-lines" aria-hidden="true">≡</span> оглавление
            </Action>
          )}

          <nav className="page-nav" aria-label="Перелистывание">
            <Action
              className={`nav-control nav-prev ${atCover ? "is-hidden" : ""}`}
              onClick={() => step("prev")}
              label="Предыдущая страница"
              disabled={atCover}
            >
              <span aria-hidden="true">←</span> <span className="nav-word" aria-hidden="true">назад</span>
            </Action>
            <Action className="page-count" onClick={() => setContentsOpen(true)} label="Открыть оглавление">
              {pageLabel(targetView, isBook)}
            </Action>
            <Action
              className="nav-control nav-next"
              onClick={() => step("next")}
              label="Следующая страница"
              disabled={atEnd}
            >
              <span className="nav-word" aria-hidden="true">дальше</span> <span aria-hidden="true">→</span>
            </Action>
          </nav>
        </div>
      </div>

      {contentsOpen && (
        <Contents currentViews={visibleViews(targetView, isBook)} isBook={isBook} onSelect={goTo} onClose={closeContents} />
      )}
      {viewer && <PhotoViewer item={viewer} reducedMotion={reducedMotion} onClose={closePhoto} />}

      <p className="sr-only" aria-live="polite">{pageAnnouncement(shownView, isBook)}</p>
    </main>
  );
}
