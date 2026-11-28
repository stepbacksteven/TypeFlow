(() => {
  if (window.top !== window || document.getElementById("typeflow-docs-extension")) return;

  const host = document.createElement("div");
  host.id = "typeflow-docs-extension";
  host.style.cssText = "all:initial;position:fixed;right:40px;top:120px;z-index:2147483647";
  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = `
    <style>
      *{box-sizing:border-box;font:14px Arial,sans-serif}
      section{display:flex;flex-direction:column;width:354px;height:470px;min-width:min(330px,calc(100vw - 16px));min-height:min(410px,calc(100vh - 32px));max-width:min(500px,calc(100vw - 16px));max-height:min(700px,calc(100vh - 32px));resize:both;overflow:hidden;background:#fff;color:#293B40;border:1px solid #DCE7E2;border-radius:14px;box-shadow:0 12px 36px rgba(37,65,59,.16);padding:15px}
      header,.row,.line{display:flex;justify-content:space-between;align-items:center;gap:8px}
      header{font-weight:700;margin-bottom:12px;color:#293B40;cursor:grab;user-select:none;touch-action:none}
      .brand{display:flex;align-items:center;gap:9px}
      .brand-mark{width:28px;height:28px;display:grid;place-items:center;border-radius:9px;overflow:hidden;background:#315E58;box-shadow:0 2px 5px rgba(49,94,88,.18)}
      .brand-mark svg{width:28px;height:28px;display:block}
      textarea{display:block;flex:1 1 auto;width:100%;min-width:0;min-height:0;overflow:auto;resize:none;border:1px solid #DCE7E2;border-radius:8px;padding:10px;line-height:1.5;color:#293B40;background:#FCFDFC;outline:none}
      textarea:focus,.num:focus{border-color:#78A69B;box-shadow:0 0 0 2px rgba(83,139,127,.12)}
      input[type=range]{-webkit-appearance:none;appearance:none;width:min(45%,220px);min-width:110px;flex:1;height:18px;background:transparent;cursor:pointer;touch-action:pan-y}
      input[type=range]::-webkit-slider-runnable-track{height:6px;border-radius:99px;background:linear-gradient(90deg,#315E58,#8AB8A9);border:1px solid #D2E2DA}
      input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;margin-top:-6px;border:2px solid #fff;border-radius:50%;background:#315E58;box-shadow:0 1px 4px rgba(35,74,65,.35);transition:transform .12s,box-shadow .12s}
      input[type=range]:hover::-webkit-slider-thumb{transform:scale(1.12);box-shadow:0 0 0 4px rgba(71,127,118,.14)}
      input[type=range]::-moz-range-track{height:6px;border-radius:99px;background:linear-gradient(90deg,#315E58,#8AB8A9);border:1px solid #D2E2DA}
      input[type=range]::-moz-range-thumb{width:12px;height:12px;border:2px solid #fff;border-radius:50%;background:#315E58;box-shadow:0 1px 4px rgba(35,74,65,.35)}
      input[type=range]:focus-visible{outline:2px solid #78A69B;outline-offset:4px;border-radius:8px}
      input[type=checkbox]{-webkit-appearance:none;appearance:none;width:16px;height:16px;flex:none;margin:0;border:1.5px solid #A8BDB4;border-radius:5px;background:linear-gradient(#fff,#F4F8F5);box-shadow:inset 0 1px 2px rgba(35,74,65,.08);cursor:pointer;display:grid;place-items:center;transition:background .14s,border-color .14s,box-shadow .14s}
      input[type=checkbox]::after{content:"";width:4px;height:8px;border:solid #fff;border-width:0 2px 2px 0;transform:rotate(45deg) scale(0);margin-top:-2px;transition:transform .12s}
      input[type=checkbox]:checked{background:linear-gradient(145deg,#477F76,#315E58);border-color:#315E58;box-shadow:0 1px 4px rgba(49,94,88,.24)}
      input[type=checkbox]:checked::after{transform:rotate(45deg) scale(1)}
      input[type=checkbox]:focus-visible{outline:2px solid #78A69B;outline-offset:2px}
      input[type=checkbox]:disabled{cursor:not-allowed;opacity:.5}
      button{border:1px solid #DCE7E2;background:#F7FAF8;color:#405650;border-radius:7px;padding:8px 10px;cursor:pointer;margin:3px 3px 3px 0;transition:background .15s,border-color .15s}
      button:hover:not(:disabled){background:#E3E8E6;border-color:#BFCAC5}
      button.primary{background:#477F76;color:white;border-color:#477F76;font-weight:600}
      button.primary:hover:not(:disabled){background:#386D65;border-color:#386D65}
      button:disabled,input:disabled,textarea:disabled{opacity:.68;cursor:not-allowed}
      button:not(:disabled){cursor:pointer}
      .variation-options{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:7px;padding:9px 10px;background:#F6F9F7;border:1px solid #E6EEEA;border-radius:8px}
      .variation-options[hidden]{display:none}
      .variation-options label{display:block;margin-bottom:4px}
      .variation-options .unit{width:100%;grid-template-columns:minmax(0,1fr) 58px;gap:5px}
      .variation-options .num{width:58px;min-width:0}
      .actions .primary{display:flex;align-items:center;justify-content:center;gap:7px}
      .play-icon{width:10px;height:10px;flex:none;fill:currentColor}
      label{font-size:12px;color:#5E716B}
      .opts{display:grid;gap:6px;margin:8px 0 6px;padding:9px 10px;background:#F6F9F7;border:1px solid #E6EEEA;border-radius:8px}
      .unit{display:grid;grid-template-columns:58px 1fr;align-items:center;gap:6px;width:112px;font-size:12px;color:#71827C}
      .num{width:58px;min-width:58px;text-align:right;border:1px solid #DCE7E2;border-radius:6px;padding:4px 6px;font-size:12px;color:#293B40;background:#fff}
      .foot{display:flex;align-items:flex-end;justify-content:space-between;gap:8px;margin-top:auto;padding-top:7px;flex:none}
      #state{flex:1;color:#71827C;font-size:10px;line-height:1.4;min-height:13px}
      .version{flex:none;white-space:nowrap;text-align:right;font-size:9.5px;color:#9AA9A3}
      .checks{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:7px}
      .checks label{display:flex;align-items:center;gap:4px;white-space:nowrap}
      .hint{font-size:10px;line-height:1.4;color:#82928C;margin:5px 1px 2px}
      .actions{display:flex;align-items:center;gap:5px;margin-top:8px}
      .actions button{flex:1;margin:0;padding:8px 5px;white-space:nowrap}
      .actions button.primary{flex:1.1}
      .speed-row{margin-top:5px}
      .variation-options{grid-template-columns:1fr 1fr}
      .profiles{grid-column:1/-1;width:100%;max-width:100%;margin:4px auto 0;padding:11px 12px;background:linear-gradient(145deg,#F1F7F3,#EAF2ED);border:1px solid #D8E6DE;border-radius:10px;box-shadow:inset 0 1px 0 rgba(255,255,255,.9);text-align:center}
      .profiles[hidden]{display:none}
      .profiles-heading{display:flex;align-items:center;justify-content:center;gap:8px;margin:0 auto 10px;color:#315E58}
      .profiles-heading strong{display:block;font-size:12px;letter-spacing:.1px}
      .profiles-icon{display:grid;place-items:center;width:27px;height:27px;border-radius:8px;background:#DCEBE2;color:#315E58;font-size:17px;font-weight:700}
      .profile-row{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;margin:0 auto}
      .profile-row select,.profile-row input{flex:1;min-width:0;height:33px;padding:5px 9px;border:1px solid #CEDFD5;border-radius:7px;background:#fff;color:#405650;font-size:11px;box-shadow:0 1px 2px rgba(36,70,59,.04);outline:none}
      .profile-row input:focus,.profile-row select:focus{border-color:#78A69B;box-shadow:0 0 0 2px rgba(83,139,127,.12)}
      .profile-row input[hidden]{display:none}
      .profile-row button{flex:none;margin:0;height:33px;padding:5px 10px;font-size:11px;white-space:nowrap}
      .profile-row .profile-save{background:#477F76;color:#fff;border-color:#477F76;font-weight:600}
      .profile-row .profile-save:hover:not(:disabled){background:#386D65;border-color:#386D65}
      .profile-row .profile-delete{width:32px;padding:4px;font-size:17px;color:#7A8D85}
      .profile-row .profile-cancel{width:32px;padding:4px;font-size:17px;color:#7A8D85}
    </style>
    <section id="panel">
      <header><span class="brand"><span class="brand-mark"><svg viewBox="0 0 64 64" aria-hidden="true"><path d="M15 18h34M32 18v31" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M32 36c0-8 6-14 14-14h4" fill="none" stroke="#A9D6C8" stroke-width="5" stroke-linecap="round"/><circle cx="50" cy="22" r="3.5" fill="#A9D6C8"/></svg></span><span>TypeFlow <span style="font-weight:400;color:#83938D">for Google Docs</span></span></span></header>
      <textarea id="text" placeholder="Paste or type text here"></textarea>
      <div class="row speed-row"><label>Speed <b id="speedval">50</b> WPM</label><input id="speed" type="range" min="5" max="120" step="0.01" value="50" aria-label="Target words per minute"></div>
      <div class="checks">
        <label title="Gradually shifts the active speed around your selected target."><input id="variable" type="checkbox" checked> Timing variation</label>
        <label title="Adds short waits after commas, semicolons, colons, and sentence endings."><input id="pauses" type="checkbox" checked> Punctuation pauses</label>
      </div>
      <div class="variation-options" id="variationOptions" hidden>
        <div><label for="variationMin">Min variation</label><span class="unit"><span>WPM</span><input id="variationMin" class="num" type="text" inputmode="numeric" autocomplete="off" maxlength="2" value="2"></span></div>
        <div><label for="variationMax">Max variation</label><span class="unit"><span>WPM</span><input id="variationMax" class="num" type="text" inputmode="numeric" autocomplete="off" maxlength="2" value="20"></span></div>
        <div class="profiles" id="profilesPanel">
          <div class="profiles-heading"><span class="profiles-icon">↗</span><strong>Speed</strong></div>
          <div class="profile-row">
            <select id="profileSelect" aria-label="Speed profile" title="Select a speed profile"></select>
            <input id="profileName" type="text" maxlength="32" placeholder="Name this profile" aria-label="Name this profile" hidden>
            <button id="saveProfile" type="button" class="profile-save">＋ Save</button>
            <button id="deleteProfile" type="button" class="profile-delete" disabled aria-label="Delete selected profile">×</button>
            <button id="cancelSaveProfile" type="button" class="profile-cancel" aria-label="Cancel naming profile" hidden>×</button>
          </div>
        </div>
      </div>
      <div class="opts">
        <div class="line"><label for="wordsEvery">Pause every</label><span class="unit"><input id="wordsEvery" class="num" type="text" inputmode="numeric" autocomplete="off" maxlength="3" value="0"> words</span></div>
        <div class="line"><label for="wordsPause">Then pause for</label><span class="unit"><input id="wordsPause" class="num" type="text" inputmode="decimal" autocomplete="off" maxlength="5" value="2"> sec</span></div>
        <div class="line"><label for="sentPause">After each sentence</label><span class="unit"><input id="sentPause" class="num" type="text" inputmode="decimal" autocomplete="off" maxlength="5" value="0"> sec</span></div>
      </div>
      <div class="actions">
        <button class="primary" id="start"><svg class="play-icon" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 1.4a.7.7 0 0 1 1.05-.6l7 4.5a.82.82 0 0 1 0 1.4l-7 4.5a.7.7 0 0 1-1.05-.6z"/></svg>Begin</button>
        <button id="pause">Pause</button>
        <button id="resume">Resume</button>
        <button id="stop">Reset</button>
      </div>
      <div class="foot">
        <div id="state" role="status">Click in the doc, then Begin</div>
        <div class="version" id="version"></div>
      </div>
    </section>`;

  // Bump on every update: 1.00 was the starting version, then +0.01 per update. Keep manifest.json in sync.
  const VERSION = "1.27";

  /* variation-engine:start */
  // A fresh weighted random choice is made for every inserted character.
  // Equal Min/Max values produce a 50/50 direction chance. Larger values favour their side.
  // The movement amount also scales with the selected side's setting.
  // A randomized pity threshold periodically returns speed to the original target.
  const createVariationEngine = (random = Math.random) => {
    const ZONE = 0.82;
    const DECAY = 0.35;
    const PITY_MIN = 80;
    const PITY_MAX = 140;
    const round2 = value => Math.round(value * 100) / 100;
    let pressure = 0;
    let pityLimit = 0;
    let returning = false;

    const restart = () => {
      pressure = 0;
      pityLimit = 0;
      returning = false;
    };
    const retarget = restart;

    const tick = (active, target, min, max) => {
      const lower = Math.max(5, target - min);
      const upper = Math.min(120, target + max);
      const downRange = target - lower;
      const upRange = upper - target;
      active = Math.min(upper, Math.max(lower, active));

      if (downRange + upRange <= 0) {
        restart();
        return round2(target);
      }

      // Pity return is temporary. Once the original WPM is reached, random movement resumes.
      if (returning) {
        const distance = target - active;
        const returnStep = Math.max(0.02, round2(Math.max(min, max) * 0.02));
        active = round2(active + Math.sign(distance) * Math.min(Math.abs(distance), returnStep));
        if (Math.abs(active - target) < 0.005) {
          active = target;
          restart();
        }
        return active;
      }

      if (pityLimit === 0) {
        pityLimit = PITY_MIN + Math.floor(random() * (PITY_MAX - PITY_MIN + 1));
      }
      const nearUpper = upRange > 0 && active >= target + upRange * ZONE;
      const nearLower = downRange > 0 && active <= target - downRange * ZONE;
      pressure = nearUpper || nearLower ? pressure + 1 : Math.max(0, pressure - DECAY);

      if (pressure >= pityLimit) {
        returning = true;
        pressure = 0;
        pityLimit = 0;
        return tick(active, target, min, max);
      }

      // Use the effective available ranges. When they are equal, this is exactly 50/50.
      let direction = random() < upRange / (upRange + downRange) ? 1 : -1;

      // Reflect at an edge instead of sticking at the limit.
      if (direction > 0 && active >= upper - 0.005) direction = -1;
      else if (direction < 0 && active <= lower + 0.005) direction = 1;

      const sideSetting = direction > 0 ? max : min;
      const step = Math.max(0.02, round2(sideSetting * 0.02));
      let next = active + direction * step;

      // Reflect any overshoot so the speed remains responsive near either boundary.
      if (next > upper) next = upper - (next - upper);
      if (next < lower) next = lower + (lower - next);
      active = round2(Math.min(upper, Math.max(lower, next)));
      return active;
    };

    return { tick, restart, retarget };
  };
  /* variation-engine:end */

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
  const variation = createVariationEngine();
  let variationMin = 2;
  let variationMax = 20;
  let settingsReady = false;
  const settingIds = ["speed", "variable", "pauses", "wordsEvery", "wordsPause", "sentPause", "variationMin", "variationMax"];
  const BUILTIN_PROFILES = {
    "Slow": { speed: 40, variable: true, variationMin: 15, variationMax: 10 },
    "Medium": { speed: 60, variable: true, variationMin: 15, variationMax: 18 },
    "Fast": { speed: 75, variable: true, variationMin: 10, variationMax: 20 }
  };
  let savedProfiles = {};
  const readProfileSettings = () => ({
    speed: targetWpm,
    variable: $("variable").checked,
    variationMin: $("variationMin").value,
    variationMax: $("variationMax").value
  });
  const refreshProfileOptions = selected => {
    const select = $("profileSelect");
    select.replaceChildren();
    const builtins = document.createElement("optgroup");
    builtins.label = "Built-in profiles";
    for (const name of Object.keys(BUILTIN_PROFILES)) builtins.append(new Option(name, "builtin:" + name));
    select.append(builtins);
    const customNames = Object.keys(savedProfiles).filter(name => !(name in BUILTIN_PROFILES)).sort((a, b) => a.localeCompare(b));
    if (customNames.length) {
      const custom = document.createElement("optgroup");
      custom.label = "Saved profiles";
      for (const name of customNames) custom.append(new Option(name, "custom:" + name));
      select.append(custom);
    }
    select.value = selected || "builtin:Medium";
    $("deleteProfile").disabled = !select.value.startsWith("custom:");
  };
  const loadProfiles = async () => {
    if (!chrome.storage?.local) return;
    try {
      const stored = await chrome.storage.local.get(["typeflowProfiles", "typeflowActiveProfile"]);
      savedProfiles = stored.typeflowProfiles && typeof stored.typeflowProfiles === "object" ? stored.typeflowProfiles : {};
      const active = stored.typeflowActiveProfile && (stored.typeflowActiveProfile === "builtin:Slow" || stored.typeflowActiveProfile === "builtin:Medium" || stored.typeflowActiveProfile === "builtin:Fast" || stored.typeflowActiveProfile.startsWith("custom:") && savedProfiles[stored.typeflowActiveProfile.slice(7)]) ? stored.typeflowActiveProfile : "builtin:Medium";
      applyProfile(active);
    } catch (error) {
      console.warn("TypeFlow could not restore saved profiles.", error);
    }
  };
  const persistProfiles = active => {
    if (!chrome.storage?.local) return;
    chrome.storage.local.set({
      typeflowProfiles: savedProfiles,
      typeflowActiveProfile: active || ""
    });
  };
  const applyProfile = key => {
    const builtin = key.startsWith("builtin:");
    const name = key.slice(builtin ? 8 : 7);
    const profile = builtin ? BUILTIN_PROFILES[name] : savedProfiles[name];
    if (!profile) return;
    $("speed").value = String(profile.speed);
    $("variable").checked = Boolean(profile.variable);
    $("variationMin").value = String(profile.variationMin);
    $("variationMax").value = String(profile.variationMax);
    variationMin = Math.max(1, Math.min(99, Number(profile.variationMin) || 1));
    variationMax = Math.max(1, Math.min(99, Number(profile.variationMax) || 1));
    targetWpm = Math.max(5, Math.min(120, Math.round(Number(profile.speed) || 50)));
    $("speed").value = String(targetWpm);
    activeWpm = targetWpm;
    variation.restart();
    $("variationOptions").hidden = !$("variable").checked;
    $("profileName").hidden = true;
    $("profileSelect").hidden = false;
    $("cancelSaveProfile").hidden = true;
    renderSpeed();
    saveSettings();
    refreshProfileOptions(key);
    persistProfiles(key);
    state("Loaded profile: " + name);
  };
  const saveSettings = () => {
    if (!settingsReady || !chrome.storage?.local) return;
    const settings = {};
    // Save the chosen speed, never the slider position: while running, the slider shows the drifting speed.
    for (const id of settingIds) settings[id] = id === "speed" ? targetWpm : $(id).type === "checkbox" ? $(id).checked : $(id).value;
    chrome.storage.local.set({ typeflowSettings: settings });
  };

  // Prevent toolbar buttons from moving the Docs caret.
  shadow.addEventListener("mousedown", event => {
    if (event.target instanceof HTMLButtonElement) event.preventDefault();
  });


  // Drag the toolbar by its header, or move the reopen button when the toolbar is hidden.
  const makeDraggable = handle => {
    let startX = 0, startY = 0, originX = 0, originY = 0, active = false;
    handle.addEventListener("pointerdown", event => {
      if (handle === $("panel").querySelector("header") && event.target.closest("button")) return;
      if (event.button !== 0) return;
      const rect = host.getBoundingClientRect();
      startX = event.clientX; startY = event.clientY;
      originX = rect.left; originY = rect.top; active = true;
      host.style.left = originX + "px"; host.style.top = originY + "px"; host.style.right = "auto";
      handle.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    handle.addEventListener("pointermove", event => {
      if (!active) return;
      const dx = event.clientX - startX, dy = event.clientY - startY;
      const maxX = Math.max(8, window.innerWidth - host.offsetWidth - 8);
      const maxY = Math.max(8, window.innerHeight - Math.min(host.offsetHeight, window.innerHeight - 16) - 8);
      host.style.left = Math.max(8, Math.min(maxX, originX + dx)) + "px";
      host.style.top = Math.max(8, Math.min(maxY, originY + dy)) + "px";
    });
    const endDrag = event => {
      if (!active) return;
      active = false;
      if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
    };
    handle.addEventListener("pointerup", endDrag);
    handle.addEventListener("pointercancel", endDrag);
  };
  makeDraggable($("panel").querySelector("header"));

  let sliderAnimation = null;
  const animateSliderTo = value => {
    const slider = $("speed");
    if (sliderAnimation !== null) cancelAnimationFrame(sliderAnimation);
    const from = Number(slider.value) || value;
    const to = Math.max(5, Math.min(120, value));
    const started = performance.now();
    const duration = 80;
    const animate = now => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      slider.value = String(from + (to - from) * eased);
      if (progress < 1) sliderAnimation = requestAnimationFrame(animate);
      else {
        slider.value = String(to);
        sliderAnimation = null;
      }
    };
    sliderAnimation = requestAnimationFrame(animate);
  };

  const renderSpeed = () => {
    // Keep hundredth-WPM precision internally while showing only whole numbers.
    animateSliderTo(activeWpm);
    $("speedval").textContent = String(Math.round(activeWpm));
  };

  const updateVariableSpeed = () => {
    activeWpm = $("variable").checked ? variation.tick(activeWpm, targetWpm, variationMin, variationMax) : targetWpm;
    renderSpeed();
  };

  // Pull the current speed inside new Min/Max limits right away (used when they change while paused).
  const clampActiveToLimits = () => {
    if (!$("variable").checked) return;
    const lower = Math.max(5, targetWpm - variationMin);
    const upper = Math.min(120, targetWpm + variationMax);
    activeWpm = Math.round(Math.max(lower, Math.min(upper, activeWpm)) * 100) / 100;
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
    { id: "sentPause", decimals: true, max: 30 },
    { id: "variationMin", decimals: false, max: 99 },
    { id: "variationMax", decimals: false, max: 99 }
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
    $("variationMin").disabled = settingsLocked;
    $("variationMax").disabled = settingsLocked;
    $("profileSelect").disabled = settingsLocked;
    $("saveProfile").disabled = settingsLocked || !$("variable").checked;
    $("deleteProfile").disabled = settingsLocked || !$("profileSelect").value.startsWith("custom:");
    $("profileName").disabled = settingsLocked;
    $("cancelSaveProfile").disabled = settingsLocked;
    $("start").disabled = running || !settingsReady;
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
    if (resetPosition) { sourceIndex = 0; wordsSincePause = 0; activeWpm = targetWpm; variation.restart(); renderSpeed(); }
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

  // The chosen speed is always a whole number. The slider itself moves in 0.01 steps so the
  // drifting speed looks smooth, so keyboard steps are handled here instead of by the browser.
  const setTargetWpm = value => {
    targetWpm = Math.max(5, Math.min(120, Math.round(Number(value) || 50)));
    $("speed").value = String(targetWpm);
    activeWpm = targetWpm;
    variation.restart();
    renderSpeed();
    saveSettings();
  };
  $("speed").addEventListener("input", () => setTargetWpm($("speed").value));
  $("speed").addEventListener("keydown", event => {
    const steps = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1, PageDown: -10, PageUp: 10 };
    let next;
    if (event.key in steps) next = Math.round(activeWpm) + steps[event.key];
    else if (event.key === "Home") next = 5;
    else if (event.key === "End") next = 120;
    else return;
    event.preventDefault();
    setTargetWpm(next);
  });
  $("variable").addEventListener("change", () => {
    variation.restart();
    if (!$("variable").checked) {
      activeWpm = targetWpm;
      $("profileName").hidden = true;
      $("profileSelect").hidden = false;
      $("cancelSaveProfile").hidden = true;
    }
    $("variationOptions").hidden = !$("variable").checked;
    renderSpeed();
    saveSettings();
  });
  $("pauses").addEventListener("change", saveSettings);
  const updateVariationSettings = () => {
    const minInput = $("variationMin");
    const maxInput = $("variationMax");
    if (minInput.value === "" || maxInput.value === "") return;
    // Keep the two controls independent. Normalize their values only for calculations.
    const nextMin = Math.max(1, Math.min(99, Number(minInput.value)));
    const nextMax = Math.max(1, Math.min(99, Number(maxInput.value)));
    if (nextMin === variationMin && nextMax === variationMax) return;   // nothing changed: keep the walk going
    variationMin = nextMin;
    variationMax = nextMax;
    variation.retarget();
    clampActiveToLimits();
    saveSettings();
  };
  const commitVariationInput = id => {
    const input = $(id);
    let value = Number(input.value);
    if (!Number.isFinite(value)) value = 1;
    value = Math.max(1, Math.min(99, value));
    input.value = String(value);
    updateVariationSettings();
  };
  $("variationMin").addEventListener("input", updateVariationSettings);
  $("variationMax").addEventListener("input", updateVariationSettings);
  $("variationMin").addEventListener("change", () => commitVariationInput("variationMin"));
  $("variationMax").addEventListener("change", () => commitVariationInput("variationMax"));
  $("variationMin").addEventListener("blur", () => commitVariationInput("variationMin"));
  $("variationMax").addEventListener("blur", () => commitVariationInput("variationMax"));
  // Buttons keep the caret in Docs, so clicking them never blurs a box being edited.
  // Commit every number field explicitly before starting or resuming.
  const commitSettings = () => {
    commitAllNumbers();
    commitVariationInput("variationMin");
    commitVariationInput("variationMax");
  };
  $("profileSelect").addEventListener("change", () => {
    const key = $("profileSelect").value;
    if (key) applyProfile(key);
  });
  const closeProfileNaming = () => {
    $("profileName").hidden = true;
    $("profileSelect").hidden = false;
    $("cancelSaveProfile").hidden = true;
    $("saveProfile").textContent = "＋ Save";
  };
  $("saveProfile").addEventListener("click", () => {
    if (!$("variable").checked || running && !paused) return;
    if (!$("profileName").hidden) {
      const name = $("profileName").value.trim().slice(0, 32);
      if (!name) return state("Enter a profile name");
      if (name in BUILTIN_PROFILES) return state("Choose a different name");
      commitSettings();
      savedProfiles[name] = readProfileSettings();
      const key = "custom:" + name;
      refreshProfileOptions(key);
      persistProfiles(key);
      closeProfileNaming();
      state("Saved profile: " + name);
      return;
    }
    $("profileSelect").hidden = true;
    $("profileName").hidden = false;
    $("profileName").value = "";
    $("saveProfile").textContent = "＋ Save";
    $("deleteProfile").hidden = true;
    $("cancelSaveProfile").hidden = false;
    $("profileName").focus();
  });
  $("profileName").addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      $("saveProfile").click();
    } else if (event.key === "Escape") {
      closeProfileNaming();
      $("deleteProfile").hidden = false;
    }
  });
  $("cancelSaveProfile").addEventListener("click", () => {
    closeProfileNaming();
    $("deleteProfile").hidden = false;
  });
  $("deleteProfile").addEventListener("click", () => {
    const key = $("profileSelect").value;
    if (!key.startsWith("custom:")) return;
    const name = key.slice(7);
    if (!window.confirm("Are you sure you want to delete the profile \"" + name + "\"?")) return;
    delete savedProfiles[name];
    const fallback = "builtin:Medium";
    refreshProfileOptions(fallback);
    persistProfiles(fallback);
    applyProfile(fallback);
    state("Deleted profile: " + name);
  });
  $("start").addEventListener("click", async () => {
    const source = $("text").value;
    if (!source) return state("Add text first");
    if (running) return;
    commitSettings();
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
      variation.restart();
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
      commitSettings();
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

  const loadSettings = async () => {
    if (!chrome.storage?.local) { settingsReady = true; syncControls(); return; }
    try {
      const stored = await chrome.storage.local.get("typeflowSettings");
      const settings = stored.typeflowSettings || {};
      for (const id of settingIds) if (id in settings) {
        if ($(id).type === "checkbox") $(id).checked = Boolean(settings[id]);
        else $(id).value = String(settings[id]);
      }
    } catch (error) { console.warn("TypeFlow could not restore saved settings.", error); }
    settingsReady = true;
    for (const { id, decimals, max } of numberFields) commitNumber($(id), decimals, max);
    variationMin = Math.max(1, Math.min(99, Number($("variationMin").value) || 1));
    variationMax = Math.max(1, Math.min(99, Number($("variationMax").value) || 20));
    $("variationMin").value = String(variationMin);
    $("variationMax").value = String(variationMax);
    targetWpm = Math.max(5, Math.min(120, Math.round(Number($("speed").value) || 50)));
    $("speed").value = String(targetWpm);
    activeWpm = targetWpm;
    variation.restart();
    $("variationOptions").hidden = !$("variable").checked;
    renderSpeed();
    syncControls();
    saveSettings();
  };
  for (const { id } of numberFields) $(id).addEventListener("input", saveSettings);
  renderSpeed();
  syncControls();
  document.documentElement.appendChild(host);
  void (async () => {
    await loadSettings();
    await loadProfiles();
  })();
})();