import { initMailer, OTP_ENABLED } from "../../src/config/mailer.js";

describe("Mailer Config", () => {
  it("should disable mailer when SMTP not configured", async () => {
    process.env.SMTP_HOST = "";
    const mailer = await initMailer();
    expect(mailer).toBeNull();
    expect(OTP_ENABLED).toBe(false);
  });
});
