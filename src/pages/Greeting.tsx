import { Doodle, PageFrame, Polaroid } from "../components/Scrapbook";
import { diary } from "../data/diary";
import type { PhotoKey } from "../data/photos";

export default function Greeting({ onPhoto }: { onPhoto: (photo: PhotoKey, caption: string) => void }) {
  return (
    <PageFrame tone="greeting-page">
      <div className="page-head">
        <div className="page-kicker">{diary.birthdayKicker}</div>
        <h2 className="script-heading greeting-heading">С днём рождения!</h2>
        <p className="greeting-message">
          Пусть впереди будет ещё больше дней, которые захочется сохранить между этими страницами.
        </p>
      </div>
      <div className="page-body hero-body">
        <div className="hero-photo-wrap">
          <Polaroid photo="group" caption="там, где всегда хорошо" onOpen={onPhoto} tapes={["top-pink"]} />
        </div>
        <Doodle kind="spark" className="greet-spark" />
        <Doodle kind="heart" className="greet-heart" />
      </div>
      <div className="page-foot greeting-foot">
        <span className="turn-hint">листай дальше <span aria-hidden="true">→</span></span>
        <span className="margin-note">ты делаешь обычные дни особенными</span>
      </div>
    </PageFrame>
  );
}
