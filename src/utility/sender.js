import SendEmail from "../mailer/mailer.js";
import errorResponse from "./error.js";
import axios from "axios";

export async function signupEmail(email, otp) {
  try {
    const response = await SendEmail(
      email,
      "Account Signup",
      `Hi ${email}, You just signed up`,
      `<body>
         <p>Email: ${email}</p>
         <p>Your OTP is ${otp}. </p>
         <p> Please use this OTP to verify your account.</p>
       </body>`
    );
    console.log(response);
    return { message: "Signup successful, email sent" };
  } catch (error) {
    console.error("Email sending error:", error);
    return next(errorResponse(500, "Failed to send email"));
  }
}

// Function to send OTP email
export async function resetPasswordOtpEmail(email, otp) {
  try {
    const response = await SendEmail(
      email,
      "Password Reset OTP",
      `Hi ${email}, You requested a password reset.`,
      `<body>
                <p>Email: ${email}</p>
                <p>Your OTP for resetting your password is ${otp}. </p>
                <p>Please use this OTP to reset your password.</p>
             </body>`
    );
    console.log(response);
    return { message: "OTP sent successfully" };
  } catch (error) {
    console.error("Email sending error:", error);
    return next(errorResponse(500, "Failed to send OTP email"));
  }
}
