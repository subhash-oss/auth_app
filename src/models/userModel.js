const pool = require("../config/db");

// Create user
const createUser = async (name, email, hashedPassword) => {
  const query = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email
  `;

  const values = [name, email, hashedPassword];
  const result = await pool.query(query, values);

  return result.rows[0];
};

// Find user by email
const findUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1`;
  const result = await pool.query(query, [email]);

  return result.rows[0];
};

// Find user by ID
const findUserById = async (id) => {
  const query = `SELECT id, name, email FROM users WHERE id = $1`;
  const result = await pool.query(query, [id]);

  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};