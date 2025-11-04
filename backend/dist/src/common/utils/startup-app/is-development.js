"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDevelopment = isDevelopment;
exports.isProduction = isProduction;
exports.isDebugLogsEnabled = isDebugLogsEnabled;
exports.isDevOrDebugLogsEnabled = isDevOrDebugLogsEnabled;
function isDevelopment() {
    return process.env.NODE_ENV === 'development';
}
function isProduction() {
    return process.env.NODE_ENV === 'production';
}
function isDebugLogsEnabled() {
    return process.env.ENABLE_DEBUG_LOGS === 'true';
}
function isDevOrDebugLogsEnabled() {
    if (isDevelopment()) {
        return true;
    }
    if (isDebugLogsEnabled()) {
        return true;
    }
    return false;
}
//# sourceMappingURL=is-development.js.map