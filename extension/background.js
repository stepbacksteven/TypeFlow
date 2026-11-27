const attachedTabs = new Set();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const tabId = sender.tab?.id;
  if (!Number.isInteger(tabId)) {
    sendResponse({ ok: false, error: "Could not identify the Google Docs tab." });
    return false;
  }

  (async () => {
    const target = { tabId };
    if (message.type === "TYPEFLOW_ATTACH") {
      if (!attachedTabs.has(tabId)) {
        try {
          await chrome.debugger.attach(target, "1.3");
          attachedTabs.add(tabId);
        } catch (error) {
          if (!String(error?.message || error).includes("Another debugger is already attached")) {
            throw error;
          }
          attachedTabs.add(tabId);
        }
      }
      return { ok: true };
    }

    if (message.type === "TYPEFLOW_INSERT") {
      if (!attachedTabs.has(tabId)) throw new Error("Start insertion again to reconnect to Google Docs.");
      await chrome.debugger.sendCommand(target, "Input.insertText", { text: message.text });
      return { ok: true };
    }

    if (message.type === "TYPEFLOW_DETACH") {
      if (attachedTabs.has(tabId)) {
        await chrome.debugger.detach(target);
        attachedTabs.delete(tabId);
      }
      return { ok: true };
    }

    throw new Error("Unknown TypeFlow command.");
  })().then(sendResponse).catch(error => sendResponse({ ok: false, error: String(error?.message || error) }));

  return true;
});

chrome.debugger.onDetach.addListener(source => {
  if (Number.isInteger(source.tabId)) attachedTabs.delete(source.tabId);
});

chrome.tabs.onRemoved.addListener(tabId => {
  attachedTabs.delete(tabId);
});