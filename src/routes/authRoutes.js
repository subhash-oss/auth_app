const express = require("express");
const router = express.Router();
const {login, profile } = require("../controllers/authController");
const authController = require("../controllers/authController");
const auth = require("../middlewares/authMiddleware");
const validateRegister = require("../middlewares/validateRegister");
const validateLogin = require("../middlewares/validateLogin");

router.post("/register", validateRegister, authController.register);
router.get("/verify-email", authController.verifyEmail);
router.post("/login", validateLogin, login);
router.get("/profile", auth, profile);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;