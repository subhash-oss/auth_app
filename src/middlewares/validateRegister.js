module.exports = (req, res, next) => {
  const { name, email, password } = req.body;

  // Name validation
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ message: "Name is required" });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      message: "Please provide a valid email address"
    });
  }

  // Password validation (NO minimum length)
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/;

  if (!password) {
    return res.status(400).json({
      message: "Password is required"
    });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must include at least 1 uppercase letter, 1 number, and 1 special character"
    });
  }

  next(); // ✅ validation passed
};