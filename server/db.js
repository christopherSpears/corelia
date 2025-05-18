const { Pool } = require('pg');

const pool = new Pool({
    user: 'lushly_website',
    password: 'lushly_website',
    host: 'localhost',
    port: 5432,
    database: 'lushly_corelia',
    max: 10, idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

pool.query('SELECT 1')
    .then(() => console.log('PostrgreSQL connection established'))
    .catch(err => console.error('PostgreSQL connection error', err));

module.exports = pool;