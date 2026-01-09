import { FastifyReply, FastifyRequest } from "fastify";
import '@fastify/cookie';
import authService from "./auth.service";
import { registerSchema, loginSchema } from "./auth.schema";
import { getCookieOptions } from "../utils/cookie";
import { OtpService } from "../otp/otp.service"

export class AuthController {
  async register(req: FastifyRequest, reply: FastifyReply) {
    const data = registerSchema.parse(req.body);

    const result = await authService.register(data.email, data.password);

    reply.setCookie(
      "refresh_token",
      result.refreshToken,
      getCookieOptions()
    );

    return reply.code(201).send({
        user: {
          id: result.user.id,
          email: result.user.email,
          isVerified: result.user.isVerified,
          role: result.user.role
        },
        accessToken: result.accessToken,
      });
  }

  async login(req: FastifyRequest, reply: FastifyReply) {
    const data = loginSchema.parse(req.body);

    const result = await authService.login(data.email, data.password);

    reply.setCookie(
      "refresh_token",
      result.refreshToken,
      getCookieOptions()
    );

    return reply.send({
        user: {
          id: result.user.id,
          email: result.user.email,
          isVerified: result.user.isVerified,
          role: result.user.role
        },
        accessToken: result.accessToken,
    });
  }

  async verifyEmail(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { email, otp } = req.body as { email?: string; otp?: string };

      if (!email || !otp) {
        return reply.status(400).send({
          success: false,
          message: "Email and OTP are required",
        });
      }

      const normalizedEmail = email.toLowerCase();
      const isValid = await OtpService.verifyOtp(normalizedEmail, otp);

      if (!isValid) {
        return reply.status(400).send({
          success: false,
          message: "Invalid or expired OTP",
        });
      }

      const result = await authService.verifyEmail(normalizedEmail);

      return reply.send({
        user : {
          id: result.user.id,
          email: result.user.email,
          isVerified: result.user.isVerified,
          role: result.user.role
        }
      });
    } catch (err: any) {
      console.error("Verify Email Error:", err.message);

      return reply.status(400).send({
        success: false,
        message: err.message || "Email verification failed",
      });
    }
  }
}

export default new AuthController();
