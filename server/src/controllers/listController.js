const pool = require('../config/db');

// POST /api/lists
const createList = async (req, res, next) => {
  try {
    const { board_id, title } = req.body;
    const [[{ maxPos }]] = await pool.execute(
      'SELECT COALESCE(MAX(position), 0) AS maxPos FROM lists WHERE board_id = ?',
      [board_id]
    );
    const position = maxPos + 1;
    const [result] = await pool.execute(
      'INSERT INTO lists (board_id, title, position) VALUES (?, ?, ?)',
      [board_id, title, position]
    );
    const [[list]] = await pool.execute('SELECT * FROM lists WHERE id = ?', [result.insertId]);
    await pool.execute(
      'INSERT INTO activity_log (board_id, user_id, action, data) VALUES (?, ?, ?, ?)',
      [board_id, 1, 'created_list', JSON.stringify({ title })]
    );
    res.status(201).json({ ...list, cards: [] });
  } catch (err) { next(err); }
};

// PUT /api/lists/:id
const updateList = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    await pool.execute('UPDATE lists SET title = ? WHERE id = ?', [title, id]);
    const [[list]] = await pool.execute('SELECT * FROM lists WHERE id = ?', [id]);
    res.json(list);
  } catch (err) { next(err); }
};

// PUT /api/lists/:id/reorder
const reorderList = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { position } = req.body;
    await pool.execute('UPDATE lists SET position = ? WHERE id = ?', [position, id]);
    res.json({ message: 'List reordered' });
  } catch (err) { next(err); }
};

// DELETE /api/lists/:id  (archive)
const deleteList = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.execute('UPDATE lists SET archived = 1 WHERE id = ?', [id]);
    res.json({ message: 'List archived' });
  } catch (err) { next(err); }
};

module.exports = { createList, updateList, reorderList, deleteList };
