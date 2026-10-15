import type { AnimationEvent, ReactNode } from "react";
import { spreadOf, type Flip } from "../diary/model";

type BookProps = {
  mode: "book" | "single";
  view: number;
  flip: Flip | null;
  renderPage: (index: number) => ReactNode;
  onFlipEnd: () => void;
};

export default function Book(props: BookProps) {
  return props.mode === "book" ? <SpreadBook {...props} /> : <SingleBook {...props} />;
}

/** Реагируем только на конец анимации самого листа, а не вложенных теней. */
function leafEnded(event: AnimationEvent<HTMLElement>, onFlipEnd: () => void) {
  if (event.target === event.currentTarget) onFlipEnd();
}

/**
 * Две страницы (ПК). Лист — настоящий объект с двумя сторонами:
 *  вперёд:  лист лежит на правой половине, шарнир — корешок, лицо = текущая правая страница,
 *           оборот = новая левая; под ним уже лежит новая правая страница.
 *  назад:   зеркально. Содержимое под листом не подменяется «на ходу».
 */
function SpreadBook({ view, flip, renderPage, onFlipEnd }: BookProps) {
  let left: number | null;
  let right: number | null;
  let leaf: { front: number | null; back: number | null } | null = null;

  if (!flip) {
    ({ left, right } = spreadOf(view));
  } else {
    const from = spreadOf(flip.from);
    const to = spreadOf(flip.to);
    if (flip.settling) {
      left = to.left;
      right = to.right;
    } else if (flip.dir === "forward") {
      left = from.left;
      right = to.right;
    } else {
      left = to.left;
      right = from.right;
    }
    leaf = flip.dir === "forward" ? { front: from.right, back: to.left } : { front: from.left, back: to.right };
  }

  const moving = flip !== null && !flip.settling;
  const forward = flip?.dir === "forward";
  const closed = (flip ? flip.to : view) === 0;

  return (
    <div className={`book ${closed ? "is-closed" : ""} ${moving ? "is-moving" : ""}`}>
      {left !== null && (
        <div key={`l${left}`} className="slot slot-left side-left">
          {renderPage(left)}
          <span className={`slot-cast ${moving ? (forward ? "cast-far" : "cast-near") : ""}`} aria-hidden="true" />
        </div>
      )}
      {right !== null && (
        <div key={`r${right}`} className="slot slot-right side-right">
          {renderPage(right)}
          <span className={`slot-cast ${moving ? (forward ? "cast-near" : "cast-far") : ""}`} aria-hidden="true" />
        </div>
      )}
      {flip && leaf && (
        <div
          key={`${flip.from}>${flip.to}`}
          className={`leaf leaf-${flip.dir}`}
          aria-hidden="true"
          onAnimationEnd={(event) => leafEnded(event, onFlipEnd)}
        >
          <div className={`leaf-face leaf-front ${forward ? "side-right" : "side-left"}`}>
            {leaf.front !== null && renderPage(leaf.front)}
            <span className="leaf-shade" />
          </div>
          <div className={`leaf-face leaf-back ${forward ? "side-left" : "side-right"}`}>
            {leaf.back !== null && renderPage(leaf.back)}
            <span className="leaf-shade" />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Одна страница (телефон). Вперёд: текущая страница «отлипает» от левого края и уходит,
 * открывая следующую. Назад: предыдущая страница опускается обратно поверх текущей.
 */
function SingleBook({ view, flip, renderPage, onFlipEnd }: BookProps) {
  if (!flip) {
    return (
      <div className="single-book">
        <div key={`s${view}`} className="sheet">{renderPage(view)}</div>
      </div>
    );
  }

  const forward = flip.dir === "forward";
  const baseIndex = flip.settling ? flip.to : forward ? flip.to : flip.from;
  const leafIndex = forward ? flip.from : flip.to;
  const moving = !flip.settling;

  return (
    <div className={`single-book ${moving ? "is-moving" : ""}`}>
      <div key={`s${baseIndex}`} className="sheet">
        {renderPage(baseIndex)}
        <span className={`slot-cast ${moving ? (forward ? "cast-near" : "cast-far") : ""}`} aria-hidden="true" />
      </div>
      <div
        key={`${flip.from}>${flip.to}`}
        className={`leaf-single ${forward ? "leaf-out" : "leaf-in"}`}
        aria-hidden="true"
        onAnimationEnd={(event) => leafEnded(event, onFlipEnd)}
      >
        {renderPage(leafIndex)}
        <span className="leaf-shade" />
      </div>
    </div>
  );
}
