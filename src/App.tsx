import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { loadSettings, saveSettings, type Preferences } from "./db";
import { bookmarklet } from "./bookmarklet";

type RunState = "idle" | "running" | "paused" | "stopped" | "done";
const defaults: Preferences = { wpm: 50, mode: "character", variable: true, punctuation: true, wordPause: 90, sentencePause: 380, paragraphPause: 850, dark: false, fontSize: 17, dyslexia: false, highContrast: false, largeButtons: false, clutterFree: false, speechRate: 1 };
const countWords = (s: string) => s.trim() ? s.trim().split(/\s+/u).length : 0;

export default function App() {
  const [text, setText] = useState("");
  const [prefs, setPrefs] = useState<Preferences>(defaults);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<RunState>("idle");
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState("No destination selected. Install and launch the browser connector on the page you want to write in.");
  const [tab, setTab] = useState<"input" | "settings" | "connect">("input");
  const [voice, setVoice] = useState("");
  const [listening, setListening] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const timer = useRef<number | null>(null);
  const indexRef = useRef(0);
  const stateRef = useRef<RunState>("idle");
  const recognition = useRef<any>(null);
  const speechVoices = useMemo(() => typeof speechSynthesis !== "undefined" ? speechSynthesis.getVoices() : [], []);

  useEffect(() => { loadSettings().then(s => { if (s) setPrefs({ ...defaults, ...s }); setLoaded(true); }); }, []);
  useEffect(() => { if (loaded) void saveSettings(prefs); }, [prefs, loaded]);
  useEffect(() => { const h = (e: Event) => { e.preventDefault(); setInstallPrompt(e); }; window.addEventListener("beforeinstallprompt", h); return () => window.removeEventListener("beforeinstallprompt", h); }, []);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); recognition.current?.stop?.(); }, []);

  const update = (patch: Partial<Preferences>) => setPrefs(p => ({ ...p, ...patch }));
  const setRun = (s: RunState) => { stateRef.current = s; setStatus(s); };
  const progress = text.length ? Math.min(100, Math.round(index / text.length * 100)) : 0;
  const paceDelay = (char: string, next: string) => {
    let ms = 12000 / prefs.wpm;
    if (prefs.variable) ms *= 0.82 + Math.random() * 0.36;
    if (char === " " || char === "\t") ms += prefs.wordPause;
    if (prefs.punctuation && /[,;:]/.test(char)) ms += 220;
    if (prefs.punctuation && /[.!?]/.test(char)) ms += prefs.sentencePause;
    if (char === "\n" && next === "\n") ms += prefs.paragraphPause;
    return Math.max(8, ms);
  };
  const tick = () => {
    if (stateRef.current !== "running") return;
    const nextIndex = indexRef.current + 1;
    indexRef.current = nextIndex;
    setIndex(nextIndex);
    if (nextIndex >= text.length) { indexRef.current = 0; setIndex(0); setRun("done"); return; }
    timer.current = window.setTimeout(tick, paceDelay(text[nextIndex - 1], text[nextIndex]));
  };
  const begin = () => {
    if (!text) { setMessage("Add text to Assisted Input before starting."); return; }
    if (indexRef.current >= text.length) { indexRef.current = 0; setIndex(0); }
    setRun("running");
    timer.current = window.setTimeout(tick, 0);
    setMessage("Insertion preview is running here. Use the browser connector on the destination page to insert into its field.");
  };
  const pause = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; if (stateRef.current === "running") setRun("paused"); };
  const stop = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; setRun("stopped"); };
  const reset = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; indexRef.current = 0; setIndex(0); setRun("idle"); };
  const paste = async () => { try { const value = await navigator.clipboard.readText(); setText(value); setMessage("Text pasted. Review it before insertion."); } catch { setMessage("Clipboard access was blocked. Use Ctrl + V inside the Assisted Input box."); } };
  const copyBookmarklet = async () => { try { await navigator.clipboard.writeText(bookmarklet); setMessage("Bookmarklet copied. Create a bookmark and paste it into the bookmark URL field."); } catch { setMessage("Clipboard permission was blocked. Select and copy the bookmarklet text below."); } };
  const readAloud = (selectionOnly = false) => {
    if (!("speechSynthesis" in window)) { setMessage("Text-to-speech is not supported in this browser."); return; }
    speechSynthesis.cancel();
    const selected = window.getSelection()?.toString();
    const utterance = new SpeechSynthesisUtterance(selectionOnly && selected ? selected : text);
    utterance.rate = prefs.speechRate;
    if (voice) utterance.voice = speechVoices.find(v => v.name === voice) || null as any;
    speechSynthesis.speak(utterance);
  };
  const startDictation = () => {
    const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Ctor) { setMessage("Speech recognition is unavailable in this browser. Try a supported version of Chrome."); return; }
    const rec = new Ctor(); recognition.current = rec; rec.continuous = true; rec.interimResults = true; rec.lang = navigator.language || "en-US";
    let finalText = "";
    rec.onresult = (event: any) => { for (let i = event.resultIndex; i < event.results.length; i++) { const part = event.results[i][0].transcript; if (event.results[i].isFinal) finalText += part + " "; } const committed = finalText; finalText = ""; if (committed) setText(v => v + committed); };
    rec.onerror = () => { setListening(false); setMessage("Speech recognition stopped. Review the text before insertion."); };
    rec.onend = () => setListening(false);
    rec.start(); setListening(true); setMessage("Listening. Speech recognition may process audio through your browser provider.");
  };
  const install = async () => { if (!installPrompt) return; await installPrompt.prompt(); await installPrompt.userChoice; setInstallPrompt(null); };

  return <div className={`app-shell ${prefs.dark ? "dark" : ""} ${prefs.highContrast ? "contrast" : ""} ${prefs.largeButtons ? "large-controls" : ""} ${prefs.clutterFree ? "clutter-free" : ""} ${prefs.dyslexia ? "dyslexia" : ""}`} style={{ "--input-size": prefs.fontSize + "px" } as CSSProperties}>
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">A</span><span>AccessDraft</span></div>
      <p className="side-label">ACCESSIBILITY TOOL</p>
      <button className={tab === "input" ? "nav-item selected" : "nav-item"} onClick={() => setTab("input")}> <span>▤</span> Assisted Input</button>
      <button className={tab === "connect" ? "nav-item selected" : "nav-item"} onClick={() => setTab("connect")}><span>⌁</span> Browser connection</button>
      <button className={tab === "settings" ? "nav-item selected" : "nav-item"} onClick={() => setTab("settings")}><span>⚙</span> Settings</button>
      <div className="sidebar-bottom"><span className="status-dot" /> Settings saved on this device <small>No account required</small></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div><span className="crumb-muted">AccessDraft</span><span className="crumb-sep"> / </span><strong>{tab === "input" ? "Assisted Input" : tab === "connect" ? "Connect your browser" : "Settings"}</strong></div><div className="top-actions">{installPrompt && <button className="outline-button" onClick={install}>Install app</button>}<span className="local-label"><i /> Local settings</span></div></header>
      {tab === "input" && <section className="content">
        <div className="page-heading"><div><p className="eyebrow">PROGRESSIVE TEXT INSERTION</p><h1>Assisted Input</h1><p className="subtitle">Prepare your text here, then send it into a writing field on another webpage.</p></div><span className="privacy-pill">Private by default</span></div>
        <div className="workspace-grid">
          <section className="panel input-panel">
            <div className="panel-heading"><div><h2>Your text</h2><p>Text stays in this box until you choose to clear it.</p></div><span className="counter">{countWords(text)} words · {text.length.toLocaleString()} characters</span></div>
            <textarea className="assisted-text" value={text} onChange={e => { setText(e.target.value); if (status !== "running") reset(); }} placeholder="Type or paste your text here. Your wording and paragraph breaks will be preserved." spellCheck aria-label="Assisted Input text" />
            <div className="input-actions"><div><button className="outline-button" onClick={paste}>Paste text</button><button className="outline-button" onClick={async()=>{try{await navigator.clipboard.writeText(text);setMessage("Text copied. Open the browser connector on your destination page and paste it into its Assisted Input box.");}catch{setMessage("Clipboard access was blocked. Select all and copy with Ctrl + C.");}}}>Copy for connector</button><button className="text-button" onClick={() => { setText(""); reset(); }}>Clear text</button></div><button className="text-button" onClick={() => { const el = document.querySelector<HTMLTextAreaElement>(".assisted-text"); el?.select(); }}>Select all</button></div>
            <div className="dictation-row"><div><strong>Speech-to-text</strong><small>Optional. Review recognized words before using them.</small></div>{!listening ? <button className="outline-button" onClick={startDictation}>Start microphone</button> : <button className="danger-button" onClick={() => { recognition.current?.stop?.(); setListening(false); }}>Stop listening</button>}</div>
            <div className="tts-row"><div><strong>Read aloud</strong><small>Secondary listening support</small></div><div className="tts-controls"><button className="outline-button" onClick={() => readAloud()}>Play</button><button className="text-button" onClick={() => speechSynthesis.pause()}>Pause</button><button className="text-button" onClick={() => speechSynthesis.resume()}>Resume</button><button className="text-button" onClick={() => speechSynthesis.cancel()}>Stop</button></div></div>
          </section>
          <section className="panel control-panel">
            <div className="panel-heading"><div><h2>Insertion settings</h2><p>Choose a comfortable pace.</p></div><button className="link-button" onClick={() => setTab("settings")}>More settings</button></div>
            <div className="speed-display"><div><span>WORDS PER MINUTE</span><strong>{prefs.wpm} <small>WPM</small></strong></div><span className="speed-tag">{prefs.wpm <= 30 ? "Very slow" : prefs.wpm <= 40 ? "Slow" : prefs.wpm <= 60 ? "Moderate" : prefs.wpm <= 80 ? "Fast" : "Very fast"}</span></div>
            <input aria-label="Words per minute" className="range" type="range" min="5" max="120" value={prefs.wpm} onChange={e => update({ wpm: Number(e.target.value) })} />
            <div className="preset-row">{[25,35,50,75,90].map(n => <button key={n} className={prefs.wpm === n ? "preset active" : "preset"} onClick={() => update({wpm:n})}>{n}</button>)}</div>
            <div className="setting-line"><label htmlFor="insert-mode">Insertion style</label><select id="insert-mode" value={prefs.mode} onChange={e => update({mode:e.target.value as Preferences["mode"]})}><option value="character">Character by character</option><option value="word">Progressive word insertion</option></select></div>
            <label className="toggle-line"><span><strong>Variable pacing</strong><small>Small timing changes around your target speed</small></span><input type="checkbox" checked={prefs.variable} onChange={e => update({variable:e.target.checked})}/></label>
            <label className="toggle-line"><span><strong>Punctuation pauses</strong><small>Pause slightly longer after punctuation</small></span><input type="checkbox" checked={prefs.punctuation} onChange={e => update({punctuation:e.target.checked})}/></label>
            <div className="progress-block"><div className="progress-top"><strong>Insertion progress</strong><span>{progress}%</span></div><div className="progress-track"><div style={{width: progress + "%"}} /></div><div className="progress-stats"><span>{index.toLocaleString()} / {text.length.toLocaleString()} characters</span><span>{Math.max(0,text.length-index).toLocaleString()} remaining</span></div></div>
            <div className="run-controls">
              <button className="primary-button" disabled={!text || status === "running"} onClick={begin}>▶ {status === "paused" ? "Resume preview" : "Preview pacing"}</button>
              <button className="outline-button" disabled={status !== "running"} onClick={pause}>Pause</button>
              <button className="danger-button" disabled={status !== "running" && status !== "paused"} onClick={stop}>Stop</button>
              <button className="text-button" onClick={reset}>Reset</button>
            </div>
            <div className="status-message" role="status">{status === "running" ? "Pacing preview running" : status === "paused" ? "Paused at current position" : status === "done" ? "Preview completed" : status === "stopped" ? "Stopped" : "Ready"} · {message}</div>
          </section>
        </div>
        <div className="destination-note"><span className="destination-icon">⌁</span><div><strong>Writing in another app?</strong><span>Install the bookmarklet connector to insert text progressively into supported fields on the page you are using.</span></div><button className="link-button" onClick={() => setTab("connect")}>Set up connector →</button></div>
      </section>}
      {tab === "connect" && <section className="content narrow-content">
        <div className="page-heading"><div><p className="eyebrow">BROWSER CONNECTOR</p><h1>Connect AccessDraft to your browser</h1><p className="subtitle">Add a bookmarklet to Chrome. Launch it on the webpage where you want to type.</p></div></div>
        <section className="panel connect-panel">
          <div className="step-number">01</div><h2>Copy your connector bookmarklet</h2><p>Copy the code, create a new Chrome bookmark, name it “AccessDraft”, then paste the code into the bookmark URL field.</p><button className="primary-button" onClick={copyBookmarklet}>Copy bookmarklet</button>
          <label className="field-label" htmlFor="bookmarklet-code">Bookmarklet code</label><textarea id="bookmarklet-code" className="code-area" readOnly value={bookmarklet} onFocus={e => e.currentTarget.select()} />
          <div className="step-divider" /><div className="step-number">02</div><h2>Open the page you want to write in</h2><p>Open Google Docs, D2L, Gmail, Word Online, or another website. Click the AccessDraft bookmark in your bookmarks bar.</p>
          <div className="step-divider" /><div className="step-number">03</div><h2>Select a supported writing field</h2><p>Click inside a normal text box, textarea, or contenteditable editor. The connector remembers that field while you use its floating toolbar.</p>
          <div className="compatibility"><strong>Compatibility details</strong><p>Standard HTML inputs, textareas, and many contenteditable fields are supported. Google Docs uses a specialized canvas-based editor and is not confirmed compatible with direct insertion. Use the connector’s clipboard fallback there. Cross-origin and sandboxed frames may block access.</p></div>
        </section>
      </section>}
      {tab === "settings" && <section className="content narrow-content">
        <div className="page-heading"><div><p className="eyebrow">PERSONAL PREFERENCES</p><h1>Settings</h1><p className="subtitle">Preferences are stored locally in this browser.</p></div></div>
        <section className="panel settings-panel"><h2>Insertion and pacing</h2>
          <div className="setting-line"><label>Words per minute <strong>{prefs.wpm}</strong></label><input className="range" type="range" min="5" max="120" value={prefs.wpm} onChange={e=>update({wpm:+e.target.value})}/></div>
          <div className="setting-line"><label>Pause between words (ms)</label><input type="number" min="0" max="3000" value={prefs.wordPause} onChange={e=>update({wordPause:+e.target.value})}/></div>
          <div className="setting-line"><label>Pause after sentence (ms)</label><input type="number" min="0" max="5000" value={prefs.sentencePause} onChange={e=>update({sentencePause:+e.target.value})}/></div>
          <div className="setting-line"><label>Pause between paragraphs (ms)</label><input type="number" min="0" max="10000" value={prefs.paragraphPause} onChange={e=>update({paragraphPause:+e.target.value})}/></div>
          <label className="toggle-line"><span><strong>Variable pacing</strong><small>Vary timing slightly while keeping average pace near the target</small></span><input type="checkbox" checked={prefs.variable} onChange={e=>update({variable:e.target.checked})}/></label>
          <label className="toggle-line"><span><strong>Punctuation pauses</strong><small>Use sentence and punctuation pauses</small></span><input type="checkbox" checked={prefs.punctuation} onChange={e=>update({punctuation:e.target.checked})}/></label>
          <div className="step-divider"/><h2>Interface</h2>
          <label className="toggle-line"><span><strong>Dark mode</strong></span><input type="checkbox" checked={prefs.dark} onChange={e=>update({dark:e.target.checked})}/></label>
          <label className="toggle-line"><span><strong>High contrast</strong></span><input type="checkbox" checked={prefs.highContrast} onChange={e=>update({highContrast:e.target.checked})}/></label>
          <label className="toggle-line"><span><strong>Larger controls</strong></span><input type="checkbox" checked={prefs.largeButtons} onChange={e=>update({largeButtons:e.target.checked})}/></label>
          <label className="toggle-line"><span><strong>Dyslexia-friendly font</strong></span><input type="checkbox" checked={prefs.dyslexia} onChange={e=>update({dyslexia:e.target.checked})}/></label>
          <label className="toggle-line"><span><strong>Reduced visual clutter</strong></span><input type="checkbox" checked={prefs.clutterFree} onChange={e=>update({clutterFree:e.target.checked})}/></label>
          <div className="setting-line"><label>Text size <strong>{prefs.fontSize}px</strong></label><input className="range" type="range" min="14" max="26" value={prefs.fontSize} onChange={e=>update({fontSize:+e.target.value})}/></div>
          <div className="step-divider"/><h2>Audio</h2><div className="setting-line"><label>Speech rate</label><input type="range" min="0.6" max="1.6" step="0.1" value={prefs.speechRate} onChange={e=>update({speechRate:+e.target.value})}/></div><div className="setting-line"><label htmlFor="voice">Voice</label><select id="voice" value={voice} onChange={e=>setVoice(e.target.value)}><option value="">System default</option>{speechVoices.map(v=><option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}</select></div>
          <button className="danger-button" onClick={async()=>{await saveSettings(defaults);setPrefs(defaults);setMessage("Local preferences reset.");}}>Reset local settings</button>
        </section>
      </section>}
      <footer className="app-footer"><span>AccessDraft</span><span>Progressive text insertion · Local-first</span></footer>
    </main>
  </div>;
}
