import mysql from 'mysql2/promise';

// Create MySQL connection pool for Next.js API routes
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pes_players_300_basic',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
