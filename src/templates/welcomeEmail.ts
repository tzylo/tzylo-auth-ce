import { ENV } from "../config/env";
import { poweredByFooter } from "./footer";

export function welcomeEmailTemplate(email: string) {
  const appName = ENV.APP_NAME || "Tzylo";

  return {
    subject: `Welcome to ${appName}!`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Welcome to ${appName}</h2>
        <p>Hi ${email},</p>
        <p>We're excited to have you at <strong>${appName}</strong>. 
        You can now sign in and start using the application.</p>
        <br/>
        <p>— The ${appName} Team</p>

        ${poweredByFooter()}
      </div>
    `,
  };
}
