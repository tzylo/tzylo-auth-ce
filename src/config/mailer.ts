import nodemailer, { Transporter } from "nodemailer";
import { ENV } from "./env";

let transporter: Transporter | null = null;
export let OTP_ENABLED = false;

export const initMailer = async (): Promise<Transporter | null> => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = ENV;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.log("📭 Mailer disabled — SMTP not configured.");
    OTP_ENABLED = false;
    transporter = null;
    return null;
  }

  try {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      pool: true,
      maxConnections: 1,
      maxMessages: 50,
    });

    await transporter.verify();
    console.log("✅ SMTP Mailer connected and verified");
    OTP_ENABLED = true;

    return transporter;
  } catch (err: any) {
    console.error("❌ Failed to initialize mailer:", err?.message || err);
    transporter = null;
    OTP_ENABLED = false;
    return null;
  }
};

export { transporter };
