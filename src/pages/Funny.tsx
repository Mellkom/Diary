import { Doodle, PageFrame, Polaroid } from "../components/Scrapbook";
import type { PhotoKey } from "../data/photos";

export default function Funny({ onPhoto }: { onPhoto: (photo: PhotoKey, caption: string) => void }) {
  return (
    <PageFrame tone="funny-page">
      <div className="page-head">
        <div className="page-kicker">чистые серьезки</div>
        <h2 className="script-heading compact-heading">Состав дрим-тим</h2>
      </div>
      <div className="page-body fun-grid">
        <Polaroid photo="dilnur" caption="машалла это кто" className="fun-one" onOpen={onPhoto} />
        <Polaroid photo="eldarka2" caption="чисто горячая чикса" className="fun-two" onOpen={onPhoto} />
        <Polaroid photo="alikhan" caption="он что за лев" className="fun-three" onOpen={onPhoto} />
        <Polaroid photo="mansur" caption="чисто сельский" className="fun-four" onOpen={onPhoto} />
        <div className="sticker round-sticker" aria-hidden="true">100%<br />хаоса</div>
        <div className="sticker tiny-sticker" aria-hidden="true">лучший<br />чувак</div>
        <Doodle kind="spark" className="fun-spark-one" /> 
      </div>
      <div className="page-foot fun-foot">
        <Doodle kind="arrow" className="flow fun-arrow" />
        <span className="scribble fun-note">сюда смотреть!</span>
        <Doodle kind="spark" className="flow fun-spark-two" />
      </div>
    </PageFrame>
  );
}
