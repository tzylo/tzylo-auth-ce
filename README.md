# Tzylo Auth CE  
Simple, lightweight, and easy-to-understand authentication server.

Tzylo Auth CE is an open-source authentication service built with **Node.js**, **TypeScript**, and **Fastify**.  
It focuses on **clarity**, **developer experience**, and **minimal configuration**—ideal for small apps, prototypes, and teams that want plug-and-play auth without heavy infra.

---

## 🚀 Features

### **🔐 Multi-Database Support**
Works with multiple SQL databases out of the box:
- PostgreSQL  
- MySQL  
- SQL Server  
- **SQLite (fallback automatically when no DATABASE_URL is provided)**

### **📧 Email (OTP) Support**
- Integrated with **Nodemailer**
- No queues required — simple, direct email delivery
- OTP flows for login, forgot password, and account verification

### **🧠 Caching Layer**
- Redis (recommended for production)
- In-memory fallback available for local/dev use

### **🔑 Token Lifecycle**
- Access tokens (JWT)
- Refresh tokens
- Secure storage & validation
- Auto token invalidation on logout
- Configurable expiry times

### **🛡️ Built-in Rate Limiting**
Protects against brute force & abuse.

### **⚙️ Minimal Configuration Required**
Only **one required config**:

```

JWT_SECRET=your-secret

````

Everything else falls back to clean defaults.

---

## 🛠️ Tech Stack

- **Node.js + TypeScript**
- **Fastify** (high-performance HTTP server)
- **Drizzle ORM / Prisma (your internal choice)**
- **SQLite / Postgres / MySQL / SQL Server**
- **Nodemailer**
- **Redis (optional, recommended)**

---

## 📦 Client Usage (JS/TS SDK)

```ts
import { api, setAccessToken } from "./client";

// REGISTER
export const register = async (email: string, password: string) => {
  return api.post("/register", { email, password });
};

// LOGIN
export const login = async (email: string, password: string) => {
  const res = await api.post("/login", { email, password });

  if (res.data?.data?.accessToken) {
    console.log(res.data.data.accessToken);
    setAccessToken(res.data.data.accessToken);
  }

  return res;
};

// LOGOUT
export const logout = async () => {
  await api.post("/logout");
  setAccessToken(null);
};

// PROFILE (Protected)
export const getProfile = async () => {
  return api.get("/me");
};

// OTP: SEND
export const sendOtp = async (email: string) => {
  return api.post("/send-otp", { email });
};

// OTP: VERIFY
export const verifyOtp = async (email: string, otp: string) => {
  return api.post("/verify-otp", { email, otp });
};

// FORGOT PASSWORD: SEND OTP
export const sendForgotPasswordOtp = async (email: string) => {
  return api.post("/forgot-password", { email });
};

// RESET PASSWORD
export const resetPassword = async (email: string, otp: string, newPassword: string) => {
  return api.post("/set-new-password", {
    email,
    newPassword,
    otp,
  });
};
````

---

## 🏁 Quick Start (Local)

```bash
pnpm install
pnpm dev
```

If no `DATABASE_URL` is provided, **SQLite is used automatically**.

---

## ⚙️ Environment Variables

| Variable                                | Required | Description                           |
| --------------------------------------- | -------- | ------------------------------------- |
| `JWT_SECRET`                            | **Yes**  | Used to sign access tokens            |
| `DATABASE_URL`                          | No       | If missing → SQLite fallback          |
| `REDIS_URL`                             | No       | Used for caching (in-memory fallback) |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` | No       | Email service for OTP                 |

---

## 🧪 API Routes (Built-in)

* `POST /register`
* `POST /login`
* `POST /logout`
* `GET /me` (Protected)
* `POST /send-otp`
* `POST /verify-otp`
* `POST /forgot-password`
* `POST /set-new-password`

Designed to be easy to understand and extend.

---

## 📝 Philosophy

Tzylo Auth CE is built with one goal:

> **Make authentication simple and readable.
> No magic. No heavy frameworks. Just clean, modern auth.**

This first version focuses on:

* clarity,
* portability,
* minimal configuration,
* and supporting multiple databases with graceful fallbacks.

---

## 📄 License

MIT — free to use and modify.

---

## 🌱 Roadmap

* Improve TypeScript SDK
* Add more providers (OAuth / Passwordless)
* Add optional queues for async email
* Enhance admin dashboard
* Add production-grade metrics

---

## 🤝 Contributing

This is an early version — contributions are welcome!
Feel free to open issues or PRs.

---

Made with ❤️ by **Tzylo**

```