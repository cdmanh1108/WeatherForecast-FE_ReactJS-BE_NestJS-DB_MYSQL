export class ApiResponse<T> {
  statusCode: number;
  message: string;
  result: T;
  errorCode?: number;

  constructor(
    statusCode: number,
    message: string,
    result: T,
    errorCode?: number
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.result = result;
    this.errorCode = errorCode;
  }

  static success<T>(result: T, message = 'Success', statusCode = 200) {
    return new ApiResponse<T>(statusCode, message, result);
  }

  static error(message: string, statusCode: number, errorCode?: number) {
    return new ApiResponse<null>(statusCode, message, null, errorCode);
  }
}
