const pool = require('../config/db');

// GET /api/boards/:id/labels
const getBoardLabels = async (req, res, next) => {
  try {
    const [labels] = await pool.execute('SELECT * FROM labels WHERE board_id = ?', [req.params.id]);
    res.json(labels);
  } catch (err) { next(err); }
};

// POST /api/boards/:id/labels
const createLabel = async (req, res, next) => {
  try {
    const { name, color } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO labels (board_id, name, color) VALUES (?, ?, ?)',
      [req.params.id, name || '', color]
    );
    const [[label]] = await pool.execute('SELECT * FROM labels WHERE id = ?', [result.insertId]);
    res.status(201).json(label);
  } catch (err) { next(err); }
};

// PUT /api/labels/:id
const updateLabel = async (req, res, next) => {
  try {
    const { name, color } = req.body;
    await pool.execute(
      'UPDATE labels SET name = COALESCE(?, name), color = COALESCE(?, color) WHERE id = ?',
      [name || null, color || null, req.params.id]
    );
    const [[label]] = await pool.execute('SELECT * FROM labels WHERE id = ?', [req.params.id]);
    res.json(label);
  } catch (err) { next(err); }
};

// DELETE /api/labels/:id
const deleteLabel = async (req, res, next) => {
  try {
    await pool.execute('DELETE FROM labels WHERE id = ?', [req.params.id]);
    res.json({ message: 'Label deleted' });
  } catch (err) { next(err); }
};

module.exports = { getBoardLabels, createLabel, updateLabel, deleteLabel };
