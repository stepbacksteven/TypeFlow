# TypeFlow
> Version history 1.11
>
> 1.11: Added draggable positioning and resizing for the Google Docs toolbar.
> 1.10: Removed redundant timing and punctuation helper text.

## Important

> [!CAUTION]
> **Google Docs support is experimental.**
>
> I can't stop you from misusing this, but I do not condone using this on homework
> to fake human typing.
> It is wrong and you should think twice before stooping to this level.
> I created this strictly for educational purposes.
>
> 

## Google Docs Extension

The Google Docs extension is the main way to use TypeFlow with Google Docs. It adds a floating toolbar directly to Google Docs and progressively inserts the text you provide.

### What You Need

- Google Chrome.
- The TypeFlow project files.
- Permission to install unpacked Chrome extensions.

### 1. Download TypeFlow

1. Open the [TypeFlow GitHub repository](https://github.com/stepbacksteven/TypeFlow).
2. Click the green **Code** button.
3. Select **Download ZIP**.
4. Extract the ZIP file on your device.

### 2. Install the Extension

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Open the extracted TypeFlow folder.
5. Select the folder named `extension`.
6. The TypeFlow extension should now appear in your extensions list.

> [!WARNING]
> **Extension installation may be blocked on managed devices.**
>
> If Chrome displays "Extension installation is blocked by policy", your browser or device administrator controls extension installation. You will need the administrator to approve TypeFlow. Do not attempt to bypass your organization's device restrictions.

### 3. Use TypeFlow in Google Docs

1. Open or reload a Google Docs document.
2. Look for the TypeFlow toolbar near the top-right of the document.
3. Enter or paste your text into the toolbar.
4. Click the position in the document where you want the text inserted.
5. Choose your insertion speed and pacing settings.
6. Start insertion.
7. Use Pause and Resume to control the insertion.
8. Use Reset to end the run and return to the beginning. Close the toolbar with × and reopen it using the TypeFlow icon.

The extension uses Chrome's debugger permission to send text input to the focused Google Docs document. Chrome may display a debugging notification while the extension is active. Keep the Google Docs tab open during insertion.

### 4. Update the Extension

1. Download and extract the latest TypeFlow project files.
2. Open `chrome://extensions`.
3. Find TypeFlow and click **Reload**. If you replaced the project folder, load the updated `extension` folder instead.
4. Reload your Google Docs tab.

## Run TypeFlow Locally

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

For GitHub Codespaces, use:

```bash
npm run dev -- --host 0.0.0.0
```

## Feedback and Issues

If you find a bug or have a feature request, open an issue in the [TypeFlow GitHub repository](https://github.com/stepbacksteven/TypeFlow). Include your browser, the steps to reproduce the problem, and any error message. Do not include private documents or personal information.
