import { Action, Doodle, PageFrame } from "../components/Scrapbook";

export default function Envelope({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <PageFrame tone="envelope-page">
      <div className="page-head center-head">
        <div className="page-kicker">маленький секрет</div>
        <h2 className="script-heading compact-heading">На случай особенного дня</h2>
      </div>
      <div className="page-body envelope-body">
        <div className="envelope-scene">
          <div className={`secret-letter ${open ? "revealed" : ""}`} aria-hidden={!open}>
            <div className="secret-title">Твоя улыбка меняет всё.</div>
            <div className="secret-copy">Даже самый серый день становится теплее. Просто напоминаю: ты — очень имбовый и самый топовый чувак.</div>
            <div className="secret-sign">обнимаем крепко</div>
          </div>
          <Action
            className={`envelope ${open ? "is-open" : ""}`}
            onClick={onToggle}
            label={open ? "Закрыть конверт" : "Открыть конверт"}
            aria-expanded={open}
          >
            <span className="envelope-back" />
            <span className="envelope-flap" />
            <span className="envelope-front" />
            <span className="heart-seal"><Doodle kind="heart" /></span>
          </Action>
        </div>
        <Doodle kind="spark" className="envelope-spark" />
      </div>
      <div className="page-foot center-foot">
        <div className="envelope-message">Открой, когда захочется улыбнуться</div>
        <div className="tap-hint">{open ? "нажми, чтобы закрыть" : "нажми на конверт"}</div>
      </div>
    </PageFrame>
  );
}
