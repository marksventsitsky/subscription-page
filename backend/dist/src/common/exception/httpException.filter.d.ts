import { ZodValidationException } from 'nestjs-zod';
import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { HttpExceptionWithErrorCodeType } from './http-exeception-with-error-code.type';
export declare class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: HttpExceptionWithErrorCodeType | ZodValidationException, host: ArgumentsHost): void;
}
