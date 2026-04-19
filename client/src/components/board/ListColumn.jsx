import React, { useState, useRef } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import CardItem from './CardItem';
import './ListColumn.css';

export default function ListColumn({ list, labels, members, dragHandleProps, onUpdateList, onDeleteList, onAddCard, onOpenCard, onToggleCardComplete }) {
  const [isCollapsed, setIsCollapsed]   = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleVal, setTitleVal]         = useState(list.title);
  const [addingCard, setAddingCard]     = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [showMenu, setShowMenu]         = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const menuRef = useRef(null);

  const handleTitleSave = () => {
    if (titleVal.trim() && titleVal !== list.title) onUpdateList(list.id, titleVal.trim());
    else setTitleVal(list.title);
    setEditingTitle(false);
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;
    await onAddCard(list.id, newCardTitle.trim());
    setNewCardTitle('');
  };

  const handleDelete = () => {
    onDeleteList(list.id);
    setShowMenu(false);
    setConfirmingDelete(false);
  };

  const labelMap = {};
  labels.forEach(l => labelMap[l.id] = l);
  const memberMap = {};
  members.forEach(m => memberMap[m.id] = m);

  return (
    <div className={`list-column ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Collapsed View */}
      {isCollapsed ? (
        <div className="collapsed-content" {...dragHandleProps} onClick={() => setIsCollapsed(false)}>
          <button className="icon-btn" onClick={(e) => { e.stopPropagation(); setIsCollapsed(false); }} title="Expand list">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 12H4 M4 12l3-3 M4 12l3 3 M14 12h6 M20 12l-3-3 M20 12l-3 3" />
            </svg>
          </button>
          <div className="collapsed-text">
            <span className="collapsed-title">{list.title}</span>
            <span className="collapsed-count">{list.cards.length}</span>
          </div>
        </div>
      ) : (
        <>
          {/* List Header */}
          <div className="list-header" {...dragHandleProps}>
        {editingTitle ? (
          <input
            className="list-title-input"
            value={titleVal}
            onChange={e => setTitleVal(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={e => { if (e.key === 'Enter') handleTitleSave(); if (e.key === 'Escape') { setTitleVal(list.title); setEditingTitle(false); } }}
            autoFocus
            id={`list-title-edit-${list.id}`}
          />
        ) : (
          <h3 className="list-title" onClick={() => setEditingTitle(true)} id={`list-title-${list.id}`}>
            {list.title}
          </h3>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button className="icon-btn" onClick={() => setIsCollapsed(true)} title="Collapse list">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12h6 M10 12l-3-3 M10 12l-3 3 M20 12h-6 M14 12l3-3 M14 12l3 3" />
            </svg>
          </button>
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button
              className="icon-btn"
            onClick={() => { setShowMenu(v => !v); setConfirmingDelete(false); }}
            id={`list-menu-${list.id}`}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="2" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="14" cy="8" r="1.5"/>
            </svg>
          </button>
          {showMenu && (
            <div className="dropdown-menu" style={{ right: 0, top: '100%', marginTop: 4 }} id={`list-menu-dropdown-${list.id}`}>
              {!confirmingDelete ? (
                <>
                  <button className="dropdown-item" onClick={() => { setEditingTitle(true); setShowMenu(false); }}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-2.5-2.5zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/></svg>
                    Rename list
                  </button>
                  <button className="dropdown-item" onClick={() => { setAddingCard(true); setShowMenu(false); }}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg>
                    Add card
                  </button>
                  <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }}></div>
                  <button className="dropdown-item danger" onClick={() => setConfirmingDelete(true)}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>
                    Delete list
                  </button>
                </>
              ) : (
                <div style={{ padding: '8px 12px' }}>
                  <p style={{ fontSize: 13, marginBottom: 8, color: 'var(--text-primary)' }}>
                    Delete "<strong>{list.title}</strong>" and all its cards?
                  </p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-danger btn-sm" onClick={handleDelete} id={`confirm-delete-list-${list.id}`}>Delete</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setConfirmingDelete(false)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Cards */}
      <Droppable droppableId={String(list.id)} type="CARD">
        {(provided, snapshot) => (
          <div
            className={`list-cards ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {list.cards.map((card, index) => (
              <Draggable key={card.id} draggableId={`card-${card.id}`} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={snapshot.isDragging ? 'card-dragging' : ''}
                  >
                    <CardItem
                      card={card}
                      labelMap={labelMap}
                      memberMap={memberMap}
                      onClick={() => onOpenCard(card)}
                      onToggleComplete={onToggleCardComplete}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add Card */}
      {addingCard ? (
        <div className="add-card-form-wrap">
          <form onSubmit={handleAddCard}>
            <textarea
              id={`add-card-input-${list.id}`}
              className="textarea"
              placeholder="Enter a title for this card…"
              value={newCardTitle}
              onChange={e => setNewCardTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { handleAddCard(e); } }}
              autoFocus rows={2}
              style={{ minHeight: 60 }}
            />
            <div style={{ display: 'flex', gap: 6, marginTop: 6, alignItems: 'center' }}>
              <button type="submit" className="btn btn-primary btn-sm" id={`submit-card-${list.id}`}>Add card</button>
              <button type="button" className="icon-btn" onClick={() => { setAddingCard(false); setNewCardTitle(''); }}>✕</button>
            </div>
          </form>
        </div>
      ) : (
        <button className="add-card-btn" onClick={() => setAddingCard(true)} id={`add-card-btn-${list.id}`}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
          </svg>
          Add a card
        </button>
      )}
        </>
      )}
    </div>
  );
}
