# AccessDraft

AccessDraft is an accessibility-focused Progressive Web App designed for Chromebook screens. Phase 1 provides a responsive dashboard, a writing workspace, local document storage, and offline app loading.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Phase 1 notes

- Drafts are stored in IndexedDB in the current browser profile.
- The app shell and built assets are cached for offline loading after the first successful visit.
- Install support uses the browser's PWA install prompt when available. ChromeOS requires HTTPS or localhost.
- Clearing browser site data can remove locally stored drafts. Export and cloud sync are not part of Phase 1.

## Roadmap

Later phases can add assistive writing tools, text-to-speech, speech input, reading support, document export, and optional sync without changing the IndexedDB draft model or the main navigation structure.
