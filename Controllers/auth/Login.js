const { SessionData } = require("../../Models/SessionSchema");
const { UserData } = require("../../Models/UserSchema");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

/**
 * Step 1: LoginStart
 * -------------------
 * - User provides username & password
 * - Verify user exists
 * - Compare hashed password
 * - If valid: generate OTP (valid for 10 min)
 * - Save OTP in DB and send back response
 */
const LoginStart = async (req, res) => {
  try {
    let { username, password } = req.body;

    // Check required fields
    if (!username || !password) {
      return res.status(400).json({ error: "Missing username or password" });
    }

    // Find user in DB
    let user = await UserData.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Compare given password with hashed password in DB
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Wrong password" });
    }

    // If OTP already exists, ask user to verify instead of generating new
    if (user.otp !== null) {
      return res.status(400).send("OTP already sent, please verify");
    }

    // Generate new OTP (6 digits)
    let newOtp = Math.floor(100000 + Math.random() * 900000);
    user.otp = newOtp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 min
    await user.save();

    // In real app, send OTP via email/SMS here

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("LoginStart error:", err);
    return res.status(500).json({ error: "Server error in LoginStart" });
  }
};

/**
 * Step 2: LoginVerify
 * -------------------
 * - User provides username & OTP code
 * - Verify OTP exists and is not expired
 * - Compare OTP
 * - If correct: clear OTP, generate session token, save session
 * - Return token to client
 */
const LoginVerify = async (req, res) => {
  try {
    let { username, otpCode } = req.body;

    // Validate request
    if (!username || !otpCode) {
      return res.status(400).send("Missing username or OTP code");
    }

    // Find user
    let user = await UserData.findOne({ username });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Ensure OTP exists
    if (!user.otp || !user.otpExpiry) {
      return res.status(401).send("No active OTP");
    }

    // Check if OTP expired
    if (user.otpExpiry < new Date()) {
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
      return res.status(401).send("OTP expired");
    }

    // Compare OTP values
    otpCode = otpCode.toString().trim();
    if (user.otp.toString() !== otpCode) {
      return res.status(401).send("Invalid OTP code");
    }

    // Clear OTP after successful login
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Generate access token (session token)
    const accessToken = crypto.randomBytes(32).toString("hex");

    // Save new session in DB
    const newSession = new SessionData({
      username: user.username,
      token: accessToken,
      role: user.role,
    });
    await newSession.save();

    // Respond with success + session token
    return res.status(200).json({
      message: "Login successful",
      user,
      token: accessToken,
    });
  } catch (err) {
    console.error("LoginVerify error:", err);
    return res.status(500).json({ error: "Server error in LoginVerify" });
  }
};

module.exports = { LoginStart, LoginVerify };
