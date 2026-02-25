const pool = require("../config/db");

// Create user
const createUser = async (name, email, hashedPassword) => {
  const query = `
    INSERT INTO users (name, email, password, phone)
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

//forgot and reset password functions
const findByEmail = (email) => {
  return pool.query("SELECT * FROM users WHERE email = $1", [email]);
};

const saveResetToken = (email, token, expiry) => {
  return pool.query(
    `UPDATE users 
     SET reset_password_token=$1, reset_password_expires=$2
     WHERE email=$3`,
    [token, expiry, email]
  );
};

const findByResetToken = (token) => {
  return pool.query(
    `SELECT * FROM users 
     WHERE reset_password_token=$1 
     AND reset_password_expires > NOW()`,
    [token]
  );
};

const updatePassword = (id, password) => {
  return pool.query(
    `UPDATE users 
     SET password=$1,
         reset_password_token=NULL,
         reset_password_expires=NULL
     WHERE id=$2`,
    [password, id]
  );
};


module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  findByEmail,
  saveResetToken,
  findByResetToken,
  updatePassword,
};