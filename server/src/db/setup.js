const fs   = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

function parseStatements(sql) {
  // Remove single-line comments
  const noComments = sql.replace(/--[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  return noComments
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

async function setup() {
  let connection;
  try {
    // First connect without a database to run CREATE DATABASE
    connection = await mysql.createConnection({
      host:     process.env.DB_HOST,
      port:     process.env.DB_PORT || 3306,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl:      process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : null,
    });
    console.log('✅ Connected to MySQL');

    // Create (or reuse) the database
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    console.log(`✅ Database "${process.env.DB_NAME}" ready`);
    await connection.end();

    // Reconnect with the target database
    connection = await mysql.createConnection({
      host:     process.env.DB_HOST,
      port:     process.env.DB_PORT || 3306,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl:      process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : null,
    });

    const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    const seedSQL   = fs.readFileSync(path.join(__dirname, 'seed.sql'),   'utf8');

    // Strip USE / CREATE DATABASE statements (already handled above)
    const filterFn = s =>
      !s.toUpperCase().startsWith('USE ') &&
      !s.toUpperCase().startsWith('CREATE DATABASE');

    const schemaStmts = parseStatements(schemaSQL).filter(filterFn);
    const seedStmts   = parseStatements(seedSQL).filter(filterFn);

    console.log(`📦 Running schema (${schemaStmts.length} statements)...`);
    for (const stmt of schemaStmts) {
      await connection.query(stmt);
    }
    console.log('✅ Schema created');

    console.log(`🌱 Running seed data (${seedStmts.length} statements)...`);
    for (const stmt of seedStmts) {
      try {
        await connection.query(stmt);
      } catch (e) {
        // Skip duplicate seed data on re-run
        if (e.code !== 'ER_DUP_ENTRY') throw e;
      }
    }
    console.log('✅ Seed data inserted');
    console.log('\n🎉 Database setup complete!');
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

setup();
