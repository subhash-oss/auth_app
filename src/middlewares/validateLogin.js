module.exports = (req, res, next) => {
  const { email, password } = req.body;

  // 1️⃣ Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      message: "Please provide a valid email address"
    });
  }

  // 2️⃣ Password validation (NO length rule)
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

  // ✅ All validations passed
  next();
};