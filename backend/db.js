
const sql = require('mssql');

const config = {
  server: 'localhost',
  database: 'ProjectDB',
  user: 'sa',
  password: 'Sqlserver2022',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function queryDb(query, params = []) {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();

    params.forEach(p => {
      request.input(p.name, p.type, p.value);
    });

    const result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.error('DB Query Error:', err);
  }
}

module.exports = { queryDb, sql };
