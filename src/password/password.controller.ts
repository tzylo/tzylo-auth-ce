import { FastifyReply, FastifyRequest } from "fastify";
import { OtpService } from "../otp/otp.service";
import PasswordService from "./password.service";

class PasswordController {
  async forgotPassword(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { email } = req.body as { email?: string };

      if (!email) {
        return reply.status(400).send({
          success: false,
          message: "Email is required",
        });
      }

      const normalizedEmail = email.toLowerCase();

      await OtpService.generateOtp(normalizedEmail, "forgot-password");

      return reply.send({
        success: true,
        message: "Password reset OTP sent",
      });
    } catch (err: any) {
      return reply.status(400).send({
        success: false,
        message: err.message || "Failed to send password reset OTP",
      });
    }
  }

  async setNewPassword(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { email, otp, newPassword } = req.body as {
        email?: string;
        otp?: string;
        newPassword?: string;
      };

      if (!email || !otp || !newPassword) {
        return reply.status(400).send({
          success: false,
          message: "Email, OTP, and new password are required",
        });
      }

      const normalizedEmail = email.toLowerCase();

      const isValid = await OtpService.verifyOtp(
        normalizedEmail,
        otp,
        "forgot-password"
      );

      if (!isValid) {
        return reply.status(400).send({
          success: false,
          message: "Invalid or expired OTP",
        });
      }

      await PasswordService.setNewPassword(normalizedEmail, newPassword);

      return reply.send({
        success: true,
        message: "Password updated successfully",
      });
    } catch (err: any) {
      return reply.status(400).send({
        success: false,
        message: err.message || "Failed to update password",
      });
    }
  }
}

export default new PasswordController();
