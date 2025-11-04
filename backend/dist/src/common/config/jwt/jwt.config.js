"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJWTConfig = void 0;
const getJWTConfig = () => ({
    useFactory: () => ({
        secret: process.env.INTERNAL_JWT_SECRET,
    }),
});
exports.getJWTConfig = getJWTConfig;
//# sourceMappingURL=jwt.config.js.map