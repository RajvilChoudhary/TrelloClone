import React from 'react';
import ReactDOM from 'react-dom';
import './BottomNav.css';

export default function BottomNav({ activeViews, toggleView }) {
  const nav = (
    <div className="bottom-nav-container">
      <div className="bottom-nav">

        {/* Inbox */}
        <button
          id="nav-inbox"
          className={`bnav-item${activeViews.inbox ? ' active' : ''}`}
          onClick={() => toggleView('inbox')}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
            <path d="M1 4.5A1.5 1.5 0 0 1 2.5 3h11A1.5 1.5 0 0 1 15 4.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 11.5v-7zm1.5-.5a.5.5 0 0 0-.5.5v2.88L6.852 9.07a1.5 1.5 0 0 0 2.296 0L14 7.379V4.5a.5.5 0 0 0-.5-.5h-11zM14 8.718l-4.225 3.17a.5.5 0 0 1-.55 0L5 8.718V11.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-2.782z"/>
          </svg>
          <span>Inbox</span>
        </button>

        {/* Planner — inactive */}
        <button id="nav-planner" className="bnav-item disabled" disabled title="Coming soon">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
          </svg>
          <span>Planner</span>
        </button>

        {/* Board */}
        <button
          id="nav-board"
          className={`bnav-item${activeViews.board ? ' active' : ''}`}
          onClick={() => toggleView('board')}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
            <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h11A1.5 1.5 0 0 1 15 2.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 13.5v-11zm1.5-.5a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h4v-12h-4zm5 0v12h4v-12h-4zm5 0v12h1.5a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-.5-.5h-1.5z"/>
          </svg>
          <span>Board</span>
        </button>

        <div className="bnav-divider" />

        {/* Switch Boards */}
        <button
          id="nav-switch"
          className="bnav-item"
          onClick={() => { window.location.href = '/'; }}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
            <path d="M13 2.5a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-1 0V3a.5.5 0 0 1 .5-.5z"/>
          </svg>
          <span>Switch boards</span>
        </button>

      </div>
    </div>
  );

  // Render via portal directly into document.body — escapes all overflow/stacking contexts
  return ReactDOM.createPortal(nav, document.body);
}
