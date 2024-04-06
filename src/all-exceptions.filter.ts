import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.status || 500;
    const message = exception.message || 'Internal server error';

    // Content not found
    if (
      message.startsWith('Nothing found with that contentUrl') &&
      status === 500
    ) {
      response.status(404).json({
        statusCode: 404,
        message: 'Content not found',
      });
      return;
    }

    // Diory not found
    if (message.startsWith('getDiory: Diory not found') && status === 500) {
      response.status(404).json({
        statusCode: 404,
        message: 'Diory not found',
      });
      return;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
