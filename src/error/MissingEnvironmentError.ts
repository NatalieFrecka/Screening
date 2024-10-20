export class MissingEnvironmentError extends Error {
  constructor(variableName: string) {
    super(`Missing environment variable ${variableName}`);
  }
}
