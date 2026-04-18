const fs   = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

function parseStatements(sql) {
  const noComments = sql.replace(/--[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  return noComments
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

async function reset() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host:     process.env.DB_HOST,
      port:     process.env.DB_PORT || 3306,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl:      process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : null,
    });
    console.log('✅ Connected to MySQL');

    console.log('🗑️ Dropping existing tables...');
    const tables = [
      'activity_log', 'attachments', 'comments', 'checklist_items', 'checklists',
      'card_labels', 'labels', 'card_members', 'cards', 'lists', 'board_members', 'boards', 'users'
    ];
    
    // Disable foreign key checks to avoid drop order issues
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    for (const table of tables) {
      await connection.query(`DROP TABLE IF EXISTS ${table}`);
      console.log(`   Dropped ${table}`);
    }
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    const seedSQL   = fs.readFileSync(path.join(__dirname, 'seed.sql'),   'utf8');

    const schemaStmts = parseStatements(schemaSQL);
    const seedStmts   = parseStatements(seedSQL).filter(s => 
      !s.toUpperCase().startsWith('USE ') && 
      !s.toUpperCase().startsWith('CREATE DATABASE')
    );

    console.log('📦 Recreating schema...');
    for (const stmt of schemaStmts) {
      await connection.query(stmt);
    }
    console.log('✅ Schema created');

    console.log('🌱 Seeding clean data...');
    for (const stmt of seedStmts) {
      await connection.query(stmt);
    }
    console.log('✅ Clean seed data inserted');
    console.log('\n🎉 Database reset and re-seeded successfully!');

  } catch (error) {
    console.error('❌ Reset failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

reset();
