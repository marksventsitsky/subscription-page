"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionWithErrorCodeType = void 0;
const http_exception_1 = require("@nestjs/common/exceptions/http.exception");
class HttpExceptionWithErrorCodeType extends http_exception_1.HttpException {
    errorCode;
    constructor(message, errorCode, statusCode) {
        super(message, statusCode);
        this.errorCode = errorCode;
    }
}
exports.HttpExceptionWithErrorCodeType = HttpExceptionWithErrorCodeType;
//# sourceMappingURL=http-exeception-with-error-code.type.js.map