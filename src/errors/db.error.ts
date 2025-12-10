export class TzyloDBError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "TzyloDBError";
    this.code = code;
  }
}

export class TzyloDBInitializationError extends TzyloDBError {
  constructor(message: string) {
    super(message, "DB_INIT_ERROR");
    this.name = "TzyloDBInitializationError";
  }
}

export class TzyloDBQueryError extends TzyloDBError {
  constructor(message: string) {
    super(message, "DB_QUERY_ERROR");
    this.name = "TzyloDBQueryError";
  }
}
