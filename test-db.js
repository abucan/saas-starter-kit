// Test script to verify PostgreSQL connection
// Run with: node test-db-connection.js

import dotenv from 'dotenv';
import { Pool } from 'pg';
dotenv.config();

async function testConnection() {
  const connectionString =
    process.env.DATABASE_URL ||
    'postgresql://postgres:root@localhost:5432/saas_starter_kit_db';

  console.log(
    'Testing connection to:',
    connectionString.replace(/:[^:@]*@/, ':****@')
  );

  const pool = new Pool({
    connectionString: connectionString,
  });

  try {
    const client = await pool.connect();
    console.log('✅ Successfully connected to PostgreSQL!');

    const result = await client.query('SELECT version()');
    console.log('📊 PostgreSQL version:', result.rows[0].version);

    client.release();
    await pool.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n💡 Common fixes:');
    console.log(
      '1. Check if PostgreSQL is running: brew services start postgresql (macOS) or sudo service postgresql start (Linux)'
    );
    console.log('2. Verify your username and password');
    console.log('3. Make sure the database exists');
    console.log('4. Check if the port 5432 is correct');
  }
}

testConnection();
