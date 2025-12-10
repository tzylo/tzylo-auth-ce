import { ENV } from "../config/env";
import { poweredByFooter } from "./footer";

export function forgotPasswordEmailTemplate(email: string, otp: string) {
  const appName = ENV.APP_NAME || "Tzylo";

  return {
    subject: `${appName} - Reset Your Password`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Password Reset Request</h2>
        <p>Hello ${email},</p>
        <p>We received a request to reset your password for <strong>${appName}</strong>.</p>

        <p>Use the OTP below to proceed:</p>
        <h1 style="font-size: 32px; letter-spacing: 4px;">${otp}</h1>

        <p>This OTP will expire in <strong>5 minutes</strong>.</p>
        <br/>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>— ${appName} Support Team</p>


        ${poweredByFooter()}
      </div>
    `,
  };
}
