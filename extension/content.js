(() => {
  if (window.top !== window || document.getElementById("typeflow-docs-extension")) return;

  const host = document.createElement("div");
  host.id = "typeflow-docs-extension";
  host.style.cssText = "all:initial;position:fixed;right:18px;top:160px;z-index:2147483647";
  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = `
    <style>
      *{box-sizing:border-box;font:14px Arial,sans-serif}
      section{width:354px;background:#fff;color:#293B40;border:1px solid #DCE7E2;border-radius:14px;box-shadow:0 12px 36px rgba(37,65,59,.16);padding:15px}
      header,.row,.line{display:flex;justify-content:space-between;align-items:center;gap:8px}
      header{font-weight:700;margin-bottom:12px;color:#293B40}
      .brand{display:flex;align-items:center;gap:9px}
      .brand-mark{width:28px;height:28px;display:grid;place-items:center;border-radius:9px;overflow:hidden;background:#315E58;box-shadow:0 2px 5px rgba(49,94,88,.18)}
      .brand-mark svg{width:28px;height:28px;display:block}
      textarea{display:block;width:100%;height:125px;resize:vertical;border:1px solid #DCE7E2;border-radius:8px;padding:10px;line-height:1.5;color:#293B40;background:#FCFDFC;outline:none}
      textarea:focus,.num:focus{border-color:#78A69B;box-shadow:0 0 0 2px rgba(83,139,127,.12)}
      input[type=range]{width:145px;accent-color:#477F76}
      button{border:1px solid #DCE7E2;background:#F7FAF8;color:#405650;border-radius:7px;padding:8px 10px;cursor:pointer;margin:3px 3px 3px 0;transition:background .15s,border-color .15s}
      button:hover:not(:disabled){background:#EDF4F0;border-color:#C8DAD2}
      button.primary{background:#477F76;color:white;border-color:#477F76;font-weight:600}
      button.primary:hover:not(:disabled){background:#386D65;border-color:#386D65}
      button:disabled,input:disabled,textarea:disabled{opacity:.48;cursor:not-allowed}
      label{font-size:12px;color:#5E716B}
      .opts{display:grid;gap:6px;margin:8px 0 6px;padding:9px 10px;background:#F6F9F7;border:1px solid #E6EEEA;border-radius:8px}
      .unit{display:flex;align-items:center;gap:6px;font-size:12px;color:#71827C}
      .num{width:58px;text-align:right;border:1px solid #DCE7E2;border-radius:6px;padding:4px 6px;font-size:12px;color:#293B40;background:#fff}
      .foot{display:flex;align-items:flex-end;justify-content:space-between;gap:8px;margin-top:7px}
      #state{flex:1;color:#71827C;font-size:10px;line-height:1.4;min-height:13px}
      .version{flex:none;white-space:nowrap;text-align:right;font-size:9.5px;color:#9AA9A3}
      .close{border:0;font-size:18px;background:transparent;padding:2px;color:#71827C}
      .close:hover{background:#F1F5F2}
      .checks{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:7px}
      .checks label{display:flex;align-items:center;gap:4px;white-space:nowrap}
      .hint{font-size:10px;line-height:1.4;color:#82928C;margin:5px 1px 2px}
      .actions{display:flex;align-items:center;gap:5px;margin-top:8px}
      .actions button{flex:1;margin:0;padding:8px 5px;white-space:nowrap}
      .actions button.primary{flex:1.1}
      .speed-row{margin-top:5px}
      #reopen{display:none;width:40px;height:40px;padding:0;border:1px solid #DCE7E2;border-radius:12px;background:#315E58;box-shadow:0 4px 14px rgba(37,65,59,.18);cursor:pointer;place-items:center}
      #reopen svg{width:28px;height:28px;display:block}
    </style>
    <section id="panel">
      <header><span class="brand"><span class="brand-mark"><svg viewBox="0 0 64 64" aria-hidden="true"><path d="M15 18h34M32 18v31" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M32 36c0-8 6-14 14-14h4" fill="none" stroke="#A9D6C8" stroke-width="5" stroke-linecap="round"/><circle cx="50" cy="22" r="3.5" fill="#A9D6C8"/></svg></span><span>TypeFlow <span style="font-weight:400;color:#83938D">for Google Docs</span></span></span><button class="close" id="close" title="Close">×</button></header>
      <textarea id="text" placeholder="Paste or type text here"></textarea>
      <div class="row speed-row"><label>Speed <b id="speedval">50</b> WPM</label><input id="speed" type="range" min="5" max="120" value="50" aria-label="Target words per minute"></div>
      <div class="checks">
        <label title="Gradually shifts the active speed by up to 10 WPM around your selected target."><input id="variable" type="checkbox" checked> Timing variation</label>
        <label title="Adds short waits after commas, semicolons, colons, and sentence endings."><input id="pauses" type="checkbox" checked> Punctuation pauses</label>
      </div>
      <div class="hint">Timing variation gently changes your speed. Punctuation pauses add brief waits after punctuation.</div>
      <div class="opts">
        <div class="line"><label for="wordsEvery">Pause every</label><span class="unit"><input id="wordsEvery" class="num" type="text" inputmode="numeric" autocomplete="off" maxlength="3" value="0"> words</span></div>
        <div class="line"><label for="wordsPause">Then pause for</label><span class="unit"><input id="wordsPause" class="num" type="text" inputmode="decimal" autocomplete="off" maxlength="5" value="2"> sec</span></div>
        <div class="line"><label for="sentPause">After each sentence</label><span class="unit"><input id="sentPause" class="num" type="text" inputmode="decimal" autocomplete="off" maxlength="5" value="0"> sec</span></div>
      </div>
      <div class="actions">
        <button class="primary" id="start">Begin</button>
        <button id="pause">Pause</button>
        <button id="resume">Resume</button>
        <button id="stop">Reset</button>
      </div>
      <div class="foot">
        <div id="state" role="status">Click in the doc, then Begin</div>
        <div class="version" id="version"></div>
      </div>
    </section>
    <button id="reopen" type="button" title="Reopen TypeFlow" aria-label="Reopen TypeFlow"><svg viewBox="0 0 64 64" aria-hidden="true"><path d="M15 18h34M32 18v31" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M32 36c0-8 6-14 14-14h4" fill="none" stroke="#A9D6C8" stroke-width="5" stroke-linecap="round"/><circle cx="50" cy="22" r="3.5" fill="#A9D6C8"/></svg></button>`;

  // Bump on every update: 1.00 was the starting version, then +0.01 per update. Keep manifest.json in sync.
  const VERSION = "1.09";
  const $ = id => shadow.getElementById(id);
  $("version").textContent = "Version history " + VERSION;
  const state = value => { $("state").textContent = value; };
  let sourceIndex = 0;
  let running = false;
  let paused = false;
  let timer = null;
  let attached = false;
  let activeEditor = null;
  let sending = false;
  let wordsSincePause = 0;
  let targetWpm = Number($("speed").value);
  let activeWpm = targetWpm;
  let driftCounter = 0;

  // Prevent toolbar buttons from moving the Docs caret.
  shadow.addEventListener("mousedown", event => {
    if (event.target instanceof HTMLButtonElement) event.preventDefault();
  });

  const renderSpeed = () => {
    const shown = Math.round(activeWpm);
    $("speed").value = String(shown);
    $("speedval").textContent = String(shown);
  };

  // Move the displayed speed gradually, never more than 10 WPM from the chosen target.
  const updateVariableSpeed = () => {
    if (!$("variable").checked) {
      activeWpm = targetWpm;
      renderSpeed();
      return;
    }
    driftCounter += 1;
    if (driftCounter % 12 !== 0) return;
    let next = activeWpm;
    if (Math.random() < 0.25 && Math.abs(next - targetWpm) > 0) {
      next += Math.sign(targetWpm - next);
    } else {
      next += Math.random() < 0.5 ? -1 : 1;
    }
    const lower = Math.max(5, targetWpm - 10);
    const upper = Math.min(120, targetWpm + 10);
    activeWpm = Math.max(lower, Math.min(upper, next));
    renderSpeed();
  };

  // Number fields accept digits only; the seconds fields also accept one "." and at most two decimals.
  const cleanNumber = (el, decimals) => {
    let value = el.value.replace(decimals ? /[^0-9.]/g : /[^0-9]/g, "");
    if (decimals) {
      const dot = value.indexOf(".");
      if (dot !== -1) value = value.slice(0, dot + 1) + value.slice(dot + 1).replace(/\./g, "").slice(0, 2);
    }
    if (el.value !== value) el.value = value;
  };
  const commitNumber = (el, decimals, max) => {
    let n = parseFloat(el.value);
    if (!Number.isFinite(n)) n = 0;
    n = Math.min(max, Math.max(0, n));
    el.value = decimals ? String(Math.round(n * 100) / 100) : String(Math.floor(n));
  };
  const numberFields = [
    { id: "wordsEvery", decimals: false, max: 500 },
    { id: "wordsPause", decimals: true, max: 30 },
    { id: "sentPause", decimals: true, max: 30 }
  ];
  for (const { id, decimals, max } of numberFields) {
    const el = $(id);
    el.addEventListener("beforeinput", event => {
      if (event.data && !(decimals ? /^[0-9.]+$/ : /^[0-9]+$/).test(event.data)) event.preventDefault();
    });
    el.addEventListener("input", () => cleanNumber(el, decimals));
    el.addEventListener("blur", () => commitNumber(el, decimals, max));
  }
  const commitAllNumbers = () => numberFields.forEach(({ id, decimals, max }) => commitNumber($(id), decimals, max));

  const findEditor = () => {
    const frame = document.querySelector("iframe.docs-texteventtarget-iframe");
    try {
      return frame?.contentDocument?.querySelector('[contenteditable="true"][role="textbox"]') || null;
    } catch {
      return null;
    }
  };

  const focusDocumentEditor = () => {
    if (!activeEditor?.isConnected) throw new Error("Docs editor is no longer available.");
    // Release focus from any toolbar control so text can never land in the toolbar.
    const held = shadow.activeElement;
    if (held && typeof held.blur === "function") held.blur();
    const frame = document.querySelector("iframe.docs-texteventtarget-iframe");
    try { frame?.contentWindow?.focus(); } catch {}
    activeEditor.focus({ preventScroll: true });
    if (shadow.activeElement) throw new Error("Lost focus on the document.");
  };

  const syncControls = () => {
    const settingsLocked = running && !paused;
    // Keep the source text fixed for the entire run, but unlock every setting while paused.
    $("text").disabled = running;
    $("speed").disabled = settingsLocked;
    $("variable").disabled = settingsLocked;
    $("pauses").disabled = settingsLocked;
    $("wordsEvery").disabled = settingsLocked;
    $("wordsPause").disabled = settingsLocked;
    $("sentPause").disabled = settingsLocked;
    $("start").disabled = running;
    $("pause").disabled = !running || paused;
    $("resume").disabled = !running || !paused;
    $("stop").disabled = !running;
  };

  const paceDelay = char => {
    // Five characters (including spaces) per standard word: 12,000 / WPM gives ms per character.
    let delay = 12000 / activeWpm;
    if ($("variable").checked) delay *= 0.9 + Math.random() * 0.2;
    if (char === " " || char === "\t") delay += 75;
    if ($("pauses").checked && /[,;:]/.test(char)) delay += 180;
    if ($("pauses").checked && /[.!?]/.test(char)) delay += 350;
    return Math.max(8, delay);
  };

  // Fixed, user-chosen pauses (in milliseconds, to 0.01 s). Nothing here is random.
  const seconds = id => Math.round(Math.max(0, Math.min(30, parseFloat($(id).value) || 0)) * 100) * 10;
  const scheduledPause = (char, prev, next) => {
    let ms = 0;
    if (/\s/.test(char) && prev && !/\s/.test(prev)) {
      const every = Math.floor(parseFloat($("wordsEvery").value) || 0);
      wordsSincePause += 1;
      if (every > 0 && wordsSincePause >= every) {
        ms += seconds("wordsPause");
        wordsSincePause = 0;
      }
    }
    if (/[.!?]/.test(char) && (next === "" || /\s/.test(next))) ms += seconds("sentPause");
    return ms;
  };

  const send = message => new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, response => {
      if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
      if (!response?.ok) return reject(new Error(response?.error || "The extension could not send text."));
      resolve(response);
    });
  });

  const finish = async (message, resetPosition = false) => {
    running = false;
    paused = false;
    clearTimeout(timer);
    timer = null;
    if (resetPosition) { sourceIndex = 0; wordsSincePause = 0; }
    state(message);
    syncControls();
    if (attached) {
      try { await send({ type: "TYPEFLOW_DETACH" }); } catch {}
      attached = false;
    }
    activeEditor = null;
  };

  const step = async () => {
    if (!running || paused || sending) return;
    const source = $("text").value;
    if (sourceIndex >= source.length) {
      await finish("Done", true);
      return;
    }
    const char = source[sourceIndex];
    try {
      sending = true;
      focusDocumentEditor();
      await send({ type: "TYPEFLOW_INSERT", text: char });
      sending = false;
      if (!running) return;
      sourceIndex += 1;
      const extra = scheduledPause(char, source[sourceIndex - 2] || "", source[sourceIndex] || "");
      updateVariableSpeed();
      if (!paused) state(sourceIndex + " / " + source.length + (extra ? " · wait " + extra / 1000 + "s" : ""));
      if (!running || paused) return;
      if (sourceIndex >= source.length) {
        await finish("Done", true);
        return;
      }
      timer = setTimeout(step, paceDelay(char) + extra);
    } catch (error) {
      sending = false;
      if (!running) return;
      await finish("Stopped: " + error.message);
    }
  };

  $("speed").addEventListener("input", () => {
    targetWpm = Number($("speed").value);
    activeWpm = targetWpm;
    driftCounter = 0;
    renderSpeed();
  });
  $("variable").addEventListener("change", () => {
    driftCounter = 0;
    if (!$("variable").checked) activeWpm = targetWpm;
    renderSpeed();
  });
  $("start").addEventListener("click", async () => {
    const source = $("text").value;
    if (!source) return state("Add text first");
    if (running) return;
    commitAllNumbers();
    activeEditor = findEditor();
    if (!activeEditor) return state("Docs editor not found. Reload the tab.");
    try {
      focusDocumentEditor();
      state("Connecting…");
      await send({ type: "TYPEFLOW_ATTACH" });
      attached = true;
      running = true;
      paused = false;
      activeWpm = targetWpm;
      driftCounter = 0;
      if (sourceIndex >= source.length) sourceIndex = 0;
      if (sourceIndex === 0) wordsSincePause = 0;
      renderSpeed();
      syncControls();
      state("Typing…");
      void step();
    } catch (error) {
      await finish("Could not connect: " + error.message);
    }
  });

  $("pause").addEventListener("click", () => {
    if (!running || paused) return;
    paused = true;
    clearTimeout(timer);
    timer = null;
    syncControls();
    state("Paused. Adjust settings, then Resume.");
  });

  $("resume").addEventListener("click", () => {
    if (!running || !paused) return;
    try {
      focusDocumentEditor();
      paused = false;
      syncControls();
      state("Resuming…");
      void step();
    } catch (error) {
      void finish("Could not resume: " + error.message);
    }
  });

  $("stop").addEventListener("click", () => {
    void finish("Reset", true);
  });

  $("close").addEventListener("click", () => {
    void finish("Closed");
    $("panel").hidden = true;
    $("reopen").style.display = "grid";
  });

  $("reopen").addEventListener("click", () => {
    $("panel").hidden = false;
    $("reopen").style.display = "none";
  });

  renderSpeed();
  syncControls();
  document.documentElement.appendChild(host);
})();