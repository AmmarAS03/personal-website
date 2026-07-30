import { useState } from "react";
import s from "./apps.module.scss";
import { aboutSlides } from "../data/about";

/** Photos-style walk through the life-story slides. */
function AboutApp() {
  const [index, setIndex] = useState(0);
  const slide = aboutSlides[index];

  const step = (delta) =>
    setIndex((i) => (i + delta + aboutSlides.length) % aboutSlides.length);

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  return (
    // tabIndex lets the arrow-key handler work once the window is clicked into.
    <div className={s.appRoot} tabIndex={-1} onKeyDown={onKeyDown}>
      <div className={s.toolbar}>
        <button type="button" className={s.button} onClick={() => step(-1)}>
          ‹
        </button>
        <button type="button" className={s.button} onClick={() => step(1)}>
          ›
        </button>
        <span className={s.toolbarTitle}>{slide.title}</span>
        <span className={s.toolbarSpacer} />
        <span className={s.hint}>
          {index + 1} of {aboutSlides.length} · ← → to browse
        </span>
      </div>

      <div className={s.detailScroll}>
        <div className={s.imageFrame}>
          <img className={s.image} src={slide.image} alt={slide.title} />
        </div>
        {slide.paragraphs.map((text, i) => (
          <p key={i} className={s.prose}>
            {text}
          </p>
        ))}
      </div>

      <div className={s.rail}>
        {aboutSlides.map((item, i) => (
          <button
            key={item.id}
            type="button"
            className={`${s.thumb} ${i === index ? s.thumbActive : ""}`}
            aria-label={item.title}
            aria-current={i === index}
            onClick={() => setIndex(i)}
          >
            <img src={item.image} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default AboutApp;
