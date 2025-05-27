import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Response, Request } from 'express';

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    let code = '00000';
    let message = 'success';

    if (
      request.query.status_error ||
      (request.body && request.body.status_error)
    ) {
      throw new HttpException(
        request.path + ' mock error !',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (request.query.code_error || (request.body && request.body.code_error)) {
      code = '00003';
      message = 'mock error';
    }

    const format = (data) => {
      return {
        code,
        statusCode: response.statusCode,
        message,
        data: code === '00000' ? data : null,
      };
    };

    return next.handle().pipe(map(format));
  }
}
