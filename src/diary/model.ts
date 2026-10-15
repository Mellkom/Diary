/**
 * Модель дневника — единственное место, где описаны страницы и правила навигации.
 *
 * «Вид» (view) — индекс ЛЕВОЙ видимой страницы:
 *   0      обложка (закрытая книга)
 *   1…7    семь страниц дневника (поздравление … финал)
 *   8      внутренняя сторона задней обложки
 *
 * ПК (книга):   обложка → развороты [1,2] [3,4] [5,6] [7,8]
 * Телефон:      обложка → 1 → 2 → … → 7 → 8, по одной странице
 */

export const CONTENT_PAGES = 7;
export const BACK_COVER = 8;

export type PageMeta = { title: string; kind: "cover" | "page" | "back" };

export const pageMeta: PageMeta[] = [
  { title: "Обложка", kind: "cover" },
  { title: "Поздравление", kind: "page" },
  { title: "Наши дни", kind: "page" },
  { title: "Смешные моменты", kind: "page" },
  { title: "Письмо", kind: "page" },
  { title: "Секрет", kind: "page" },
  { title: "Будущее", kind: "page" },
  { title: "Финал", kind: "page" },
  { title: "Задняя обложка", kind: "back" },
];

export type FlipDirection = "forward" | "backward";

export type Flip = {
  from: number;
  to: number;
  dir: FlipDirection;
  /** Анимация закончилась, новый вид уже закоммичен, лист ещё снимается (1–2 кадра). */
  settling: boolean;
};

/** Приводит вид к допустимому для режима: на ПК левая страница разворота всегда нечётная. */
export function snapView(view: number, isBook: boolean): number {
  if (view <= 0) return 0;
  const bounded = Math.min(view, BACK_COVER);
  return isBook ? 1 + Math.floor((bounded - 1) / 2) * 2 : bounded;
}

export function lastView(isBook: boolean): number {
  return isBook ? BACK_COVER - 1 : BACK_COVER;
}

export function stepView(view: number, dir: "next" | "prev", isBook: boolean): number {
  const current = snapView(view, isBook);
  const size = isBook ? 2 : 1;
  if (dir === "next") {
    if (current === 0) return 1;
    return Math.min(lastView(isBook), current + size);
  }
  return current <= 1 ? 0 : current - size;
}

/** Какие страницы лежат слева и справа в данном виде (только для режима книги). */
export function spreadOf(view: number): { left: number | null; right: number | null } {
  if (view === 0) return { left: null, right: 0 };
  return { left: view, right: view + 1 <= BACK_COVER ? view + 1 : null };
}

/** Индексы страниц, которые видны пользователю в данном виде. */
export function visibleViews(view: number, isBook: boolean): number[] {
  if (!isBook || view === 0) return [view];
  return view + 1 <= BACK_COVER ? [view, view + 1] : [view];
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Подпись счётчика в навигации — осмысленные номера страниц, а не индексы массива. */
export function pageLabel(view: number, isBook: boolean): string {
  if (view === 0) return "обложка";
  if (isBook) {
    const right = view + 1;
    return right <= CONTENT_PAGES
      ? `${pad(view)}–${pad(right)} / ${pad(CONTENT_PAGES)}`
      : `${pad(view)} / ${pad(CONTENT_PAGES)}`;
  }
  if (view === BACK_COVER) return "задняя обложка";
  return `${pad(view)} / ${pad(CONTENT_PAGES)}`;
}

/** Озвучка для скринридеров при смене страницы. */
export function pageAnnouncement(view: number, isBook: boolean): string {
  const names = visibleViews(view, isBook).map((i) => pageMeta[i].title);
  if (view === 0) return "Обложка дневника";
  const numbers = visibleViews(view, isBook).filter((i) => i >= 1 && i <= CONTENT_PAGES);
  const prefix =
    numbers.length === 0
      ? ""
      : numbers.length === 1
        ? `Страница ${numbers[0]} из ${CONTENT_PAGES}. `
        : `Страницы ${numbers[0]}–${numbers[1]} из ${CONTENT_PAGES}. `;
  return `${prefix}${names.join(", ")}`;
}
