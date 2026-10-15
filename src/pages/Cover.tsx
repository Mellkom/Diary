import { Action, Doodle, PageFrame, Polaroid } from "../components/Scrapbook";
import { diary } from "../data/diary";
import type { PhotoKey } from "../data/photos";

export default function Cover({ onOpen, onPhoto }: { onOpen: () => void; onPhoto: (photo: PhotoKey, caption: string) => void }) {
  return (
    <PageFrame tone="cover-page">
      <div className="cover-binding" aria-hidden="true" />
      <div className="cover-corner-stitch cover-stitch-top" aria-hidden="true" />
      <div className="cover-corner-stitch cover-stitch-bottom" aria-hidden="true" />
      <div className="page-head">
        <div className="cover-label">
          <div className="eyebrow">этот дневник принадлежит</div>
          <div className="recipient">{diary.recipient}</div>
          <div className="date">{diary.coverDate}</div>
        </div>
        <div className="cover-copy">
          <div className="cover-overline">бережно собрано по кусочкам</div>
          <h1 className="display-title">Дневник наших<br />воспоминаний</h1>
          <div className="cover-subtitle">История, рассказанная в фотографиях — только для тебя</div>
        </div>
      </div>
      <div className="page-body cover-art">
        <Doodle kind="spark" className="cover-flower" />
        <Polaroid photo="eldarka" caption="наша дебилка" className="cover-photo" onOpen={onPhoto} tapes={["top-pink"]} />
      </div>
      <div className="page-foot">
        <Action className="primary-action" onClick={onOpen}>
          Открыть дневник <span aria-hidden="true">→</span>
        </Action>
        <div className="cover-corner">с любовью,<br />твои друзья</div>
      </div>
    </PageFrame>
  );
}
