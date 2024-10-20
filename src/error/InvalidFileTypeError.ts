export class InvalidFileTypeError extends Error {
  constructor(expectedFileType: string) {
    super(`Invalid file type. Expected ${expectedFileType}`);
  }
}
