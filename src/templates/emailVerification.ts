import { ENV } from "../config/env";
import { poweredByFooter } from "./footer";

export function otpVerificationEmailTemplate(email: string, otp: string) {
  const appName = ENV.APP_NAME || "Tzylo";

  return {
    subject: `${appName} - Email Verification Code`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Your Verification Code</h2>
        <p>Hello ${email},</p>
        <p>Use the following verification code to verify your email with <strong>${appName}</strong>:</p>
        
        <h1 style="font-size: 32px; letter-spacing: 4px;">${otp}</h1>

        <p>This OTP is valid for <strong>5 minutes</strong>.</p>
        <br/>
        <p>If you did not request this, please ignore this email.</p>
        <p>— ${appName} Security Team</p>

        ${poweredByFooter()}
      </div>
    `,
  };
}
