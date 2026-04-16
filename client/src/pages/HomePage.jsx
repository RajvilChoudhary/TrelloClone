import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBoards, createBoard, deleteBoard } from '../api';
import './HomePage.css';

const BACKGROUNDS = [
  'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
  'linear-gradient(135deg,#11998e 0%,#38ef7d 100%)',
  'linear-gradient(135deg,#f7971e 0%,#ffd200 100%)',
  'linear-gradient(135deg,#f953c6 0%,#b91d73 100%)',
  'linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)',
  'linear-gradient(135deg,#fa709a 0%,#fee140 100%)',
  'linear-gradient(135deg,#a18cd1 0%,#fbc2eb 100%)',
  '#0052CC','#00875A','#6554C0',
];

export default function HomePage() {
  const [boards, setBoards]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle]   = useState('');
  const [selectedBg, setSelectedBg] = useState(BACKGROUNDS[0]);

  // UI States
  const [activeTab, setActiveTab] = useState('boards'); // 'boards', 'templates', 'home'
  const [showJiraPromo, setShowJiraPromo] = useState(true);
  const [workspaceExpanded, setWorkspaceExpanded] = useState(true);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await getBoards();
      // Reverse chronological by default
      setBoards(res.data.reverse() || []);
    } finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const res = await createBoard({ title: newTitle, background: selectedBg });
    setBoards(prev => [res.data, ...prev]);
    setNewTitle(''); setShowCreate(false);
  };

  const handleDelete = async (e, id) => {
    e.preventDefault(); e.stopPropagation();
    if (!window.confirm('Delete this board and all its contents?')) return;
    await deleteBoard(id);
    setBoards(prev => prev.filter(b => b.id !== id));
  };

  if (loading) return (
    <div className="home-loading">
      <div className="spinner"></div>
    </div>
  );

  const recentlyViewed = boards.slice(0, 2);

  // SVGs
  const iconBoards = <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M11 2h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h2v1H3v10h10V3h-2V2z"/><path d="M6 1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/></svg>;
  const iconTemplates = <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 2a5 5 0 1 1 0 10A5 5 0 0 1 8 3z"/><path d="M8 5a.5.5 0 0 1 .5.5v2h2a.5.5 0 0 1 0 1h-2v2a.5.5 0 0 1-1 0v-2h-2a.5.5 0 0 1 0-1h2v-2A.5.5 0 0 1 8 5z"/></svg>;
  const iconHome = <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146z"/></svg>;
  const iconMembers = <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path fillRule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"/><path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/></svg>;
  const iconSettings = <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/><path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319z"/></svg>;
  const iconTrello = <svg width="20" height="20" viewBox="0 0 16 16" fill="white"><rect width="16" height="16" rx="3" fill="#0052CC"/><path d="M7 13H4V3h3v10zm5-4h-3V3h3v6z" fill="white"/></svg>;

  return (
    <div className="home-page">
      {/* 1. SIDEBAR */}
      <aside className="home-sidebar">
        <nav className="home-nav">
          <div className={`home-nav-item ${activeTab === 'boards' ? 'active' : ''}`} onClick={() => setActiveTab('boards')}>
            <span className="icon-wrapper">{iconBoards}</span>
            Boards
          </div>
          <div className={`home-nav-item ${activeTab === 'templates' ? 'active' : ''}`} onClick={() => setActiveTab('templates')}>
            <span className="icon-wrapper">{iconTemplates}</span>
            Templates
          </div>
          <div className={`home-nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
            <span className="icon-wrapper">{iconHome}</span>
            Home
          </div>
        </nav>

        <div className="home-sidebar-divider"></div>
        
        <div className="workspace-accordion-header" onClick={() => setWorkspaceExpanded(!workspaceExpanded)}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ds-text-subtle)' }}>Workspaces</span>
          <svg style={{ transform: workspaceExpanded ? 'rotate(0)' : 'rotate(-90deg)', transition: '0.2s', width: 16, height: 16 }} viewBox="0 0 24 24" fill="var(--ds-text-subtle)"><path d="M8.292 10.293a1.009 1.009 0 0 0 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 0 0 0-1.419.987.987 0 0 0-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 0 0-1.406 0z"/></svg>
        </div>

        {workspaceExpanded && (
          <div className="workspace-accordion-body">
            <div className="home-nav-item active">
              <span className="workspace-logo-small">T</span>
              Trello Workspace
              <svg style={{ marginLeft: 'auto', opacity: 0.7 }} width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8.292 10.293a1.009 1.009 0 0 0 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 0 0 0-1.419.987.987 0 0 0-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 0 0-1.406 0z"/></svg>
            </div>
          </div>
        )}
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="home-main">
        <div className="home-content-wrapper">

          {/* TAB: BOARDS (Default) */}
          {activeTab === 'boards' && (
            <>
              {/* Most popular templates block */}
              <div className="marketing-section">
                <div className="marketing-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {iconTemplates}
                    <h2 className="marketing-title">Most popular templates</h2>
                  </div>
                  <button className="icon-btn" title="Dismiss" onClick={() => {}}><svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M12.854 3.854a.5.5 0 0 0-.708-.708L8 7.293 3.854 3.146a.5.5 0 1 0-.708.708L7.293 8l-4.147 4.146a.5.5 0 0 0 .708.708L8 8.707l4.146 4.147a.5.5 0 0 0 .708-.708L8.707 8l4.147-4.146z"/></svg></button>
                </div>
                <div className="marketing-subtitle">
                  Get going faster with a template from the Trello community or 
                  <select className="marketing-select" disabled>
                    <option>choose a category</option>
                  </select>
                </div>
                <a href="#" className="marketing-link">Browse the full template gallery</a>
              </div>

              {/* Jira banner block */}
              {showJiraPromo && (
                <div className="marketing-section">
                  <div className="marketing-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#2684FF"><path d="M11 2h2v20h-2V2zm-6 7h2v13H5V9zm12 5h2v8h-2v-8z"/></svg>
                      <h2 className="marketing-title">Jira</h2>
                    </div>
                    <button className="icon-btn" title="Dismiss" onClick={() => setShowJiraPromo(false)}><svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M12.854 3.854a.5.5 0 0 0-.708-.708L8 7.293 3.854 3.146a.5.5 0 1 0-.708.708L7.293 8l-4.147 4.146a.5.5 0 0 0 .708.708L8 8.707l4.146 4.147a.5.5 0 0 0 .708-.708L8.707 8l4.147-4.146z"/></svg></button>
                  </div>
                  <div className="marketing-subtitle" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Start with a template and let Jira handle the rest with customizable workflows</span>
                    <button className="marketing-btn-gray">Try it free</button>
                  </div>
                  
                  <div className="jira-cards-grid">
                    {['Project Management', 'Scrum', 'Bug Tracking', 'Web Design Process'].map(title => (
                      <div key={title} className="jira-card-promo">
                        <div className="jira-card-overlay">
                          <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'white' }}>{title}</h4>
                        </div>
                        <svg className="jira-card-arrow" width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M6 6v2h8.59L5 17.59 6.41 19 16 9.41V18h2V6H6z"/></svg>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recently viewed */}
              {recentlyViewed.length > 0 && (
                <div className="home-section" style={{ marginTop: 40 }}>
                  <h3 className="section-title-large">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--ds-icon)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6l5.25 3.15.75-1.23-4-2.37V7z"/></svg>
                    Recently viewed
                  </h3>
                  <div className="boards-grid">
                    {recentlyViewed.map(board => (
                      <Link key={board.id} to={`/board/${board.id}`} className="board-card" style={{ background: board.background }}>
                        <div className="board-card-gradient"></div>
                        <div className="board-card-content">
                          <span className="board-card-title">{board.title}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* YOUR WORKSPACES */}
              <div className="home-section" style={{ marginTop: 40 }}>
                <h3 className="section-title-medium">YOUR WORKSPACES</h3>
                
                <div className="workspace-header">
                  <div className="workspace-header-title">
                    <div className="workspace-logo-medium">T</div>
                    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--ds-text)' }}>Trello Workspace</h2>
                  </div>
                  <div className="workspace-header-actions">
                    <button className="pill-btn"><span className="icon-wrapper">{iconBoards}</span> Boards</button>
                    <button className="pill-btn"><span className="icon-wrapper">{iconMembers}</span> Members</button>
                    <button className="pill-btn"><span className="icon-wrapper">{iconSettings}</span> Settings</button>
                  </div>
                </div>

                <div className="boards-grid" style={{ marginTop: 20 }}>
                  {boards.map(board => (
                    <Link key={board.id} to={`/board/${board.id}`} className="board-card board-card-full" style={{ background: board.background }}>
                      <div className="board-card-gradient"></div>
                      <div className="board-card-content">
                        <span className="board-card-title">{board.title}</span>
                        <button
                          className="board-card-delete"
                          onClick={(e) => handleDelete(e, board.id)}
                          title="Delete board"
                        >
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5z"/></svg>
                        </button>
                      </div>
                    </Link>
                  ))}

                  {/* Create new board tile */}
                  <button className="board-card board-card-create" onClick={() => setShowCreate(true)}>
                    <span>Create new board</span>
                  </button>
                </div>
                
                <div style={{ marginTop: 24 }}>
                  <button className="marketing-btn-gray">View all closed boards</button>
                </div>
              </div>
            </>
          )}

          {/* TAB: TEMPLATES */}
          {activeTab === 'templates' && (
            <div className="templates-coming-soon">
              <img src="https://trello.com/assets/1ffdd8d8db1da8806fbc.svg" alt="Templates" style={{ width: 300, opacity: 0.6 }} />
              <h2>Template gallery coming soon!</h2>
              <p>We're building an authentic replication of the template marketplace. Stay tuned!</p>
              <button className="pill-btn" style={{ marginTop: 20 }} onClick={() => setActiveTab('boards')}>Go back to boards</button>
            </div>
          )}

          {/* TAB: HOME */}
          {activeTab === 'home' && (
            <div className="templates-coming-soon">
              <h2>Home dashboard coming soon!</h2>
              <p>The personalized feeds view is currently under construction.</p>
              <button className="pill-btn" style={{ marginTop: 20 }} onClick={() => setActiveTab('boards')}>Go back to boards</button>
            </div>
          )}

        </div>
      </main>

      {/* Create Board Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal-box create-board-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 380, margin: 'auto' }}>
            <div className="create-modal-header">
              <h3>Create board</h3>
              <button className="icon-btn" onClick={() => setShowCreate(false)}>✕</button>
            </div>

            <div className="board-preview" style={{ background: selectedBg }}>
              <div className="board-preview-lists">
                {['',  '', ''].map((_, i) => (
                  <div key={i} className="board-preview-list">
                    <div className="board-preview-card"></div>
                    <div className="board-preview-card"></div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '16px' }}>
              <div className="section-title" style={{ marginBottom: 8 }}>Background</div>
              <div className="bg-picker-grid">
                {BACKGROUNDS.map((bg, i) => (
                  <button
                    key={i} type="button"
                    className={`bg-swatch-lg ${selectedBg === bg ? 'active' : ''}`}
                    style={{ background: bg }}
                    onClick={() => setSelectedBg(bg)}
                  >
                    {selectedBg === bg && <svg width="12" height="12" viewBox="0 0 16 16" fill="white"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/></svg>}
                  </button>
                ))}
              </div>

              <form onSubmit={handleCreate}>
                <div style={{ marginTop: 16 }}>
                  <label className="form-label" style={{ display: 'block', marginBottom: 4 }}>
                    Board title <span style={{ color: 'var(--text-danger)' }}>*</span>
                  </label>
                  <input
                    className="input"
                    placeholder="Enter board title…"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  style={{ marginTop: 12 }}
                  disabled={!newTitle.trim()}
                >
                  Create
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
