export class TzyloDBError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TzyloDBError";
  }

  static fromPrisma(err: any): TzyloDBError {
    const migrationGuide = `
❌ TzyloDB schema is missing or incorrect.

Please run the migration for your database:

PostgreSQL:
  psql -h HOST -U USER -d DB -f migrations/postgres.sql

MySQL:
  mysql -u USER -p DB < migrations/mysql.sql

SQLite:
  (no manual migration needed – handled automatically)

SQLServer:
  sqlcmd -S SERVER -d DB -i migrations/sqlserver.sql

After applying the schema, restart the server.
`;

    // Attach original Prisma error for debugging (hidden in.ts output)
    const debugInfo = err?.message ? `\n\nDebug Info:\n${err.message}` : "";

    return new TzyloDBError(migrationGuide + debugInfo);
  }
}
