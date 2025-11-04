"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyCheckMiddleware = proxyCheckMiddleware;
const common_1 = require("@nestjs/common");
const startup_app_1 = require("../utils/startup-app");
const logger = new common_1.Logger('ProxyCheckMiddleware');
function proxyCheckMiddleware(req, res, next) {
    if ((0, startup_app_1.isDevelopment)()) {
        return next();
    }
    const isProxy = Boolean(req.headers['x-forwarded-for']);
    const isHttps = Boolean(req.headers['x-forwarded-proto'] === 'https');
    logger.debug(`X-Forwarded-For: ${req.headers['x-forwarded-for']}, X-Forwarded-Proto: ${req.headers['x-forwarded-proto']}`);
    if (!isHttps || !isProxy) {
        res.socket?.destroy();
        logger.error('Reverse proxy and HTTPS are required.');
        return;
    }
    return next();
}
//# sourceMappingURL=proxy-check.middleware.js.map