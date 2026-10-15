import { Doodle, PageFrame, Polaroid } from "../components/Scrapbook";
import { diary } from "../data/diary";
import type { PhotoKey } from "../data/photos";

export default function Memories({ onPhoto }: { onPhoto: (photo: PhotoKey, caption: string) => void }) {
  return (
    <PageFrame tone="memory-page">
      <div className="page-head">
        <div className="page-kicker">глава первая</div>
        <h2 className="script-heading compact-heading">Те самые дни</h2>
      </div>
      <div className="page-body memory-collage">
        <Polaroid photo="picnic" caption="планы? импровизируем!" className="memory-one" onOpen={onPhoto} tapes={["top-left-pink"]} />
        <Polaroid photo="grass" caption="аманда, линда, роуз" className="memory-two" onOpen={onPhoto} tapes={["side"]} />
        <Polaroid photo="fishing" caption="ребята на стиле" className="memory-three" onOpen={onPhoto} />
        <Doodle kind="arrow" className="memory-arrow" />
      </div>
      <div className="page-foot memory-foot">
        <span className="date-stamp">{diary.memoryStamp}</span>
        <span className="scribble memory-note">в те дни мы<br />никуда не спешили</span>
      </div>
    </PageFrame>
  );
}
