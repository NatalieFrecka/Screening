export class InvalidFieldError extends Error {
  constructor(field: string) {
    const message = `Invalid field: ${field}`;
    super(message);
  }
}
