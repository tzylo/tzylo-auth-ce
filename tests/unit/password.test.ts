import { hashPassword, verifyPassword } from "../../src/utils/password";

describe("Password Utils", () => {
  it("should hash and verify password", async () => {
    const raw = "mypassword";
    const hashed = await hashPassword(raw);

    expect(hashed).not.toBe(raw);

    const valid = await verifyPassword(raw, hashed);
    expect(valid).toBe(true);
  });

  it("should fail verification for wrong password", async () => {
    const hashed = await hashPassword("correct123");
    const valid = await verifyPassword("wrong", hashed);

    expect(valid).toBe(false);
  });
});
