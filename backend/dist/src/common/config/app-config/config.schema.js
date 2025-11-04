"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Env = exports.configSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.configSchema = zod_1.z
    .object({
    APP_PORT: zod_1.z
        .string()
        .default('3010')
        .transform((port) => parseInt(port, 10)),
    REMNAWAVE_PANEL_URL: zod_1.z.string(),
    MARZBAN_LEGACY_LINK_ENABLED: zod_1.z
        .string()
        .default('false')
        .transform((val) => val === 'true'),
    MARZBAN_LEGACY_SECRET_KEY: zod_1.z.optional(zod_1.z.string()),
    REMNAWAVE_API_TOKEN: zod_1.z.optional(zod_1.z.string()),
    MARZBAN_LEGACY_SUBSCRIPTION_VALID_FROM: zod_1.z.optional(zod_1.z.string()),
    CUSTOM_SUB_PREFIX: zod_1.z.optional(zod_1.z.string()),
    CADDY_AUTH_API_TOKEN: zod_1.z.optional(zod_1.z.string()),
    META_TITLE: zod_1.z.string(),
    META_DESCRIPTION: zod_1.z.string(),
    CLOUDFLARE_ZERO_TRUST_CLIENT_ID: zod_1.z.optional(zod_1.z.string()),
    CLOUDFLARE_ZERO_TRUST_CLIENT_SECRET: zod_1.z.optional(zod_1.z.string()),
})
    .superRefine((data, ctx) => {
    if (!data.REMNAWAVE_PANEL_URL.startsWith('http://') &&
        !data.REMNAWAVE_PANEL_URL.startsWith('https://')) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: 'REMNAWAVE_PANEL_URL must start with http:// or https://',
            path: ['REMNAWAVE_PANEL_URL'],
        });
    }
    if (data.MARZBAN_LEGACY_LINK_ENABLED === true) {
        if (!data.MARZBAN_LEGACY_SECRET_KEY) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: 'MARZBAN_LEGACY_SECRET_KEY is required when MARZBAN_LEGACY_LINK_ENABLED is true',
            });
        }
        if (!data.REMNAWAVE_API_TOKEN) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: 'REMNAWAVE_API_TOKEN is required when MARZBAN_LEGACY_LINK_ENABLED is true',
            });
        }
    }
});
class Env extends (0, nestjs_zod_1.createZodDto)(exports.configSchema) {
}
exports.Env = Env;
//# sourceMappingURL=config.schema.js.map