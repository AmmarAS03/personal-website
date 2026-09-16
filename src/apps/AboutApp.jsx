import { useState } from "react";
import s from "./apps.module.scss";
import a from "./AboutApp.module.scss";
import { aboutSlides } from "../data/about";

const pad = (n) => String(n).padStart(2, "0");

/** One chapter at a time: the photo on the left, the story on the right. */
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
    <div className={`${s.appRoot} ${a.root}`} tabIndex={-1} onKeyDown={onKeyDown}>
      <div className={s.toolbar}>
        <button
          type="button"
          className={s.button}
          onClick={() => step(-1)}
          aria-label="Previous chapter"
        >
          ‹
        </button>
        <button
          type="button"
          className={s.button}
          onClick={() => step(1)}
          aria-label="Next chapter"
        >
          ›
        </button>
        <span className={s.toolbarTitle}>{slide.title}</span>
        <span className={s.toolbarSpacer} />
        <span className={`${s.hint} ${a.hint}`}>← → to browse</span>
      </div>

      {/* Keyed on the slide so switching chapters replays the fade. */}
      <div key={slide.id} className={`${a.body} ${a.fade}`}>
        <figure className={a.media}>
          <div className={a.frame}>
            <img className={a.photo} src={slide.image} alt={slide.title} />
          </div>
        </figure>

        <div className={a.text}>
          <p className={a.eyebrow}>
            {pad(index + 1)} / {pad(aboutSlides.length)}
          </p>
          <h2 className={a.title}>{slide.title}</h2>
          {slide.paragraphs.map((text, i) => (
            <p key={i} className={a.paragraph}>
              {text}
            </p>
          ))}
        </div>
      </div>

      <nav className={a.chapters} aria-label="Chapters">
        {aboutSlides.map((item, i) => (
          <button
            key={item.id}
            type="button"
            className={`${a.chapter} ${i === index ? a.chapterActive : ""}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
          >
            <img className={a.chapterThumb} src={item.image} alt="" />
            <span className={a.chapterLabel}>{item.title}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default AboutApp;
