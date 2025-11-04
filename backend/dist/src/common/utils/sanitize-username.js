"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeUsername = sanitizeUsername;
function sanitizeUsername(username) {
    const validPattern = /^[a-zA-Z0-9_-]+$/;
    const sanitized = [];
    for (const char of username) {
        if (validPattern.test(char)) {
            sanitized.push(char);
        }
        else {
            sanitized.push('_');
        }
    }
    let result = sanitized.join('');
    if (result.length < 6) {
        result = result + '_'.repeat(6 - result.length);
    }
    return result;
}
//# sourceMappingURL=sanitize-username.js.map