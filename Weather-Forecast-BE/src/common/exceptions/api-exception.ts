import { HttpException, HttpStatus } from '@nestjs/common';

export interface ErrorResponse {
  statusCode: number;
  message: string;
  result: null;
  errorCode?: number;
}

export class ApiException extends HttpException {
  errorCode?: number;

  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    errorCode?: number
  ) {
    super(
      {
        statusCode,
        message,
        result: null,
        errorCode,
      },
      statusCode
    );
    this.errorCode = errorCode;
  }
}

// Common error codes
export const ERROR_CODES = {
  // Auth errors
  INVALID_USERNAME: 1000,
  INVALID_PASSWORD: 1001,
  UNAUTHORIZED: 1002,
  TOKEN_EXPIRED: 1003,
  TOKEN_INVALID: 1004,

  // User errors
  USER_ALREADY_EXISTS: 2000,
  USER_NOT_FOUND: 2001,
  INVALID_EMAIL: 2002,
  PASSWORD_TOO_SHORT: 2003,

  // City/Country errors
  CITY_NOT_FOUND: 3000,
  COUNTRY_NOT_FOUND: 3001,

  // Weather errors
  WEATHER_DATA_NOT_FOUND: 4000,

  // Validation errors
  VALIDATION_ERROR: 5000,

  // Server errors
  INTERNAL_SERVER_ERROR: 9999,
};
