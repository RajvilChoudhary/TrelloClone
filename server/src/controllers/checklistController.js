const pool = require('../config/db');

// POST /api/cards/:id/checklists
const createChecklist = async (req, res, next) => {
  try {
    const { title } = req.body;
    const { id: card_id } = req.params;
    const [[card]] = await pool.execute('SELECT board_id FROM cards WHERE id = ?', [card_id]);
    const [result] = await pool.execute(
      'INSERT INTO checklists (card_id, title) VALUES (?, ?)',
      [card_id, title || 'Checklist']
    );
    await pool.execute(
      'INSERT INTO activity_log (card_id, board_id, user_id, action, data) VALUES (?, ?, ?, ?, ?)',
      [card_id, card.board_id, 1, 'added_checklist', JSON.stringify({ title })]
    );
    const [[checklist]] = await pool.execute('SELECT * FROM checklists WHERE id = ?', [result.insertId]);
    res.status(201).json({ ...checklist, items: [] });
  } catch (err) { next(err); }
};

// DELETE /api/checklists/:id
const deleteChecklist = async (req, res, next) => {
  try {
    await pool.execute('DELETE FROM checklists WHERE id = ?', [req.params.id]);
    res.json({ message: 'Checklist deleted' });
  } catch (err) { next(err); }
};

// POST /api/checklists/:id/items
const addItem = async (req, res, next) => {
  try {
    const { title } = req.body;
    const { id: checklist_id } = req.params;
    const [[{ maxPos }]] = await pool.execute(
      'SELECT COALESCE(MAX(position), 0) AS maxPos FROM checklist_items WHERE checklist_id = ?',
      [checklist_id]
    );
    const [result] = await pool.execute(
      'INSERT INTO checklist_items (checklist_id, title, position) VALUES (?, ?, ?)',
      [checklist_id, title, maxPos + 1]
    );
    const [[item]] = await pool.execute('SELECT * FROM checklist_items WHERE id = ?', [result.insertId]);
    res.status(201).json(item);
  } catch (err) { next(err); }
};

// PUT /api/checklist-items/:id
const updateItem = async (req, res, next) => {
  try {
    const { title, completed } = req.body;
    await pool.execute(
      'UPDATE checklist_items SET title = COALESCE(?, title), completed = COALESCE(?, completed) WHERE id = ?',
      [title || null, completed !== undefined ? completed : null, req.params.id]
    );
    const [[item]] = await pool.execute('SELECT * FROM checklist_items WHERE id = ?', [req.params.id]);
    res.json(item);
  } catch (err) { next(err); }
};

// DELETE /api/checklist-items/:id
const deleteItem = async (req, res, next) => {
  try {
    await pool.execute('DELETE FROM checklist_items WHERE id = ?', [req.params.id]);
    res.json({ message: 'Item deleted' });
  } catch (err) { next(err); }
};

module.exports = { createChecklist, deleteChecklist, addItem, updateItem, deleteItem };
