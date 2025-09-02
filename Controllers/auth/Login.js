const { SessionData } = require("../../Models/SessionSchema")
const { UserData } = require("../../Models/UserSchema")
const bcrypt = require('bcrypt')
const crypto = require('crypto');


const LoginStart = async (req, res) => {
    let { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({ error: 'Missing username or password' })
    }
    let user = await UserData.findOne({ username })
    if (!user) {
        return res.status(401).json({ error: 'user not found' })
    }
    let isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.status(400).json({ error: 'wrong password' })
    }
    if (user.otp !== null)
        return res.status(400).send("User already logged in")
    const accessToken = crypto.randomBytes(32).toString("hex");

    const newSession = new SessionData({
        username: user.username,
        token: accessToken,
        role: user.role
    });
    await newSession.save();

    let newopt = Math.floor(100000 + Math.random() * 900000);
    const newuser = await UserData.findOneAndUpdate(
        { username },
        {
            otp: newopt,
            otpExpiry: new Date(Date.now() + 10 * 60 * 1000)
        },
        { new: true }
    )

    return res.status(200).json({ message: 'OTP sent successfully', newuser })
}
const LoginVerify = async (req, res) => {
    try {
        let { username, otpCode } = req.body
        if (!username || !otpCode)
            return res.status(400).send("Missing username or OTP code")

        let user = await UserData.findOne({ username })
        if (!user) {
            return res.status(404).send("User not found")
        }

        if (!user.otp || !user.otpExpiry) {
            return res.status(401).send("No active OTP")
        }

        // check expiry before verifying code
        if (user.otpExpiry < new Date()) {
            user.otp = null
            user.otpExpiry = null
            await user.save()
            return res.status(401).send("OTP code expired")
        }

        otpCode = otpCode.toString().trim()
        if (user.otp.toString() !== otpCode) {
            return res.status(401).send("Invalid OTP code")
        }

        // success → reset otp
        user.otp = null
        user.otpExpiry = null
        await user.save()

        let sessionuser = await SessionData.findOne({ username })
        return res.status(200).json({ message: "Login successful", user, sessionuser })
    } catch (err) {
        console.error(err)
        return res.status(500).send("Server error")
    }
}

module.exports = { LoginStart, LoginVerify }
