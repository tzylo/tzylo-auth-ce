export class TzyloError extends Error {
  code: string;
  status: number;

  constructor(message: string, code = "UNKNOWN_ERROR", status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}
