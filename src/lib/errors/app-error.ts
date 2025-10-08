export class AppError extends Error {
  code: string;
  message: string;
  statusCode: number;
  details?: unknown;

  constructor(
    code: string,
    message: string,
    statusCode: number = 400,
    details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.message = message;
    this.statusCode = statusCode;
    this.details = details;
  }
}
