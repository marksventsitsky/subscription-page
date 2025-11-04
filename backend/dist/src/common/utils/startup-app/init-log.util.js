"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initLogs = initLogs;
const is_development_1 = require("./is-development");
function initLogs() {
    const logLevels = (0, is_development_1.isDevelopment)()
        ? ['log', 'error', 'warn', 'debug', 'verbose']
        : ['log', 'error', 'warn'];
    return logLevels;
}
//# sourceMappingURL=init-log.util.js.map