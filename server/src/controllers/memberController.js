const pool = require('../config/db');

// GET /api/members
const getAllMembers = async (req, res, next) => {
  try {
    const [users] = await pool.execute('SELECT * FROM users ORDER BY name ASC');
    res.json(users);
  } catch (err) { next(err); }
};

module.exports = { getAllMembers };
