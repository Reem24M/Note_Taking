const { UserData } = require("../../Models/UserSchema");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

/**
 * ForgetPassword Controller
 * -------------------------
 * - Accepts user email
 * - Generates a random password reset token (valid for 5 minutes)
 * - Saves token + expiry in the user document
 * - In a real app, you would send this token in an email with a reset link
 */
const ForgetPassword = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).send("Email required");
    }

    // Find user by email
    let user = await UserData.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found");
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Save reset token and expiry
    await UserData.findOneAndUpdate(
      { email: email },
      {
        passwordResetToken: resetToken,
        passwordResetTokenExpiry: expiry,
      },
      { new: true }
    );

    // Return message (in real app, send email with reset link)
    return res.status(200).json({
      message: "Password reset token created successfully",
      resetToken, // ⚠️ only for testing; remove in production
    });
  } catch (err) {
    console.error("ForgetPassword error:", err);
    return res.status(500).send("Server error in ForgetPassword");
  }
};

/**
 * ResetPassword Controller
 * ------------------------
 * - Accepts reset token (from query string) + new password + confirm password
 * - Verifies token, expiry, and passwords match
 * - Hashes new password before saving
 */
const ResetPassword = async (req, res) => {
  try {
    let { passwordResetToken } = req.query;
    let { newPassword, confirmPassword } = req.body;

    if (!passwordResetToken) {
      return res.status(400).send("Password reset token required");
    }
    if (!newPassword || !confirmPassword) {
      return res.status(400).send("New password and confirm password are required");
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).send("Passwords do not match");
    }

    // Find user by token
    let user = await UserData.findOne({ passwordResetToken });
    if (!user) {
      return res.status(400).send("Invalid or expired token");
    }

    // Check token expiry
    if (user.passwordResetTokenExpiry < Date.now()) {
      return res.status(400).send("Password reset token expired");
    }

    // Hash new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear token
    await UserData.findOneAndUpdate(
      { email: user.email },
      {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetTokenExpiry: null,
      },
      { new: true }
    );

    return res.status(200).send("Password reset successfully");
  } catch (err) {
    console.error("ResetPassword error:", err);
    return res.status(500).send("Server error in ResetPassword");
  }
};

module.exports = { ForgetPassword, ResetPassword };
