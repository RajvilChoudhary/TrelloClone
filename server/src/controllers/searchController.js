const pool = require('../config/db');

// GET /api/search?q=...
const searchAll = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.json({ boards: [], lists: [], cards: [] });
    }

    const searchPattern = `%${q}%`;

    // 1. Search Boards
    const [boards] = await pool.execute(
      'SELECT id, title, background FROM boards WHERE title LIKE ? LIMIT 5',
      [searchPattern]
    );

    // 2. Search Lists
    // We include the first card ID so we can navigate to the "first item" as requested
    const [lists] = await pool.execute(`
      SELECT l.id, l.title, l.board_id, b.title as board_title,
        (SELECT id FROM cards WHERE list_id = l.id AND archived = 0 ORDER BY position ASC LIMIT 1) as first_card_id
      FROM lists l
      JOIN boards b ON l.board_id = b.id
      WHERE l.title LIKE ? AND l.archived = 0
      LIMIT 5
    `, [searchPattern]);

    // 3. Search Cards
    const [cards] = await pool.execute(`
      SELECT c.id, c.title, c.board_id, b.title as board_title
      FROM cards c
      JOIN boards b ON c.board_id = b.id
      WHERE c.title LIKE ? AND c.archived = 0
      LIMIT 10
    `, [searchPattern]);

    res.json({ boards, lists, cards });
  } catch (err) {
    next(err);
  }
};

module.exports = { searchAll };
