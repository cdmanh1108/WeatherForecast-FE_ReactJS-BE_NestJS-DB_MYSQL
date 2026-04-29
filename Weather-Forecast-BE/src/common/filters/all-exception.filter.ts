import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiResponse } from '../dto/response/api-response.response';
import { ApiException } from '../exceptions/api-exception';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    console.error(`[${request.method}] ${request.url}`);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode: number | undefined;

    if (exception instanceof ApiException) {
      status = exception.getStatus();
      errorCode = exception.errorCode;
      const res = exception.getResponse();
      if (typeof res === 'object' && res !== null && 'message' in res) {
        message = String((res as { message: unknown }).message);
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null && 'message' in res) {
        const resMessage = (res as { message: unknown }).message;
        message = Array.isArray(resMessage)
          ? resMessage.join(', ')
          : String(resMessage);
      }
    }

    console.error('Exception caught by AllExceptionsFilter:');
    console.error({
      status,
      message,
      errorCode,
      error: exception instanceof Error ? exception.stack : exception,
    });
    console.error('detail error:', exception);

    response
      .status(status)
      .json(new ApiResponse<null>(status, message, null, errorCode));
  }
}
