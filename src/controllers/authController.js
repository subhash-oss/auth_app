const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");
const {sendVerificationEmail, sendResetPasswordEmail } = require("../utils/sendEmail");


// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // 1️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2️⃣ Create unique verification token
    const verificationToken = uuidv4();

    // 3️⃣ Save user with is_verified = false
    const result = await pool.query(
      `INSERT INTO users (name, email, password, phone,verification_token)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email`,
      [name, email, hashedPassword, phone, verificationToken]
    );

    // 4️⃣ Send verification email
    await sendVerificationEmail(email, verificationToken);

    // 5️⃣ Response
    res.status(201).json({
      message: "User registered. Please verify your email.",
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const userEmail = await User.findByEmail(email);

  if (userEmail.rows.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min

  await User.saveResetToken(email, token, expiry);

  await sendResetPasswordEmail(email, token);

  res.json({ message: "Reset password email sent" });
};

//reset password
exports.resetPassword = async (req, res) => {
  const { token } = req.query;
  const { password } = req.body;

  const userReset = await User.findByResetToken(token);

  if (userReset.rows.length === 0) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.updatePassword(userReset.rows[0].id, hashedPassword);

  res.json({ message: "Password reset successful" });
};

// EMAIL VERIFICATION
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    // 1️⃣ Find user by token
    const user = await pool.query(
      "SELECT * FROM users WHERE verification_token = $1",
      [token]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // 2️⃣ Update verification status
    await pool.query(
      `UPDATE users
       SET is_verified = true, verification_token = NULL
       WHERE id = $1`,
      [user.rows[0].id]
    );

    res.json({ message: "Email verified successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN
   exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Get user from DB
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];

    // 2️⃣ CHECK EMAIL VERIFICATION  ✅ ADD THIS PART
    if (!user.is_verified) {
      return res.status(403).json({
        message: "Please verify your email before logging in"
      });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 4️⃣ Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5️⃣ Send response
    res.json({ token });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PROFILE (Protected)
exports.profile = async (req, res) => {
  try {
    const user = await User.findUserById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};