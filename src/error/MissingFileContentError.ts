export class MissingFileContentError extends Error {
  constructor() {
    super('Response body was empty');
  }
}
