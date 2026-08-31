import { useCallback, useEffect, useRef, useState } from "react";
import s from "./apps.module.scss";
import v from "./PhotoBoothApp.module.scss";
import { usePointerDrag } from "../os/hooks/usePointerDrag";
import { introVideo } from "../data/intro";

/**
 * The intro video, dressed as macOS Photo Booth: a black stage, a red shutter
 * button, a caption strip.
 *
 * Two things here are load-bearing rather than decorative:
 *
 * - `visible` comes from Window.jsx and is false when this window is minimized
 *   OR covered by another window on mobile. Minimized windows stay mounted
 *   (REVAMP.md §8.7), so without this the video keeps talking to an empty
 *   screen. Closing unmounts and needs no handling.
 * - `preload="metadata"`, never `auto`. The window only mounts when opened, but
 *   once open it must not pull megabytes for someone who never presses play.
 *
 * No autoplay: browsers block it with sound anyway, and a muted talking head is
 * pointless. Click-to-play over a poster also sidesteps `prefers-reduced-motion`
 * entirely — nothing moves until the visitor asks it to.
 *
 * The native `controls` bar is deliberately OFF. It duplicated the shutter
 * button and dragged along a fullscreen button and an overflow menu that have
 * no business inside a fake OS window. Everything it did that mattered —
 * play/pause, seek, volume, elapsed time — is rebuilt below, which also means
 * it can be styled to match the rest of the desktop.
 */

const SPEAKER_PATH = "M3.5 9.2h3l4.2-3.5v12.6L6.5 14.8h-3z";

function VolumeGlyph({ level, muted }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="18" height="18">
      <path d={SPEAKER_PATH} fill="currentColor" />
      {muted ? (
        <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M15.5 9.5l5 5" />
          <path d="M20.5 9.5l-5 5" />
        </g>
      ) : (
        <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" fill="none">
          <path d="M14.6 9.4a3.6 3.6 0 0 1 0 5.2" />
          {level > 0.5 && <path d="M17.2 7.1a7.2 7.2 0 0 1 0 9.8" opacity="0.75" />}
        </g>
      )}
    </svg>
  );
}

/** m:ss — the only shape a sub-hour clip ever needs. */
function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

const clamp01 = (n) => Math.min(Math.max(n, 0), 1);

function PhotoBoothApp({ visible = true }) {
  const videoRef = useRef(null);
  const trackRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  // §8.7: pause the moment this window stops being on screen.
  useEffect(() => {
    if (!visible) videoRef.current?.pause();
  }, [visible]);

  const toggle = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      // Older Safari returns undefined rather than a promise.
      el.play()?.catch(() => setFailed(true));
    } else {
      el.pause();
    }
  }, []);

  const seekToRatio = useCallback((ratio) => {
    const el = videoRef.current;
    if (!el || !Number.isFinite(el.duration)) return;
    el.currentTime = clamp01(ratio) * el.duration;
  }, []);

  // Drag anywhere on the track to scrub. Reuses the window system's drag hook
  // for its rAF coalescing and its text-selection guard; the hook reports
  // deltas, so the ratio the gesture started from is captured on pointerdown.
  const scrubOrigin = useRef({ ratio: 0, width: 1 });
  const beginScrub = usePointerDrag({
    onMove: ({ dx }) =>
      seekToRatio(scrubOrigin.current.ratio + dx / scrubOrigin.current.width),
  });

  const onTrackPointerDown = (event) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const ratio = clamp01((event.clientX - rect.left) / rect.width);
    scrubOrigin.current = { ratio, width: rect.width };
    seekToRatio(ratio);
    beginScrub(event);
  };

  // Arrow keys nudge by a second; the native controls used to provide this and
  // it is the only keyboard route to seeking now that they are gone.
  const onTrackKeyDown = (event) => {
    const el = videoRef.current;
    if (!el || !Number.isFinite(el.duration)) return;
    const step = event.shiftKey ? 5 : 1;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      el.currentTime = Math.min(el.duration, el.currentTime + step);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      el.currentTime = Math.max(0, el.currentTime - step);
    } else if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      toggle();
    }
  };

  const progress = duration > 0 ? clamp01(time / duration) : 0;
  const level = muted ? 0 : volume;

  return (
    <div className={`${s.appRoot} ${v.root}`}>
      <div className={v.stage}>
        {failed ? (
          <div className={v.failure}>
            <p className={v.failureText}>This browser can’t play the video.</p>
            <a
              className={`${s.button} ${s.buttonPrimary}`}
              href={introVideo.src}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open it directly
            </a>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className={v.video}
              poster={introVideo.poster}
              preload="metadata"
              playsInline
              aria-label={introVideo.title}
              onClick={started ? toggle : undefined}
              onPlay={() => {
                setPlaying(true);
                setStarted(true);
              }}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => {
                const el = e.currentTarget;
                setDuration(Number.isFinite(el.duration) ? el.duration : 0);
                setVolume(el.volume);
                setMuted(el.muted);
              }}
              // The element is the single source of truth for volume; React
              // state just mirrors it, so keyboard/OS changes stay in sync.
              onVolumeChange={(e) => {
                setVolume(e.currentTarget.volume);
                setMuted(e.currentTarget.muted);
              }}
              onError={() => setFailed(true)}
            >
              {/* `type` is omitted while the source is the placeholder .mov —
                  see the note in src/data/intro.js. */}
              <source src={introVideo.src} type={introVideo.type ?? undefined} />
            </video>

            {/* The click-to-play affordance, gone once playback has begun so it
                never sits on top of the video's own click-to-pause. */}
            {!started && (
              <button
                type="button"
                className={v.overlay}
                onClick={toggle}
                aria-label={`Play ${introVideo.title}`}
              >
                <span className={v.overlayShutter} aria-hidden="true" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Full-bleed scrub bar, sitting on the seam between stage and controls. */}
      <div
        ref={trackRef}
        className={v.track}
        onPointerDown={failed ? undefined : onTrackPointerDown}
        onKeyDown={onTrackKeyDown}
        role="slider"
        tabIndex={failed ? -1 : 0}
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(time)}
        aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
      >
        <span className={v.trackFill} style={{ width: `${progress * 100}%` }}>
          <span className={v.trackKnob} aria-hidden="true" />
        </span>
      </div>

      <div className={v.shutterBar}>
        <button
          type="button"
          className={v.shutter}
          onClick={toggle}
          disabled={failed}
          aria-label={playing ? "Pause" : "Play"}
        >
          <span
            className={`${v.shutterInner} ${playing ? v.shutterPlaying : ""}`}
            aria-hidden="true"
          />
        </button>

        <div className={v.captionBlock}>
          <p className={v.title}>{introVideo.title}</p>
          <p className={v.caption}>{introVideo.caption}</p>
        </div>

        <span className={v.time}>
          {formatTime(time)} / {formatTime(duration)}
        </span>

        <div className={v.volume}>
          <button
            type="button"
            className={v.volumeButton}
            disabled={failed}
            onClick={() => {
              const el = videoRef.current;
              if (el) el.muted = !el.muted;
            }}
            aria-label={muted ? "Unmute" : "Mute"}
          >
            <VolumeGlyph level={level} muted={muted || volume === 0} />
          </button>
          <input
            type="range"
            className={v.volumeSlider}
            min={0}
            max={1}
            step={0.01}
            value={level}
            disabled={failed}
            aria-label="Volume"
            onChange={(e) => {
              const el = videoRef.current;
              if (!el) return;
              el.volume = Number(e.target.value);
              // Dragging the slider up is an unmute in every player worth
              // copying.
              if (el.muted && el.volume > 0) el.muted = false;
            }}
          />
        </div>
      </div>

      {/* Phase 7: a video is invisible to crawlers, so the transcript is the
          only part of it that helps SEO. Absent until the words exist. */}
      {introVideo.transcript && (
        <div className={v.transcript}>
          <h2 className={v.transcriptHeading}>Transcript</h2>
          {introVideo.transcript.map((line, i) => (
            <p key={i} className={s.prose}>
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default PhotoBoothApp;
