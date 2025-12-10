import { OtpService } from "../../src/otp/otp.service";
import { isRedisAvailable } from "../../src/config/redis";

jest.mock("../../src/config/redis", () => ({
  isRedisAvailable: jest.fn(() => false),
}));

describe("OtpService - Local (No Redis)", () => {
  it("should generate OTP", async () => {
    const otp = await OtpService.generateOtp("test@example.com");

    expect(otp).toHaveLength(6);
  });

  it("should verify OTP correctly", async () => {
    const email = "user@example.com";
    const otp = await OtpService.generateOtp(email);

    const valid = await OtpService.verifyOtp(email, otp);
    expect(valid).toBe(true);
  });

  it("should reject invalid OTP", async () => {
    const valid = await OtpService.verifyOtp("x@y.com", "999999");
    expect(valid).toBe(false);
  });
});
