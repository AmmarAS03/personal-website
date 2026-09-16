/**
 * The Photo Booth app's video. Public URL on Cloudflare R2, so it lives here
 * with the rest of the content — no env var, no secret.
 *
 * ⚠️ THE CURRENT FILE IS A PLACEHOLDER. It is a raw QuickTime screen recording:
 * H.264 High + AAC-LC (good), but in a `.mov` container served as
 * `video/quicktime` (Firefox refuses it, Chrome is inconsistent) with the moov
 * atom at the END of the file (so the browser must download all 6.16 MB before
 * it can paint a single frame — `preload="metadata"` buys nothing).
 *
 * SWAPPING IN THE REAL VIDEO — three steps:
 *
 *   1. Encode. `-movflags +faststart` is the non-negotiable flag; it moves the
 *      moov atom to the front so playback starts on the first chunk:
 *
 *        ffmpeg -i real-intro.mov \
 *          -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 21 -preset slow \
 *          -vf "scale=-2:1080" -c:a aac -b:a 128k -ac 2 \
 *          -movflags +faststart intro.mp4
 *
 *        ffmpeg -ss 00:00:02 -i intro.mp4 -frames:v 1 -q:v 3 \
 *          public/images/intro-poster.jpg
 *
 *   2. Upload to R2 with `Content-Type: video/mp4` and
 *      `Cache-Control: public, max-age=31536000, immutable`. Because that cache
 *      is immutable, give every new cut a NEW FILENAME (intro-v2.mp4) rather
 *      than overwriting — otherwise viewers keep the old one for a year.
 *
 *   3. Edit below: point `src` at the new URL and set `type: "video/mp4"`.
 *
 * The `pub-<hash>.r2.dev` host is Cloudflare's development URL — rate-limited,
 * and not meant for production. Put a custom domain in front of the bucket
 * before this site is real.
 */
export const introVideo = {
  src: "https://pub-3479d06d572e48b384c17dc7a7921d8a.r2.dev/videos/intro-v2.mp4",

  // Real encode is up (faststart mp4, H.264 + AAC) — safe to assert the type.
  type: "video/mp4",

  poster: "/images/intro-poster.jpg",

  title: "Hello, I'm Ammar",

  // Timed lines (seconds, from the start of playback) — the live caption.
  // PhotoBoothApp shows whichever line's `start` is the most recent one at
  // or before the current playhead.
  transcript: [
    { start: 0, text: "Hey guys, I'm Ammar" },
    { start: 1.32, text: "welcome to my website." },
    { start: 3.14, text: "I'm based in Brisbane," },
    { start: 4.02, text: "currently working for Distrosub and Meels" },
    { start: 6.74, text: "as their tech lead," },
    { start: 8.02, text: "both are early-stage startups." },
    { start: 10.94, text: "I have a passion in building products" },
    { start: 12.48, text: "where I can be creative and technical" },
    { start: 14.24, text: "at the same time." },
    { start: 15.02, text: "So please feel free to look around" },
    { start: 17.82, text: "to know more about me" },
    { start: 18.78, text: "and connect with me." },
    { start: 20.22, text: "Bye!" },
  ],
};
