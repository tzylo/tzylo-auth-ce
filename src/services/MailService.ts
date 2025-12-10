import { transporter } from "../config/mailer";

export class MailService {
  static async sendMail(to: string, subject: string, html: string) {
    if (!transporter) {
      console.log("📭 Mailer disabled — email logged only:");
      console.log("To:", to);
      console.log("Subject:", subject);
      console.log("HTML:", html);
      return;
    }

    try {
      await transporter.sendMail({
        to,
        subject,
        html,
      });
    } catch (err: any) {
      console.error("❌ Failed to send email:", err?.message || err);
    }
  }
}
