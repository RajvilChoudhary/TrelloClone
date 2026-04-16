import React, { useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import './InboxSidebar.css';

export default function InboxSidebar({ cards, onAddCard, onOpenCard }) {
  const [addingCard, setAddingCard] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddCard(null, newTitle.trim()); // null list_id for inbox
    setNewTitle('');
    setAddingCard(false);
  };

  return (
    <div className="inbox-sidebar">
      <div className="inbox-header">
        <div className="inbox-title">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
            <path d="M1 4.5A1.5 1.5 0 0 1 2.5 3h11A1.5 1.5 0 0 1 15 4.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 11.5v-7zm1.5-.5a.5.5 0 0 0-.5.5v2.88L6.852 9.07a1.5 1.5 0 0 0 2.296 0L14 7.379V4.5a.5.5 0 0 0-.5-.5h-11zM14 8.718l-4.225 3.17a.5.5 0 0 1-.55 0L5 8.718V11.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-2.782z"/>
          </svg>
          <h2>Inbox</h2>
        </div>
        <div className="inbox-actions">
          <button className="icon-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
            </svg>
          </button>
          <button className="icon-btn">•••</button>
        </div>
      </div>

      <div className="inbox-body">
        {addingCard ? (
          <form onSubmit={handleAdd} className="inbox-add-form">
            <textarea
              className="textarea"
              placeholder="Enter a title for this card…"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAdd(e); } }}
              autoFocus
              rows={2}
            />
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              <button type="submit" className="btn btn-primary btn-sm">Add</button>
              <button type="button" className="icon-btn" onClick={() => setAddingCard(false)}>✕</button>
            </div>
          </form>
        ) : (
          <button className="inbox-add-btn" onClick={() => setAddingCard(true)}>
            Add a card
          </button>
        )}

        <Droppable droppableId="inbox" type="CARD">
          {(provided, snapshot) => (
            <div
              className={`inbox-cards-list ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {cards.map((card, index) => (
                <Draggable key={card.id} draggableId={`card-${card.id}`} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`inbox-card-item ${snapshot.isDragging ? 'dragging' : ''}`}
                      onClick={() => onOpenCard(card)}
                    >
                      <span className="inbox-card-title">{card.title}</span>
                      <div className="inbox-card-meta">
                        {(card.description || card.comment_count > 0 || card.checklist_total > 0) && (
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                          </svg>
                        )}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
}
