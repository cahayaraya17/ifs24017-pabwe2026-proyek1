/** Error yang aman ditampilkan ke klien beserta status HTTP-nya. */
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }

  static badRequest(message) {
    return new HttpError(400, message);
  }

  static unauthorized(message) {
    return new HttpError(401, message);
  }

  static forbidden(message) {
    return new HttpError(403, message);
  }

  static notFound(message) {
    return new HttpError(404, message);
  }

  static conflict(message) {
    return new HttpError(409, message);
  }
}
