const { SessionData } = require("../../Models/SessionSchema")
const { UserData } = require("../../Models/UserSchema")
const bcrypt=require('bcrypt')


const GetProfile=async(req,res)=>{
    // check authentication
    let token = req.headers.token
    if (!token)
        return res.status(200).send("Not authenticated")
    // find token in session schema
    let user = await SessionData.findOne({ token })
    if (!user)
        return res.status(200).send("Not authenticated")
    let data=await UserData.findOne({username:user.username})
    if (!data)
        return res.status(200).send("User not found")
    res.status(200).send(data)
}
const ChangePassword = async (req, res) => {
  try {
    let token = req.headers.token;
    if (!token)
      return res.status(401).json({ message: "Not authenticated" });

    let user = await SessionData.findOne({ token });
    if (!user)
      return res.status(401).json({ message: "Not authenticated" });

    let { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword)
      return res.status(400).json({ message: "All fields are required" });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    let userdata = await UserData.findOne({ username: user.username });
    if (!userdata)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, userdata.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    userdata.password = hashedPassword;
    await userdata.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const ChangeLSName = async (req, res) => {
  try {
    // check authentication
    let token = req.headers.token;
    if (!token)
      return res.status(401).json({ message: "Not authenticated" });

    let user = await SessionData.findOne({ token });
    if (!user)
      return res.status(401).json({ message: "Not authenticated" });

    let { firstName, lastName } = req.body;
    if (!firstName && !lastName)
      return res.status(400).json({ message: "Change the first name or last name" });

    let userdata = await UserData.findOne({ username: user.username });
    if (!userdata)
      return res.status(404).json({ message: "User not found" });

    if (firstName) userdata.firstName = firstName;
    if (lastName) userdata.lastName = lastName;

    await userdata.save();

    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating name", error: error.message });
  }
};

const EnableOtp = async (req, res) => {
  try {
    // check authentication
    let token = req.headers.token;
    if (!token)
      return res.status(401).json({ message: "Not authenticated" });

    let user = await SessionData.findOne({ token });
    if (!user)
      return res.status(401).json({ message: "Not authenticated user" });

    let userdata = await UserData.findOne({ username: user.username });
    if (!userdata)
      return res.status(404).json({ message: "User not found" });

    let { otpEnabled } = req.body;
    if (otpEnabled === undefined)
      return res.status(400).json({ message: "otpEnabled field is required" });

    userdata.otpEnabled = otpEnabled;
    await userdata.save();

    res.status(200).json({
      otpEnabled: userdata.otpEnabled,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports={GetProfile,ChangePassword,ChangeLSName,EnableOtp}