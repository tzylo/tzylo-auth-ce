import request from "supertest";

console.log("App is:", global.app);

describe("POST /register - integration", () => {
  it("should register a new user", async () => {
    const res = await request(global.app.server)
      .post("/register")
      .send({ email: "test@example.com", password: "123456" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("should not allow duplicate emails", async () => {
    await request(global.app.server)
      .post("/register")
      .send({ email: "test2@example.com", password: "123456" });

    const res = await request(global.app.server)
      .post("/register")
      .send({ email: "test2@example.com", password: "123456" });

    expect(res.status).toBe(400);
  });
});
