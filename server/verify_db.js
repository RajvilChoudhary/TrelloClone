const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  try {
    const conn = await mysql.createConnection({
      host:     process.env.DB_HOST,
      port:     process.env.DB_PORT,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl:      process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : null,
    });
    const [rows] = await conn.query('SHOW TABLES');
    console.log('--- TABLES IN "' + process.env.DB_NAME + '" ---');
    console.table(rows);

    const [[usersResult]] = await conn.query('SELECT COUNT(*) as count FROM users');
    const [sampleUser] = await conn.query('SELECT name, email FROM users LIMIT 1');

    console.log('\n--- DATA VERIFICATION ---');
    console.log('Total users found:', usersResult.count);
    if (sampleUser.length > 0) {
      console.log('Sample user from DB:', sampleUser[0].name, '(' + sampleUser[0].email + ')');
    }
    await conn.end();
  } catch (err) {
    console.error('Check failed:', err.message);
  }
})();
