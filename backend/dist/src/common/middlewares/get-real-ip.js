"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRealIp = void 0;
const request_ip_1 = require("@kastov/request-ip");
const morgan_1 = __importDefault(require("morgan"));
morgan_1.default.token('remote-addr', (req) => {
    return req.clientIp;
});
const getRealIp = function (req, res, next) {
    const ip = (0, request_ip_1.getClientIp)(req);
    if (ip) {
        req.clientIp = ip;
    }
    else {
        req.clientIp = '0.0.0.0';
    }
    next();
};
exports.getRealIp = getRealIp;
//# sourceMappingURL=get-real-ip.js.map