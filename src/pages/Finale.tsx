import { Action, Doodle, PageFrame, Polaroid } from "../components/Scrapbook";
import { diary } from "../data/diary";
import type { PhotoKey } from "../data/photos";

export default function Finale({ onAgain, onPhoto }: { onAgain: () => void; onPhoto: (photo: PhotoKey, caption: string) => void }) {
  return (
    <PageFrame tone="final-page">
      <div className="page-body final-body">
        <div className="final-photo-wrap">
          <Polaroid photo="group" caption="и это только начало" onOpen={onPhoto} tapes={["corner-tl-pink", "corner-br"]} />
        </div>
        <Doodle kind="heart" className="final-heart-one" />
        <Doodle kind="heart" className="final-heart-two" />
      </div>
      <div className="page-foot final-foot">
        <h2 className="script-heading final-heading">Это не конец нашей истории</h2>
        <p className="final-message">С днём рождения. Пусть впереди будет много счастливых страниц — и пусть на каждой найдётся место для нас.</p>
        <Action className="primary-action final-action" onClick={onAgain}>
          Перелистать дневник снова <span aria-hidden="true">↺</span>
        </Action>
        <div className="final-sign">{diary.finalSign}</div>
      </div>
    </PageFrame>
  );
}
