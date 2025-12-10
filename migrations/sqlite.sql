CREATE TABLE IF NOT EXISTS auth (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    is_verified INTEGER DEFAULT 0,
    provider TEXT DEFAULT 'local',
    role TEXT,
    refresh_token TEXT,
    last_login_at TEXT,
    metadata TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
