(() => {
  if (window.top !== window || document.getElementById("accessdraft-docs-extension")) return;

  const host = document.createElement("div");
  host.id = "accessdraft-docs-extension";
  host.style.cssText = "all:initial;position:fixed;right:18px;bottom:18px;z-index:2147483647";
  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = `
    <style>
      *{box-sizing:border-box;font:14px Arial,sans-serif}
      section{width:350px;background:#fff;color:#20283a;border:1px solid #dfe3ef;border-radius:14px;box-shadow:0 12px 40px #17213a33;padding:14px}
      header,.row{display:flex;justify-content:space-between;align-items:center;gap:8px}
      header{font-weight:700;margin-bottom:10px}
      textarea{display:block;width:100%;height:125px;resize:vertical;border:1px solid #dfe3ef;border-radius:8px;padding:9px;line-height:1.5;color:#20283a;background:#fff}
      input[type=range]{width:145px}
      button{border:1px solid #d9deea;background:#f7f8fc;color:#263248;border-radius:7px;padding:8px 10px;cursor:pointer;margin:3px 3px 3px 0}
      button.primary{background:#315fce;color:white;border-color:#315fce}
      button:disabled{opacity:.45;cursor:not-allowed}
      #state{color:#687087;font-size:12px;margin-top:8px;line-height:1.4;min-height:30px}
      .close{border:0;font-size:18px;background:transparent;padding:2px}
      label{font-size:12px}
    </style>
    <section>
      <header><span>AccessDraft · Google Docs</span><button class="close" id="close" title="Close">×</button></header>
      <textarea id="text" placeholder="Paste or type text here"></textarea>
      <div class="row"><label>Speed <b id="speedval">50</b> WPM</label><input id="speed" type="range" min="5" max="120" value="50"></div>
      <div class="row"><label><input id="variable" type="checkbox" checked> Variable pace</label><label><input id="pauses" type="checkbox" checked> Punctuation pauses</label></div>
      <div>
        <button class="primary" id="start">Begin insertion</button>
        <button id="pause">Pause</button>
        <button id="resume">Resume</button>
        <button id="stop">Stop</button>
        <button id="reset">Reset</button>
      </div>
      <div id="state" role="status">Paste your text, click where you want it in the document, then begin insertion.</div>
    </section>`;

  const $ = id => shadow.getElementById(id);
  const state = value => { $("state").textContent = value; };
  let sourceIndex = 0;
  let running = false;
  let paused = false;
  let timer = null;
  let attached = false;

  // Keep toolbar buttons from stealing focus from Google's editing surface.
  shadow.addEventListener("mousedown", event => {
    if (event.target instanceof HTMLButtonElement) event.preventDefault();
  });

  const findEditor = () => {
    const frame = document.querySelector("iframe.docs-texteventtarget-iframe");
    try {
      return frame?.contentDocument?.querySelector('[contenteditable="true"][role="textbox"]') || null;
    } catch {
      return null;
    }
  };

  const paceDelay = (char, next) => {
    let delay = 2400 / Number($("speed").value);
    if ($("variable").checked) delay *= 0.82 + Math.random() * 0.36;
    if (char === " " || char === "\t") delay += 75;
    if ($("pauses").checked && /[,;:]/.test(char)) delay += 180;
    if ($("pauses").checked && /[.!?]/.test(char)) delay += 350;
    if (char === "\n" && next === "\n") delay += 650;
    return Math.max(8, delay);
  };

  const send = message => new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, response => {
      if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
      if (!response?.ok) return reject(new Error(response?.error || "The extension could not send text."));
      resolve(response);
    });
  });

  const finish = async message => {
    running = false;
    paused = false;
    clearTimeout(timer);
    timer = null;
    state(message);
    if (attached) {
      try { await send({ type: "ACCESSDRAFT_DETACH" }); } catch {}
      attached = false;
    }
  };

  const step = async () => {
    if (!running || paused) return;
    const text = $("text").value;
    if (sourceIndex >= text.length) {
      sourceIndex = 0;
      await finish("Finished. Ready to insert the same text again.");
      return;
    }
    const char = text[sourceIndex];
    try {
      await send({ type: "ACCESSDRAFT_INSERT", text: char });
      sourceIndex += 1;
      state("Inserted " + sourceIndex + " of " + text.length + " characters.");
      if (sourceIndex >= text.length) {
        sourceIndex = 0;
        await finish("Finished. Ready to insert the same text again.");
        return;
      }
      timer = setTimeout(step, paceDelay(char, text[sourceIndex] || ""));
    } catch (error) {
      await finish("Stopped: " + error.message);
    }
  };

  $("speed").addEventListener("input", () => { $("speedval").textContent = $("speed").value; });
  $("start").addEventListener("click", async () => {
    const text = $("text").value;
    if (!text) return state("Paste or type text before starting.");
    if (running) return;
    const editor = findEditor();
    if (!editor) return state("Google Docs editor not found. Reload the document and try again.");
    editor.focus();
    state("Connecting to Google Docs…");
    try {
      await send({ type: "ACCESSDRAFT_ATTACH" });
      attached = true;
      running = true;
      paused = false;
      if (sourceIndex >= text.length) sourceIndex = 0;
      state("Connected. Inserting text progressively…");
      step();
    } catch (error) {
      await finish("Could not connect: " + error.message);
    }
  });
  $("pause").addEventListener("click", () => {
    if (!running) return;
    paused = true;
    clearTimeout(timer);
    state("Paused at character " + sourceIndex + " of " + $("text").value.length + ".");
  });
  $("resume").addEventListener("click", () => {
    if (!running || !paused) return;
    paused = false;
    state("Resuming…");
    step();
  });
  $("stop").addEventListener("click", () => { void finish("Stopped at character " + sourceIndex + ". Press Begin to start again."); });
  $("reset").addEventListener("click", () => {
    sourceIndex = 0;
    void finish("Progress reset. Ready to start from the beginning.");
  });
  $("close").addEventListener("click", () => {
    void finish("Connector closed.");
    host.remove();
  });

  document.documentElement.appendChild(host);
})();