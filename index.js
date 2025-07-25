const express = require('express');
const app = express();
const port = 3000;

// راه‌اندازی سرور
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.use(express.json());

const userRoutes = require('./userRoutes'); 
app.use('/', userRoutes);
// ***************************
const sql = require('mssql');

const config = {
  server: 'localhost',
  database: 'hw6',
  user: 'sa',
  password: '8Asdfghjkl8asdfghjkl',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

async function queryDb(query, params = []) {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();

    // Add parameters
    params.forEach(p => {
      request.input(p.name, p.type, p.value);
    });

    const result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.error('DB Query Error:', err);
    throw err;
  }
}

module.exports = { queryDb, sql };







