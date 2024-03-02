const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); // Import the cors middleware

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS middleware
app.use(cors());

// PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'CustomerDetails',
  password: 'qwert',
  port: 5432, // Default PostgreSQL port
});

// Fetch 50 records from the customers table
app.get('/api/customers', async (req, res) => {
  try {
    const query = 'SELECT * FROM customers LIMIT 50';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
