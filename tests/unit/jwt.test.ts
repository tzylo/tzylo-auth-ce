import { signAccessToken, verifyToken } from "../../src/utils/jwt";

describe("JWT Utils", () => {
  it("should sign and verify access token", () => {
    const token = signAccessToken("123", "test@example.com");
    const decoded = verifyToken(token);

    if (typeof decoded === "string") {
      throw new Error("verifyToken returned string instead of decoded object");
    }

    expect(decoded?.userId).toBe("123");
    expect(decoded?.email).toBe("test@example.com");
  });

  it("should throw for tampered token", () => {
    const token = signAccessToken("1", "a@b.com");

    expect(() => verifyToken(token + "xyz")).toThrow();

  });
});
