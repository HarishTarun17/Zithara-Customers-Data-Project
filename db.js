const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'CustomerDetails',
  password: 'qwert',
  port: 5432,
});

pool
    .connect()
    .then(()=>console.log("Db connected"))
    .catch((e)=>console.log("Db connection failed"));
    
pool.query('select * from customers').then(res=>console.log(res)).catch(e=>console.log(e))

module.exports = pool;
