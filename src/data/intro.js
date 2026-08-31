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
  src: "https://pub-3479d06d572e48b384c17dc7a7921d8a.r2.dev/videos/Movie%20on%2012-08-26%20at%2021.11.mov",

  // null = omit the attribute and let the browser sniff the response's
  // Content-Type. Deliberate: `type="video/quicktime"` would make Chrome skip
  // the file without trying it, and claiming `video/mp4` for a QuickTime
  // container would be a lie that only happens to work. Set this to
  // "video/mp4" once the real encode is up.
  type: null,

  poster: "/images/intro-poster.jpg",

  title: "Hello, I'm Ammar",
  caption: "A quick hello — because a CV only tells you so much.",

  // Phase 7 slot (a11y + SEO). A video is invisible to crawlers, so this
  // transcript is the only part of it that helps search — and captions decide
  // whether the video is watchable at all for a chunk of visitors. Renders
  // nothing while null; fill it in with what's actually said on camera.
  transcript: null,
};
