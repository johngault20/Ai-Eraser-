(() => {
  'use strict';

  // These are examples. Update them to match the site's feed markup.
  const POST_SELECTOR = [
    'article',
    '[role="article"]',
    'div[data-testid="tweet"]',
    'div.userPost',
    'div.thing',
    '.feed-shared-update-v2',
    '.post'
  ].join(', ');

  const AI_TEXT_PATTERNS = [
    /\bdelve into\b/i,
    /\btapestry of\b/i,
    /\btestament to\b/i,
    /\bbeacon of\b/i,
    /\bcaptivating world\b/i,
    /\bin conclusion\b/i,
    /\bfostering a sense of\b/i,
    /\bvibrant landscape\b/i,
    /\bgame-changer\b/i,
    /\bunwavering commitment\b/i
  ];

  const AI_MEDIA_HINTS = [
    'midjourney',
    'stable diffusion',
    'dall-e',
    'ai generated',
    'ai-generated',
    'digital art generated',
    'photorealistic render'
  ];

  const HIDE_THRESHOLD = 50;
  const HIDDEN_ATTR = 'data-ai-eraser-hidden';

  function installStyles() {
    if (document.getElementById('ai-eraser-styles')) return;

    const style = document.createElement('style');
    style.id = 'ai-eraser-styles';
    style.textContent =
      `[${HIDDEN_ATTR}="true"] { display: none !important; }`;

    (document.head || document.documentElement).appendChild(style);
  }

  function scorePost(post) {
    const text = post.innerText || '';
    let score = 0;

    for (const pattern of AI_TEXT_PATTERNS) {
      if (pattern.test(text)) score += 25;
    }

    const matchedMediaHints = new Set();

    for (const image of post.querySelectorAll('img')) {
      const metadata = [
        image.alt,
        image.title,
        image.currentSrc,
        image.src
      ].join(' ').toLowerCase();

      for (const hint of AI_MEDIA_HINTS) {
        if (metadata.includes(hint)) matchedMediaHints.add(hint);
      }
    }

    score += matchedMediaHints.size * 25;
    return score;
  }

  const queuedPosts = new Set();
  let scheduled = false;

  function queuePost(post) {
    if (!post || post.nodeType !== Node.ELEMENT_NODE) return;

    queuedPosts.add(post);
    if (scheduled) return;

    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;

      for (const postToCheck of queuedPosts) {
        if (!postToCheck.isConnected) continue;

        const shouldHide = scorePost(postToCheck) >= HIDE_THRESHOLD;
        const wasHidden = postToCheck.getAttribute(HIDDEN_ATTR) === 'true';

        if (shouldHide) {
          postToCheck.setAttribute(HIDDEN_ATTR, 'true');

          if (!wasHidden) {
            console.log('[AI Eraser] Hid a post based on heuristic score.');
          }
        } else {
          postToCheck.removeAttribute(HIDDEN_ATTR);
        }
      }

      queuedPosts.clear();
    });
  }

  function inspectNode(node) {
    if (!node) return;

    // Text nodes can be added to an existing post too.
    const element = node.nodeType === Node.ELEMENT_NODE
      ? node
      : node.parentElement;

    if (!element) return;

    if (element.matches(POST_SELECTOR)) {
      queuePost(element);
    }

    const containingPost = element.closest(POST_SELECTOR);
    if (containingPost) {
      queuePost(containingPost);
    }

    element.querySelectorAll(POST_SELECTOR).forEach(queuePost);
  }

  function init() {
    if (!document.body) return;

    installStyles();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes') {
          inspectNode(mutation.target);
        } else if (mutation.type === 'characterData') {
          inspectNode(mutation.target);
        } else {
          mutation.addedNodes.forEach(inspectNode);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['src', 'alt', 'title']
    });

    inspectNode(document.body);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
