const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const bcrypt = require("bcrypt")
const crypto = require("crypto")

exports.resetPasswordToken = async (req, res) => {
  try {
    const email = req.body.email
    console.log("Incoming reset password request for: ", email);

    const user = await User.findOne({ email: email })
    if (!user) {
      console.log("User not found for email: ", email);
      return res.json({
        success: false,
        message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
      })
    }
    const token = crypto.randomBytes(20).toString("hex")

    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 3600000,
      },
      { new: true }
    )
    console.log("Reset token genereated for: ", updatedDetails.email);
    console.log("Token: ", token);
    console.log("DETAILS", updatedDetails)

    // const url = `http://localhost:4000/update-password/${token}`
    const url = `https://techtrends-edtech-project.vercel.app/update-password/${token}`

    
    // Send reset email
    const emailResponse = await mailSender(
      email,
      "Password Reset Request",
      `
        <h2>Password Reset Request</h2>
        <p>Hi ${user.firstName || "User"},</p>
        <p>Click the link below to reset your password:</p>
        <a href="${url}" target="_blank" 
          style="display:inline-block;background:#FFD60A;color:#000;padding:10px 20px;text-decoration:none;border-radius:6px;font-weight:600;">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
        <br/>
        <p>Regards,<br/>TechTrends Learning Team</p>
      `
    );

    console.log("📧 Email sent:", emailResponse);

    // New Update -> Handle possible resend error shape
    if (emailResponse.error || emailResponse.name == "AxiosError") {
      console.error("Resend email error: ", emailResponse);
      return res.status(500).json({
        success: false,
        message: "Failed to send reset email. Please try again.",
      });
    }


    return res.status(200).json({
      success: true,
      message:
        "Email sent successfully. Please check your inbox to continue resetting your password.",
    });
  } catch (error) {
    return res.json({
      error: error.message,
      success: false,
      message: `Some Error in Sending the Reset Message`,
    })
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body

        // validate input
    if (!password || !confirmPassword || !token) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (confirmPassword !== password) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password Does not Match",
      });
    }


    const userDetails = await User.findOne({ token: token })
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "Token is Invalid",
      });
    }

    if (!(userDetails.resetPasswordExpires > Date.now())) {
      return res.status(403).json({
        success: false,
        message: `Token is Expired, Please Regenerate Your Token`,
      });
    }
    // const encryptedPassword = await bcrypt.hash(password, 10)
    // await User.findOneAndUpdate(
    //   { token: token },
    //   { password: encryptedPassword },
    //   { new: true }
    // )

    // New Update
    // Hash and update password
    const encryptedPassword = await bcrypt.hash(password, 10);
    userDetails.password = encryptedPassword;
    userDetails.token = undefined;
    userDetails.resetPasswordExpires = undefined;
    await userDetails.save();
    
    res.json({
      success: true,
      message: "Password reset successful.",
    });
  } catch (error) {
    return res.json({
      error: error.message,
      success: false,
      message: `Some Error in Updating the Password`,
    })
  }
}
