# Contributing to Tzylo Auth CE

Thanks for your interest in contributing to **Tzylo Auth CE**!  
This project aims to provide a simple, clean, and developer-friendly authentication server.  
We welcome improvements, bug fixes, documentation enhancements, and general contributions from the community.

---

## 🧭 Project Philosophy

Tzylo Auth CE focuses on:

- **Simplicity** — easy to understand and modify  
- **Clarity** — minimal hidden logic  
- **Developer Experience** — setup should be smooth and consistent  
- **Quality** — PRs should improve stability and readability  

---

## 🛠️ How to Contribute

### 1. Fork the repository

```bash
git clone https://github.com/tzylo/tzylo-auth-ce
cd tzylo-auth-ce
````

---

### 2. Install dependencies

```bash
pnpm install
```

---

### 3. Environment Setup

Create a `.env` file:

```bash
cp env.example .env
```

At minimum:

```
JWT_SECRET=your-secret
```

If `DATABASE_URL` is not provided, the server uses SQLite by default.

---

### 4. Start the development server

```bash
pnpm dev
```

---

## 📌 Branching Guidelines

* Create branches off `main`
* Use meaningful names:

```
fix/login-error
refactor/email-service
docs/update-readme
feature/improve-otp-logic
```

---

## 🧪 Testing

Before making a pull request:

* Ensure the server runs on multiple DBs (SQLite + one SQL DB)
* Validate major routes: register, login, logout, OTP functions
* Add tests if applicable (or manual test steps)

Run tests (when added):

```bash
pnpm test
```

---

## 📥 Pull Request Guidelines

Please include:

### **1. Summary**

What the PR does.

### **2. Motivation**

Why this change is needed.

### **3. Changes**

List of modifications.

### **4. Testing**

How you tested the change.

Small, focused PRs are easier to review and merge.

---

## 🤝 Code of Conduct

Be respectful, constructive, and collaborative.
We aim to create a welcoming environment for developers of all skill levels.

---

## 💬 Questions?

Open an issue or start a discussion:
[https://github.com/tzylo/tzylo-auth-ce/issues](https://github.com/tzylo/tzylo-auth-ce/issues)

---

Thank you for contributing to Tzylo Auth CE!
Your improvements help make authentication easier for everyone.

```