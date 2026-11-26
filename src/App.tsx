import { useEffect, useMemo, useState } from "react";
import { deleteDraft, getDrafts, saveDraft, type Draft } from "./db";

type Page = "home" | "write" | "documents";
const newDraft = (): Draft => ({ id: crypto.randomUUID(), title: "Untitled document", content: "", updatedAt: Date.now() });
const dateLabel = (value: number) => new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(value);

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [active, setActive] = useState<Draft | null>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [installing, setInstalling] = useState(false);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  async function refresh() { setDrafts(await getDrafts()); }
  useEffect(() => { void refresh(); }, []);
  useEffect(() => {
    const handler = (event: Event) => { event.preventDefault(); setInstallPrompt(event); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    if (!active) return;
    setSaved(false);
    const timer = window.setTimeout(async () => {
      const updated = { ...active, updatedAt: Date.now() };
      await saveDraft(updated);
      setDrafts(await getDrafts());
      setSaved(true);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [active]);

  const filtered = useMemo(() => drafts.filter(d => d.title.toLowerCase().includes(query.toLowerCase()) || d.content.toLowerCase().includes(query.toLowerCase())), [drafts, query]);
  function openDraft(draft: Draft) { setActive(draft); setPage("write"); setMenuOpen(false); }
  function createDraft() { const draft = newDraft(); setActive(draft); setPage("write"); setMenuOpen(false); }
  async function removeDraft(id: string) {
    await deleteDraft(id);
    if (active?.id === id) setActive(null);
    await refresh();
  }
  async function install() {
    if (!installPrompt) return;
    setInstalling(true);
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
    setInstalling(false);
  }

  return <div className="app-shell">
    <aside className={"sidebar " + (menuOpen ? "sidebar-open" : "")}>
      <button className="brand" onClick={() => { setPage("home"); setActive(null); }} aria-label="AccessDraft home"><span className="brand-mark">A</span><span>access<span className="brand-light">draft</span></span></button>
      <div className="side-label">WORKSPACE</div>
      <nav aria-label="Main navigation">
        <button className={"nav-item " + (page === "home" ? "selected" : "")} onClick={() => { setPage("home"); setActive(null); setMenuOpen(false); }}><span className="nav-icon">⌂</span>Dashboard</button>
        <button className={"nav-item " + (page === "write" ? "selected" : "")} onClick={() => { if (!active) createDraft(); else setPage("write"); setMenuOpen(false); }}><span className="nav-icon">＋</span>Writing space</button>
        <button className={"nav-item " + (page === "documents" ? "selected" : "")} onClick={() => { setPage("documents"); setActive(null); setMenuOpen(false); }}><span className="nav-icon">▤</span>My documents <span className="nav-count">{drafts.length}</span></button>
      </nav>
      <div className="sidebar-bottom">
        <div className="local-card"><span className="local-dot" /><div><strong>Saved on this device</strong><small>Your drafts stay private</small></div></div>
        <div className="profile"><div className="avatar">AD</div><div><strong>My workspace</strong><small>Personal account</small></div><span className="more">···</span></div>
      </div>
    </aside>

    <main className="main-area">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle navigation">☰</button>
        <div className="breadcrumbs"><span>Workspace</span><span className="crumb-sep">/</span><strong>{page === "home" ? "Dashboard" : page === "write" ? "Writing space" : "My documents"}</strong></div>
        <div className="top-actions"><span className="connection"><i />All changes saved locally</span>{installPrompt && <button className="install-button" onClick={install} disabled={installing}>{installing ? "Opening…" : "Install app"}</button>}</div>
      </header>

      {page === "home" && <section className="page-content">
        <div className="welcome-row"><div><p className="eyebrow">YOUR WRITING WORKSPACE</p><h1>Good to see you.</h1><p className="subheading">A clear space to think, write, and make progress.</p></div><button className="primary-button" onClick={createDraft}><span>＋</span> New document</button></div>
        <div className="hero-card"><div className="hero-copy"><span className="hero-tag">A SPACE THAT WORKS FOR YOU</span><h2>Your ideas deserve<br/>room to grow.</h2><p>Start with a blank page. Your work saves automatically on this device, so you can pick up where you left off.</p><button className="hero-button" onClick={createDraft}>Start writing <span>→</span></button></div><div className="hero-art" aria-hidden="true"><div className="art-sheet sheet-back" /><div className="art-sheet sheet-front"><div className="sheet-line long" /><div className="sheet-line medium" /><div className="sheet-highlight" /><div className="sheet-line long" /><div className="sheet-line short" /><div className="sheet-line medium" /></div><div className="art-spark">✳</div></div></div>
        <div className="section-heading"><div><h2>Recent documents</h2><p>Continue where you left off.</p></div><button className="text-button" onClick={() => setPage("documents")}>View all <span>→</span></button></div>
        {drafts.length === 0 ? <div className="empty-state"><div className="empty-icon">▤</div><h3>Your documents will show up here</h3><p>Create your first document to get started.</p><button className="secondary-button" onClick={createDraft}>Create a document</button></div> :
          <div className="recent-grid">{drafts.slice(0,3).map(d => <button className="document-card" key={d.id} onClick={() => openDraft(d)}><div className="doc-preview"><span className="doc-preview-title">{d.title || "Untitled document"}</span><span className="preview-line" /><span className="preview-line short" /><span className="preview-line" /></div><div className="doc-meta"><strong>{d.title || "Untitled document"}</strong><small>Edited {dateLabel(d.updatedAt)}</small></div></button>)}</div>}
        <div className="privacy-strip"><span className="privacy-icon">⌑</span><div><strong>Your work stays yours.</strong><span>Documents are stored locally in this browser. No account or cloud upload is required.</span></div></div>
      </section>}

      {page === "write" && <section className="editor-page">
        <div className="editor-toolbar"><button className="back-button" onClick={() => { setPage("home"); setActive(null); }}>← <span>Dashboard</span></button><div className="save-status"><span className={saved ? "save-check" : "save-pending"}>{saved ? "✓" : "·"}</span>{saved ? "Saved on this device" : "Saving…"}</div></div>
        <div className="editor-wrap">
          <input className="title-input" aria-label="Document title" value={active?.title ?? ""} onChange={e => setActive(a => a ? { ...a, title: e.target.value } : a)} placeholder="Untitled document" />
          <div className="editor-hint">YOUR DOCUMENT <span>·</span> Changes save automatically</div>
          <textarea className="writing-area" aria-label="Document content" value={active?.content ?? ""} onChange={e => setActive(a => a ? { ...a, content: e.target.value } : a)} placeholder={"Start writing here…\n\nTake your time. Your ideas are safe here."} />
          <div className="editor-footer"><span>{(active?.content ?? "").trim() ? (active?.content ?? "").trim().split(/\s+/).length : 0} words</span><button className="delete-button" onClick={() => active && removeDraft(active.id)}>Delete document</button></div>
        </div>
      </section>}

      {page === "documents" && <section className="page-content documents-page"><div className="welcome-row"><div><p className="eyebrow">YOUR WORK</p><h1>My documents</h1><p className="subheading">All your writing, saved on this device.</p></div><button className="primary-button" onClick={createDraft}>＋ New document</button></div><div className="search-wrap"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search your documents" aria-label="Search documents" /></div>{filtered.length === 0 ? <div className="empty-state"><div className="empty-icon">⌕</div><h3>{query ? "No matching documents" : "No documents yet"}</h3><p>{query ? "Try another search." : "Create a document and it will appear here."}</p></div> : <div className="document-list">{filtered.map(d => <div className="document-row" key={d.id}><button className="document-open" onClick={() => openDraft(d)}><span className="file-icon">▤</span><span><strong>{d.title || "Untitled document"}</strong><small>{d.content.slice(0,100) || "No content yet"}</small></span></button><span className="document-date">{dateLabel(d.updatedAt)}</span><button className="icon-button" aria-label={"Delete " + d.title} onClick={() => removeDraft(d.id)}>×</button></div>)}</div>}</section>}

      <footer className="app-footer"><span>AccessDraft</span><span>Designed for focus and accessibility</span></footer>
    </main>
  </div>;
}
