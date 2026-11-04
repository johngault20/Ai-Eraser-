# AI Eraser

A Chrome extension prototype that heuristically hides feed posts when their text or image metadata matches configurable patterns.

## Important limitation

This is not a true AI detector. Phrases and image metadata are weak signals: ordinary posts may be hidden, and AI-generated posts may not be detected.

## Files

- `manifest.json` — extension configuration and supported site URL patterns
- `content-script.js` — post scoring, DOM observation, and masking logic

## Load in Chrome

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Choose **Load unpacked**.
4. Select the folder containing `manifest.json`.
5. Visit a supported feed and test the behavior.

## Customize

Update `POST_SELECTOR` in `content-script.js` to match the site's post elements. You may also adjust `AI_TEXT_PATTERNS`, `AI_MEDIA_HINTS`, and `HIDE_THRESHOLD`.

Test against ordinary posts as well as known synthetic ones to check for false positives.
