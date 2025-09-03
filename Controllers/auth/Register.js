const bcrypt = require("bcrypt");
const { UserData } = require("../../Models/UserSchema");

/**
 * Register Controller
 * -------------------
 * - Accepts username, email, password (required), and first/last name (optional)
 * - Validates required fields
 * - Ensures email is unique
 * - Hashes password securely before saving
 * - Creates a new user document
 */
const Register = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    // 1. Validate required fields
    if (!username || !password || !email) {
      return res.status(400).json({ error: "Username, password, and email are required" });
    }

    // 2. Check if user already exists
    const existingUser = await UserData.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create new user
    const newUser = new UserData({
      username,
      email,
      password: hashedPassword,
      role: "user", // default role
      firstName: firstName || "",
      lastName: lastName || "",
      phoneNumber: "",
      address: "",
    });

    await newUser.save();

    // 5. Send response
    return res.status(201).json({ ok: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ error: "Server error in Register" });
  }
};

module.exports = { Register };
