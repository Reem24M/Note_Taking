const { SessionData } = require("../../Models/SessionSchema")
const { UserData } = require("../../Models/UserSchema")
const bcrypt = require('bcrypt')

const GetProfile = async (req, res) => {
    // 1. Check authentication
    let token = req.headers.token
    if (!token)
        return res.status(200).send("Not authenticated")

    // 2. Validate session by token
    let user = await SessionData.findOne({ token })
    if (!user)
        return res.status(200).send("Not authenticated")

    // 3. Find user details from UserData collection
    let data = await UserData.findOne({ username: user.username })
    if (!data)
        return res.status(200).send("User not found")

    // 4. Return profile data
    res.status(200).send(data)
}

const ChangePassword = async (req, res) => {
  try {
    // 1. Check authentication
    let token = req.headers.token;
    if (!token)
      return res.status(401).json({ message: "Not authenticated" });

    // 2. Validate session
    let user = await SessionData.findOne({ token });
    if (!user)
      return res.status(401).json({ message: "Not authenticated" });

    // 3. Get old/new/confirm password from request
    let { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmPassword)
      return res.status(400).json({ message: "All fields are required" });

    // 4. Ensure new password matches confirm password
    if (newPassword !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    // 5. Get user data
    let userdata = await UserData.findOne({ username: user.username });
    if (!userdata)
      return res.status(404).json({ message: "User not found" });

    // 6. Compare old password with hashed password in DB
    const isMatch = await bcrypt.compare(oldPassword, userdata.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // 7. Hash new password and save
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    userdata.password = hashedPassword;
    await userdata.save();

    // 8. Respond success
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const ChangeLSName = async (req, res) => {
  try {
    // 1. Check authentication
    let token = req.headers.token;
    if (!token)
      return res.status(401).json({ message: "Not authenticated" });

    // 2. Validate session
    let user = await SessionData.findOne({ token });
    if (!user)
      return res.status(401).json({ message: "Not authenticated" });

    // 3. Get new names from request
    let { firstName, lastName } = req.body;
    if (!firstName && !lastName)
      return res.status(400).json({ message: "Change the first name or last name" });

    // 4. Get user data
    let userdata = await UserData.findOne({ username: user.username });
    if (!userdata)
      return res.status(404).json({ message: "User not found" });

    // 5. Update only provided fields
    if (firstName) userdata.firstName = firstName;
    if (lastName) userdata.lastName = lastName;

    // 6. Save updated user data
    await userdata.save();

    // 7. Respond success
    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating name", error: error.message });
  }
};

const EnableOtp = async (req, res) => {
  try {
    // 1. Check authentication
    let token = req.headers.token;
    if (!token)
      return res.status(401).json({ message: "Not authenticated" });

    // 2. Validate session
    let user = await SessionData.findOne({ token });
    if (!user)
      return res.status(401).json({ message: "Not authenticated user" });

    // 3. Find user data
    let userdata = await UserData.findOne({ username: user.username });
    if (!userdata)
      return res.status(404).json({ message: "User not found" });

    // 4. Get OTP enabled/disabled value from body
    let { otpEnabled } = req.body;
    if (otpEnabled === undefined)
      return res.status(400).json({ message: "otpEnabled field is required" });

    // 5. Update user OTP preference
    userdata.otpEnabled = otpEnabled;
    await userdata.save();

    // 6. Respond with updated otpEnabled value
    res.status(200).json({
      otpEnabled: userdata.otpEnabled,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { GetProfile, ChangePassword, ChangeLSName, EnableOtp }
