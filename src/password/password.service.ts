import { db } from "../db/db";
import { hashPassword } from "../utils/password";

class PasswordService {
  async setNewPassword(email: string, newPassword: string) {
    const user = await db.auth.findUnique({ where: { email } });

    if (!user) throw new Error("Account not found");

    const hashed = await hashPassword(newPassword);

    await db.auth.update({
      where: { email },
      data: { password: hashed },
    });

    return true;
  }
}

export default new PasswordService();
