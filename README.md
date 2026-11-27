# AccessDraft

> A browser-based text insertion tool designed to make writing more accessible.
>
> AccessDraft lets you prepare text, choose an insertion speed, and send it progressively into supported writing fields.

## Important

> [!CAUTION]
> **Google Docs support is experimental.**
>
> The Google Docs extension has not yet been fully tested in a live document. Its behaviour may vary by Chrome version, device, and browser policy. Do not rely on it for important work until you have tested it yourself.
>
> AccessDraft does not create fake typing mistakes, fake corrections, or randomized human typing patterns. It provides user-controlled text insertion and pacing.

## Available Methods

- [Standard Websites](#standard-website-connector)  
  Use the AccessDraft bookmarklet on supported text fields and editors.
- [Google Docs](#google-docs-extension)  
  Use the separate Chrome extension for progressive insertion in Google Docs.
- [Run AccessDraft Locally](#run-accessdraft-locally)  
  Run the web app from the project repository.

## What AccessDraft Does

- Lets you type or paste text into Assisted Input.
- Preserves your original wording, punctuation, capitalization, and paragraph breaks.
- Inserts text progressively at an adjustable pace.
- Offers character and word insertion modes where supported.
- Provides pause, resume, stop, and reset controls.
- Includes variable pacing and optional punctuation pauses.
- Shows word and character counts.
- Offers optional browser speech recognition where supported.

## 1. Standard Website Connector

The bookmarklet works with standard text inputs, textareas, and many contenteditable fields.

### Setup

1. Open AccessDraft in your browser.
2. Go to the Connect section.
3. Copy the AccessDraft bookmarklet.
4. Create a new Chrome bookmark.
5. Name it **AccessDraft**.
6. Paste the copied bookmarklet code into the bookmark's URL field.
7. Save the bookmark.

### Using the Connector

1. Open a website with a supported writing field.
2. Click the AccessDraft bookmark.
3. The floating AccessDraft toolbar should appear.
4. Enter or paste your text into the toolbar.
5. Click the intended insertion point in the webpage.
6. Choose your speed and pacing settings.
7. Start insertion. Use Pause, Resume, or Stop and reset as needed.

**Compatibility:** Some websites use custom editors that reject scripted input. Results can vary between websites. Always test the connector on the target website first.

## 2. Google Docs Extension

> [!WARNING]
> The bookmarklet does not provide direct Google Docs insertion. Use the separate extension for Google Docs.
>
> The extension requires Chrome's debugger permission. Chrome may display a notification while the extension controls text insertion. The extension cannot be installed if your device or browser administrator blocks it. Ask the administrator to approve it. AccessDraft does not provide a method to bypass managed-device restrictions.

### What You Need

- Google Chrome.
- The AccessDraft project files.
- Permission to install unpacked extensions in Chrome.

### Installing the Extension

1. Open the AccessDraft repository and download the project files.
2. Extract the downloaded ZIP file.
3. Open `chrome://extensions` in Chrome.
4. Turn on **Developer mode**, if Chrome allows it.
5. Select **Load unpacked**.
6. Choose the `extension` folder inside the extracted AccessDraft project.
7. Open or reload a Google Docs document.
8. The AccessDraft toolbar should appear near the bottom-right of the page.

If Chrome displays **Extension installation is blocked by policy**, the browser or device is managed by an administrator. You will need the administrator to allow the extension.

### Using the Google Docs Extension

1. Open your Google Docs document.
2. Enter or paste your text into the AccessDraft toolbar.
3. Click the exact position in the document where insertion should begin.
4. Set your words-per-minute speed and pacing options.
5. Select **Start**.
6. Use **Pause** to temporarily stop insertion.
7. Use **Resume** to continue from the same position.
8. Use **Stop and reset** to end the run and return to the beginning.

The extension uses Chrome's debugger permission and the Chrome DevTools Protocol to send text input to the focused document. Keep the Google Docs tab open while inserting text.

### Updating the Extension

1. Get the latest project files.
2. Open `chrome://extensions`.
3. Find AccessDraft and select **Reload**.
4. Reload your Google Docs tab.

## 3. Run AccessDraft Locally

### Requirements

- Node.js and npm.
- A browser such as Google Chrome.

### Start the App

Open a terminal in the project folder and run:

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal.

To create a production build:

```bash
npm run build
```

If you are using GitHub Codespaces, start the development server with:

```bash
npm run dev -- --host 0.0.0.0
```

## Pacing and Controls

- **WPM:** Choose a speed from 5 to 120 words per minute.
- **Variable pacing:** Adjusts the delay around your selected speed.
- **Punctuation pauses:** Adds short pauses after punctuation.
- **Pause:** Holds the current insertion position.
- **Resume:** Continues from where you paused.
- **Stop and reset:** Ends insertion and returns to the beginning.
- **Automatic reset:** Completed text is ready to insert again.

The Google Docs extension locks its text and pacing settings while insertion is running or paused. Stop and reset before changing those settings. This helps prevent focus from moving into the toolbar while text is being inserted.

Pause settings can add a fixed delay after a chosen number of words or after each sentence. A value of 0 disables that pause. These settings are controlled by you. AccessDraft does not add random delays to imitate a person.

## Privacy

- No account is required.
- Your prepared text stays in the current page state and is not saved to IndexedDB.
- AccessDraft stores preferences locally in IndexedDB.
- Speech recognition uses your browser's speech recognition provider where available. That provider may process audio externally.
- Microphone access starts only when you choose to use speech recognition.

## Current Limitations

- The main app's progress preview is a pacing preview. It does not confirm that another website accepted the text.
- The standard bookmarklet reports characters sent, but a website may reject or change the input.
- Website compatibility varies, especially with custom rich-text editors.
- Google Docs direct insertion is experimental and requires the extension to be installed and enabled.
- The Google Docs extension's focus handling and pacing need live testing.
- Browser speech recognition depends on browser support and permissions.
- External webpage insertion, clipboard access, and speech recognition may depend on browser permissions.

## Feedback and Issues

If you find a bug or have a feature request, open an issue in the AccessDraft GitHub repository. Include the browser, website, steps to reproduce the problem, and any error message. Do not include private documents or personal information.
