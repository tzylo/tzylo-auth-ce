import { FastifyReply, FastifyRequest } from "fastify";
import { OtpService } from "./otp.service";

class OtpController {
  async sendOtp(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { email } = req.body as { email?: string };

      if (!email) {
        return reply.status(400).send({
          success: false,
          message: "Email is required",
        });
      }

      const normalizedEmail = email.toLowerCase();
      await OtpService.generateOtp(normalizedEmail);

      return reply.send({
        success: true,
        message: "OTP sent successfully",
      });
    } catch (err: any) {
      console.error("Send OTP Error:", err.message);

      return reply.status(400).send({
        success: false,
        message: err.message || "Failed to send OTP",
      });
    }
  }

}

export default new OtpController();
