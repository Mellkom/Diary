import { Action, Doodle, PageFrame, Polaroid } from "../components/Scrapbook";
import type { PhotoKey } from "../data/photos";

export const plans = ["Покушать суши", "Устроить пикник без повода", "Поехать отдыхать вместе", "Сделать ещё сотню фото"];

export default function Future({
  checked,
  onToggle,
  onPhoto,
}: {
  checked: number[];
  onToggle: (index: number) => void;
  onPhoto: (photo: PhotoKey, caption: string) => void;
}) {
  return (
    <PageFrame tone="future-page">
      <div className="page-head">
        <div className="page-kicker">следующая глава</div>
        <h2 className="script-heading compact-heading">Нам ещё столько предстоит</h2>
        <p className="future-intro">Некоторые воспоминания ещё даже не случились — давай создадим их вместе.</p>
      </div>
      <div className="page-body future-body">
        <div className="future-photo-card">
          <Polaroid photo="sairan" caption="место для будущего приключения" onOpen={onPhoto} tapes={["top-pink"]} />
        </div>
        <div className="plans-card">
          <div className="plans-title">Наш список «обязательно»:</div>
          {plans.map((plan, index) => {
            const isChecked = checked.includes(index);
            return (
              <Action
                key={plan}
                className="plan-row"
                role="checkbox"
                aria-checked={isChecked}
                onClick={() => onToggle(index)}
              >
                <span className={`checkbox ${isChecked ? "checked" : ""}`} aria-hidden="true">{isChecked ? "✓" : ""}</span>
                <span>{plan}</span>
              </Action>
            );
          })}
        </div>
        <div className="ticket-sticker" aria-hidden="true">куда угодно<br />вместе</div>
        <Doodle kind="arrow" className="future-arrow" />
      </div>
    </PageFrame>
  );
}
