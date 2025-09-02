const { SessionData } = require("../../Models/SessionSchema");

const Logout = async (req, res) => {
  try {
    // const token = req.headers["authorization"];
    let token=req.headers.token
    if (!token) {
      return res.status(400).json({ message: "Not authenticated" });
    }

    const user = await SessionData.findOne({  token });
    if (!user) {
      return res.status(404).json({ message: "Can't logout" });
    }

    await SessionData.findOneAndDelete({ token });
    

    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { Logout };
