
# 📘 **Tzylo DB Migration Files**

This repository contains the **one-time SQL migration files** required to initialize the database for **Tzylo Auth CE**.

Tzylo Auth CE does **not** run migrations automatically.
You must run the migration **once** before starting the server.

---

# 🗄️ Supported Databases

This repo includes migration files for:

* **PostgreSQL** → `postgres.sql`
* **MySQL** → `mysql.sql`
* **SQLite** → `sqlite.sql`
* **SQL Server** → `sqlserver.sql`

Each file creates the required `auth` table and default schema used by Tzylo Auth CE.

---

# 🚀 1. Clone This Repository

```bash
git clone https://github.com/tzylo/db-migration-files.git
cd db-migration-files
```

---

# 🟦 2. PostgreSQL Migration

## ✔ If PostgreSQL is installed locally:

```bash
psql -h localhost -U <user> -d <database> -f postgres.sql
```

Example:

```bash
psql -h localhost -U root -d tzylo -f postgres.sql
```

---

## ✔ If PostgreSQL is running in Docker:

1. Find the container:

```bash
docker ps
```

2. Apply the migration:

```bash
docker exec -i <container_name> psql -U <user> -d <database> < postgres.sql
```

Example:

```bash
docker exec -i my_postgres psql -U root -d tzylo < postgres.sql
```

🔥 This works even if:

* ports aren’t exposed
* container uses a custom network
* you don’t have `psql` installed locally

---

# 🟧 3. MySQL Migration

## ✔ Local MySQL:

```bash
mysql -u <user> -p <database> < mysql.sql
```

Example:

```bash
mysql -u root -p tzylo < mysql.sql
```

---

## ✔ Docker MySQL:

```bash
docker exec -i <container_name> mysql -u <user> -p<password> <database> < mysql.sql
```

Example:

```bash
docker exec -i my_mysql mysql -u root -proot tzylo < mysql.sql
```

---

# 🟩 4. SQLite Migration

SQLite does not require a server.

If you want to create the DB manually:

```bash
sqlite3 auth.db < sqlite.sql
```

Otherwise, Tzylo Auth CE will generate the SQLite database automatically when started.

---

# 🟥 5. SQL Server Migration

## ✔ Local (sqlcmd installed):

```bash
sqlcmd -S localhost -d <database> -i sqlserver.sql
```

---

## ✔ Docker SQL Server:

```bash
docker exec -i <container_name> /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U SA -P "<password>" -d <database> -i sqlserver.sql
```

---

# ⚠️ Important Notes

* These migrations must be run **only once**.
* If the `auth` table already exists, running them again may cause errors.
* After successful migration, restart **Tzylo Auth CE**.

---

# ✔ After Migration

Go back to your Tzylo Auth CE project and run:

```bash
npm run dev
```

If the database is correctly migrated, the server will start successfully.

---

# 📁 Folder Structure

```
tzylo-db-migration-files/
│
├── postgres.sql
├── mysql.sql
├── sqlite.sql
└── sqlserver.sql
```

---

# 🎉 You're Done!

Your database is now ready to be used with **Tzylo Auth CE**.