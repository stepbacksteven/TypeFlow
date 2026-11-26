# AccessDraft

AccessDraft is an installable, local-first Progressive Web App for preparing text and progressively inserting it into supported writing fields on other webpages.

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL in Chrome. Build with `npm run build`.

## Main workflow

1. Enter or paste text in Assisted Input.
2. Use Copy for connector.
3. Open the destination webpage.
4. Launch the AccessDraft bookmarklet from the Chrome bookmarks bar.
5. Paste the text into the floating toolbar.
6. Select a supported writing field, set a pace, and begin insertion.

The standalone app cannot directly control another browser tab. The bookmarklet runs on the destination page and provides the actual insertion controls.

## Supported destinations

The bookmarklet supports standard text inputs, textareas, and many contenteditable fields. Compatibility varies by site and editor. Iframes may be inaccessible because of browser same-origin restrictions. Some editors require their own editing APIs and may reject synthetic input events.

Google Docs uses a specialized editor. Direct bookmarklet insertion is not claimed as supported. Use the copy and paste fallback.

## Privacy

No account is required. Prepared assignment text is kept in the current page state and is not saved to IndexedDB. Only preferences are stored locally in IndexedDB. Speech recognition uses the browser's speech recognition provider where available and may involve external processing. Microphone access starts only when requested.

## PWA

The Vite PWA plugin generates the web manifest and service worker during production builds. The app shell and static assets are precached for offline access. External webpage insertion, clipboard access, and browser speech recognition depend on browser permissions and page compatibility.

## Current implementation limits

- The progress preview in the main app is a pacing preview. It does not represent text accepted by an external page.
- The floating bookmarklet reports characters sent and dispatches input events. A webpage may still reject or transform them, so the connector cannot guarantee that every destination accepted the text.
- Test the connector on each target website before relying on it for important work.
