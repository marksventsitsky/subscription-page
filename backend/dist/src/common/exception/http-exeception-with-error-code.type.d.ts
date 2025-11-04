import { HttpException } from '@nestjs/common/exceptions/http.exception';
export declare class HttpExceptionWithErrorCodeType extends HttpException {
    errorCode: string;
    constructor(message: string, errorCode: string, statusCode: number);
}
