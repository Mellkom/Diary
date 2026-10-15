
/**
 * Фотографии дневника.
 *
 * ⚠ СЕЙЧАС ЗДЕСЬ ДЕМО-ФОТОГРАФИИ С UNSPLASH — их нужно заменить своими.
 *
 * Как заменить:
 *  1. Положите файлы в папку  public/photos/  (например, public/photos/lake.jpg).
 *  2. Вместо ссылки укажите  photo("lake.jpg")  — путь подставится сам и будет
 *     работать при любой настройке base в vite.config.ts.
 *  3. Ключи (group, lake, …) менять не нужно — на них ссылаются страницы.
 *
 * Подписи под фото лежат в самих страницах (src/pages/*.tsx, атрибут caption).
 * Для миниатюр фото обрезаются по рамке, в увеличенном просмотре показываются целиком.
 */

/** Путь к файлу из public/photos/ с учётом base. */
export const photo = (fileName: string) => `${import.meta.env.BASE_URL}photos/${fileName}`;

export const photos = {
  /** Обложка, «Смешные моменты», «Финал» — общая фотография компании. ЗАМЕНИТЬ. */
  eldarka: photo("IMG_E0142.jpg"),
  eldarka2: photo("IMG_E0146.jpg"),

  alikhan: photo("BCLE1111.jpg"),
  
  dilnur: photo("UYQD3429.jpg"),
  
  mansur: photo("IMG_0081.jpg"),
  
  group: photo("comu1987.jpg"),

  picnic: photo("IMG_0140.jpg"),

  grass: photo("IMG_0141.jpg"),

  park: photo("HJRW2225.jpg"),

  fishing: photo("NONM7432.jpg"),

  sairan: photo("IMG_0148.jpg")
};

export type PhotoKey = keyof typeof photos;
