const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.APP_URL}/api/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email",
    html: `
      <h3>Email Verification</h3>
      <p>Click the link below to verify your email:</p>
      <a href="${verifyUrl}">Verify Email</a>
    `
  });
};

// send reset password email
const sendResetPasswordEmail = async (email, token) => {
  const link = `${process.env.APP_URL}/api/auth/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Password",
    html: `
      <p>Click below to reset your password:</p>
      <a href="${link}">Reset Password</a>
      <p>This link expires in 15 minutes</p>
    `
  });
};

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail
};