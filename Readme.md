# AI Eraser

AI Eraser is a Chrome extension prototype that scans selected feed-like elements for phrases associated with AI generation. It is a phrase-matching tool, not an AI detector, and it cannot verify who created a post.

## Behavior

- Scans post text and image `alt`/`title` labels for a small set of AI-generation phrases.
- When a phrase matches, displays a notice explaining the matched rule and, by default, hides the matching element. Turn off automatic hiding in the popup to leave flagged content visible.
- Lets you choose **Show anyway (not AI)** or **Confirm AI**. Feedback is aggregated by rule and stored locally in Chrome storage.
- The popup displays feedback totals, lets you export or clear them, and controls automatic hiding.
- Feedback is not uploaded and does not automatically change or train the detection rules.

## Install in Chrome

1. Open `chrome://extensions` and enable **Developer mode**.
2. Select **Load unpacked** and choose the folder containing `manifest.json`.
3. Visit a matching supported feed and try the controls.

The manifest matches pages on X/Twitter, Facebook, Instagram, LinkedIn, Reddit, and YouTube. The content script uses general DOM selectors, so coverage varies by site and may break when a site changes its page markup.

## Important limitations

Phrase matches are not proof of AI authorship. The script does not understand context, quotation, negation, or who wrote the text. A post may be flagged because it discusses AI or quotes someone else; undisclosed AI-generated content may not be flagged. Treat matches as clues and use the override controls.

Feedback counters are simple local statistics, not a validated accuracy measure. They can be affected by repeated posts, multiple tabs, and concurrent storage updates; they should not be treated as a reliable evaluation dataset.

## Files

- `manifest.json` — Manifest V3 configuration and popup wiring
- `content-script.js` — phrase matching, notices, hiding, and feedback collection
- `popup.html` — popup structure
- `popup.js` — popup settings and feedback display/export/reset
- `popup.css` — popup styling
- `LICENSE` — Apache License 2.0
