require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const pool = require('../src/config/db');

async function migrate() {
  try {
    // Check if completed column exists
    const [cols] = await pool.execute(`SHOW COLUMNS FROM cards LIKE 'completed'`);
    if (cols.length === 0) {
      await pool.execute(`ALTER TABLE cards ADD COLUMN completed BOOLEAN NOT NULL DEFAULT 0`);
      console.log('✅ Added completed column to cards table');
    } else {
      console.log('ℹ️  completed column already exists');
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}
migrate();
