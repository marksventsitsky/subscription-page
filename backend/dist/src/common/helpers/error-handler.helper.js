"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
const http_exeception_with_error_code_type_1 = require("../exception/http-exeception-with-error-code.type");
function errorHandler(response) {
    if (response.isOk) {
        if (!response.response) {
            throw new common_1.InternalServerErrorException('No data returned');
        }
        return response.response;
    }
    else {
        if (!response.code) {
            throw new common_1.InternalServerErrorException('Unknown error');
        }
        const errorObject = Object.values(constants_1.ERRORS).find((error) => error.code === response.code);
        if (!errorObject) {
            throw new common_1.InternalServerErrorException('Unknown error');
        }
        throw new http_exeception_with_error_code_type_1.HttpExceptionWithErrorCodeType(response.message || errorObject.message, errorObject.code, errorObject.httpCode);
    }
}
//# sourceMappingURL=error-handler.helper.js.map