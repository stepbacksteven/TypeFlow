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
2. For standard websites, use the AccessDraft bookmarklet.
3. For Google Docs, install the Chrome extension in the `extension` folder. Do not use the bookmarklet on Google Docs.
4. Paste or type the text into the connector toolbar, click the intended position in the document, and begin insertion.
5. Set your pace and use pause, resume, stop, or reset as needed.

## Google Docs extension installation

1. In the Codespaces terminal, run `git pull` to get the latest changes.
2. Run `npm install` and `npm run dev -- --host 0.0.0.0` to start the AccessDraft web app.
3. In the Codespaces file explorer, open the `extension` folder and confirm it contains `manifest.json`, `background.js`, and `content.js`.
4. In Chrome, open `chrome://extensions`.
5. Turn on Developer mode.
6. Click Load unpacked and select the repository's `extension` folder.
7. Open or reload a Google Docs document. The AccessDraft Google Docs toolbar should appear at the bottom-right.
8. Paste or type your text into that toolbar. Click the desired insertion point in the document, then use Begin insertion.

Chrome will show a debugging notification while AccessDraft controls text insertion. The extension requests the debugger permission because it uses Chrome's DevTools Protocol to send actual text input to the focused document. Do not use Chrome DevTools debugging on the same tab at the same time.

To update the extension after pulling new code, return to `chrome://extensions` and click the extension's Reload button. Reload the Google Docs tab too.

## Standard website connector

The bookmarklet supports standard text inputs, textareas, and many contenteditable fields. Compatibility varies by site and editor. Some editors require their own integration and may reject synthetic input events.

## Privacy

No account is required. Prepared assignment text is kept in the current page state and is not saved to IndexedDB. Only preferences are stored locally in IndexedDB. Speech recognition uses the browser's speech recognition provider where available and may involve external processing. Microphone access starts only when requested.

## PWA

The Vite PWA plugin generates the web manifest and service worker during production builds. The app shell and static assets are precached for offline access. External webpage insertion, clipboard access, and browser speech recognition depend on browser permissions and page compatibility.

## Current implementation limits

- The progress preview in the main app is a pacing preview. It does not represent text accepted by an external page.
- The standard bookmarklet reports characters sent and dispatches input events. A webpage may still reject or transform them.
- The Google Docs extension uses Chrome's debugger permission and sends text through the DevTools Protocol. It requires Chrome, the extension to be enabled, and the document tab to remain open and focused.
- Test the connector on each target website before relying on it for important work.
