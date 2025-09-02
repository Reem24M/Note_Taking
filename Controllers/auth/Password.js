const { UserData } = require("../../Models/UserSchema")

const crypto = require('crypto')

const ForgetPassword = async (req, res) => {
    let { email } = req.body
    if (!email)
        return res.status(400).send("email required")
    let user = await UserData.findOne({ email })
    if (!user)
        return res.status(400).send("user not found")
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 5 * 60 * 1000;
    await UserData.findOneAndUpdate(
        { email: email },
        {
            passwordResetToken: resetToken,
            passwordResetTokenExpiry: expiry
        },
        { new: true }
    );

    return res.status(200).json({ message: "Password reset token sent successfully", user })
}
const ResetPassword = async (req, res) => {
    let { passwordResetToken } = req.query
    let { newPassword, confirmPassword } = req.body
    if (!passwordResetToken)
        return res.status(400).send("Password reset token required")
    if (!newPassword || !confirmPassword)
        return res.status(400).send("New password and confirm password are required")
    let user = await UserData.findOne({ passwordResetToken })
    if (!user)
        return res.status(400).send("user not found")
    if (newPassword !== confirmPassword)
        return res.status(400).send("Passwords do not match")
    if (user.passwordResetTokenExpiry < Date.now())
        return res.status(400).send("Password reset token expired")
    await UserData.findOneAndUpdate(
        { email: user.email },
        {
            password: newPassword,
            passwordResetToken: null,
            passwordResetTokenExpiry: null
        },
        { new: true }
    );
    return res.status(200).send("Password reset successfully")
}
module.exports = { ForgetPassword, ResetPassword }