import { Doodle, PageFrame } from "../components/Scrapbook";
import { diary } from "../data/diary";

export default function Letter() {
  return (
    <PageFrame tone="letter-page">
      <Doodle kind="flower" className="pressed-flower" />
      <div className="page-head">
        <div className="page-kicker">несколько важных строк</div>
        <h2 className="script-heading letter-heading">Кое-что, что я хочу тебе сказать</h2>
      </div>
      <div className="page-body letter-body">
        <div className="letter-sheet">
          <div className="letter-text">
            <p>
              Иногда мы не замечаем, как много света приносим в жизнь других людей. Поэтому я хочу, чтобы ты знал: рядом с тобой можно быть собой, ты комфортный человек с которым время не то что летит, его как будто бы и не было вовсе.
            </p>
            <p>
              Спасибо тебе за заботу в мелочах, за честность и за все наши незабываемые моменты. Надеюсь этот год в твоей жизни не принесет тебе рассыпаный в трусы позвоночник. И пусть ты всегда помнишь, какая ты афигенный и просто суперский.
            </p>
          </div>
          <div className="letter-end">
            <Doodle kind="heart" className="flow letter-heart" />
            <div className="signature">всегда рядом,<br />{diary.letterSignature}</div>
          </div>
        </div>
      </div>
    </PageFrame>
  );
}
