import { Doodle, PageFrame } from "../components/Scrapbook";

/** Внутренняя сторона задней обложки — спокойное завершение дневника. */
export default function InsideCover() {
  return (
    <PageFrame tone="inside-cover-page">
      <div className="inside-cover-note">
        <Doodle kind="flower" className="inside-cover-flower" />
        <div className="page-kicker inside-cover-kicker">последняя страница</div>
        <h2 className="script-heading inside-cover-title">Пусть эти страницы будут рядом</h2>
        <p className="inside-cover-copy">
          Дневник можно открывать снова — в любой день и на любой странице. Пусть он напоминает о хорошем.
        </p>
        <div className="inside-cover-sign">с днём рождения</div>
      </div>
    </PageFrame>
  );
}
