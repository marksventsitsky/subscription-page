"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noRobotsMiddleware = noRobotsMiddleware;
function noRobotsMiddleware(req, res, next) {
    res.setHeader('x-robots-tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex');
    return next();
}
//# sourceMappingURL=no-robots.middleware.js.map