"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlerWithNull = errorHandlerWithNull;
const error_handler_helper_1 = require("./error-handler.helper");
function errorHandlerWithNull(response) {
    if (response.isOk) {
        if (!response.response) {
            return null;
        }
        return (0, error_handler_helper_1.errorHandler)(response);
    }
    else {
        return (0, error_handler_helper_1.errorHandler)(response);
    }
}
//# sourceMappingURL=error-handler-with-null.helper.js.map