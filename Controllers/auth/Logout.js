const { SessionData } = require("../../Models/SessionSchema");

/**
 * Logout Controller
 * -----------------
 * - Reads token from headers
 * - Verifies if session exists in DB
 * - Deletes the session (logs the user out)
 */
const Logout = async (req, res) => {
  try {
    // Get token from request headers
    let token = req.headers.token; // or req.headers["authorization"] if using Bearer tokens

    // If no token provided, reject request
    if (!token) {
      return res.status(400).json({ message: "Not authenticated" });
    }

    // Check if session exists
    const userSession = await SessionData.findOne({ token });
    if (!userSession) {
      return res.status(404).json({ message: "Can't logout, session not found" });
    }

    // Delete session (invalidate token)
    await SessionData.findOneAndDelete({ token });

    // Success
    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { Logout };
