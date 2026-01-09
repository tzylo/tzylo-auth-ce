# Tzylo Auth CE  
Simple, lightweight, and easy-to-understand authentication server.

Tzylo Auth CE is an open-source authentication service built with **Node.js**, **TypeScript**, and **Fastify**.  
It focuses on **clarity**, **developer experience**, and **minimal configuration**—ideal for small apps, prototypes, and teams that want plug-and-play auth without heavy infra.

---

## 🔗 Important Links

📘 **Documentation**
👉 [https://docs.tzylo.com/auth/ce/docs/introduction](https://docs.tzylo.com/auth/ce/docs/introduction)

🐳 **Docker Image**
👉 [https://hub.docker.com/r/tzylo/auth-ce](https://hub.docker.com/r/tzylo/auth-ce)

💻 **GitHub Repository**
👉 [https://github.com/tzylo/tzylo-auth-ce](https://github.com/tzylo/tzylo-auth-ce)

📦 **Node.js SDK**
👉 [https://www.npmjs.com/package/@tzylo/auth-ce](https://www.npmjs.com/package/@tzylo/auth-ce)

🧩 **Middleware Package**
👉 [https://www.npmjs.com/package/@tzylo/auth-middleware](https://www.npmjs.com/package/@tzylo/auth-middleware)

🧪 **Example Projects**
👉 [https://github.com/tzylo/auth-ce-examples](https://github.com/tzylo/auth-ce-examples)

---

## 🚀 Features

### **🔐 Multi-Database Support**
Works with multiple SQL databases out of the box:
- PostgreSQL  
- MySQL  
- SQL Server  
- SQLite

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
Only **two required config**:

```

JWT_SECRET=your-secret
DATABASE_URL=postgres://user:pass@localhost:5432/authdb

````

Everything else falls back to clean defaults.

---

## 🛠️ Tech Stack

- **Node.js + TypeScript**
- **Fastify** (high-performance HTTP server)
- **Prisma**
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

  if (res.data?.accessToken) {
    console.log(res.data.accessToken);
    setAccessToken(res.data.accessToken);
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

---

## ⚙️ Environment Variables

Below is the complete list of environment variables supported by **Tzylo Auth CE**.

| Variable                     | Required | Default          | Description                                                                            |
| ---------------------------- | -------- | ---------------- | -------------------------------------------------------------------------------------- |
| **JWT_SECRET**               | **Yes**  | —                | Secret key used to sign JWT access tokens.                                             |
| **DATABASE_URL**             | **Yes**  | —                | Database connection string (`postgresql://`, `mysql://`, `sqlserver://`, `sqlite://`). |
| **CORS_ORIGIN**              | No       | `*`              | Allowed CORS origins.                                                                  |
| **NODE_ENV**                 | No       | `development`    | Application environment mode.                                                          |
| **RATE_LIMIT**               | No       | `true`           | Enables built-in rate limiting middleware.                                             |
| **RATE_LIMIT_ENABLED**       | No       | `true`           | Additional toggle for rate limiting.                                                   |
| **ACCESS_TOKEN_EXPIRES_IN**  | No       | `15m`            | Access token lifetime (`ms`, `m`, `h`, `d` supported).                                 |
| **REFRESH_TOKEN_EXPIRES_IN** | No       | `7d`             | Refresh token lifetime.                                                                |
| **BCRYPT_SALT_ROUNDS**       | No       | `10`             | Salt rounds used for password hashing.                                                 |
| **SMTP_HOST**                | No       | `smtp.gmail.com` | SMTP host for sending OTP emails.                                                      |
| **SMTP_PORT**                | No       | `587`            | SMTP port.                                                                             |
| **SMTP_USER**                | No       | —                | SMTP login username.                                                                   |
| **SMTP_PASS**                | No       | —                | SMTP login password.                                                                   |
| **REDIS_URL**                | No       | —                | Redis connection URL (optional; in-memory fallback used if empty).                     |
| **REDIS_MAX_RETRIES**        | No       | `1`              | Maximum retry attempts for Redis connection.                                           |
| **APP_NAME**                 | No       | `Tzylo`          | Application name used in emails and metadata.                                          |
| **COOKIE_SECRET**            | No       | —                | Cookie signing secret (for session-based flows).                                       |
| **COOKIE_SAME_SITE**         | No       | —                | Cookie SameSite policy (`Lax`, `Strict`, `None`).                                      |

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
* `POST /refresh`
* `GET /health/db`

Designed to be easy to understand and extend.

## 🚀 Running with Docker

This repository includes a `Dockerfile` and `docker-compose.yml` for easy local setup.

### Build Image

From the project root:

```bash
docker build -t tzylo-auth-ce:v1.1.0 .
```

---

### Start Services

Run using Docker Compose:

```bash
docker compose up -d
```

View logs:

```bash
docker compose logs -f
```

Stop services:

```bash
docker compose down
```

---

### Rebuild After Changes

If you modify the code:

```bash
docker compose build
docker compose up -d
```

---

### Environment Configuration

Create a `.env` file with required environment variables before starting.

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


## 🤝 Contributing

This is an early version — contributions are welcome!
Feel free to open issues or PRs.

---

Made with ❤️ by **Tzylo**

```