import nodemailer from "nodemailer";
import ApiResponse from "../utils/ApiResponse.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "service.carelinnk@gmail.com",
    pass: "lparzmbxwydnoari",
  },
});

const sendOtpEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"Care-Linnk" <service.carelinnk@gmail.com>`,
      to: email,
      subject: "Your Care-Linnk Verification Code",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;background-color:#f8f9fa;line-height:1.6">
  <div style="min-width:100%;max-width:600px;margin:0 auto;background-color:#ffffff">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#006E58 0%,#004d3d 100%);padding:40px 20px;text-align:center">
      <h1 style="margin:0;font-size:28px;color:#ffffff;font-weight:600;letter-spacing:-0.5px">Care-Linnk</h1>
      <p style="margin:8px 0 0;color:#b8e6d2;font-size:16px">Welcome aboard!</p>
    </div>
    
    <!-- Content -->
    <div style="padding:50px 40px 40px;text-align:center">
      <h2 style="margin:0 0 20px;font-size:24px;color:#1a1a1a;font-weight:500">Your Verification Code</h2>
      <p style="margin:0 0 30px;font-size:16px;color:#555">Use this one-time code to verify your email address.</p>
      
      <!-- OTP Box -->
      <div style="background:#f8f9fa;border:3px solid #e9ecef;border-radius:12px;padding:30px 20px;margin:0 auto 30px;max-width:220px;box-shadow:0 8px 25px rgba(0,110,88,0.1)">
        <div style="background:#ffffff;border:2px solid #006E58;border-radius:8px;padding:20px;font-size:32px;font-weight:700;letter-spacing:8px;color:#006E58;text-align:center;font-family:monospace"> ${otp} </div>
      </div>
      
      <p style="margin:0 0 10px;font-size:14px;color:#666">Didn't request this code? <a href="#" style="color:#006E58;text-decoration:none;font-weight:500">Contact support</a></p>
      <p style="margin:0;font-size:13px;color:#999">This is an automated message. Please don't reply.</p>
    </div>
    
    <!-- Footer -->
    <div style="background:#f8f9fa;border-top:1px solid #e9ecef;padding:30px 40px;text-align:center">
      <p style="margin:0 0 15px;font-size:14px;color:#666">Care-Linnk – Connecting healthcare & education</p>
      <p style="margin:0;font-size:12px;color:#999">&copy; 2025 Care-Linnk. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
      `,
    });
  } catch (error) {
    throw new ApiResponse(500, null, "Failed to send OTP email");
  }
};


const sendVerificationEmail = async (email, token) => {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

    await transporter.sendMail({
      from: `"Your App" <service.carelinnk@gmail.com>`,
      to: email,
      subject: "Verify Your Email",
      html: `
                <p>Please click the link below to verify your email:</p>
                <a href="${verificationUrl}">Verify Email</a>
                <p>Or copy this link: ${verificationUrl}</p>
            `,
    });
  } catch (error) {
    throw new ApiResponse(500, null, "Failed to send verification email");
  }
};

export { sendOtpEmail, sendVerificationEmail };
