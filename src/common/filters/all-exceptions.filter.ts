import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.message
                : 'Internal server error';

        const errorResponse = {
            success: false,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
            error:
                exception instanceof Error
                    ? {
                        name: exception.name,
                        message: exception.message,
                        stack:
                            process.env.NODE_ENV === 'development'
                                ? exception.stack
                                : undefined,
                    }
                    : exception,
        };

        this.logger.error(
            `${request.method} ${request.url}`,
            exception instanceof Error ? exception.stack : JSON.stringify(exception),
        );

        response.status(status).json(errorResponse);
    }
}
