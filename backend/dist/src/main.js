"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nest_winston_1 = require("nest-winston");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const winston_1 = require("winston");
const compression_1 = __importDefault(require("compression"));
const winston = __importStar(require("winston"));
const nanoid_1 = require("nanoid");
const express_1 = require("express");
const node_path_1 = __importDefault(require("node:path"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const check_assets_cookie_middleware_1 = require("./common/middlewares/check-assets-cookie.middleware");
const not_found_exception_filter_1 = require("./common/exception/not-found-exception.filter");
const startup_app_1 = require("./common/utils/startup-app");
const middlewares_1 = require("./common/middlewares");
const get_start_message_1 = require("./common/utils/startup-app/get-start-message");
const filter_logs_1 = require("./common/utils/filter-logs/filter-logs");
const get_real_ip_1 = require("./common/middlewares/get-real-ip");
const app_module_1 = require("./app.module");
process.env.INTERNAL_JWT_SECRET = (0, nanoid_1.nanoid)(64);
const instanceId = process.env.INSTANCE_ID || '0';
const logger = (0, winston_1.createLogger)({
    transports: [new winston.transports.Console()],
    format: winston.format.combine((0, filter_logs_1.customLogFilter)(), winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss.SSS',
    }), winston.format.ms(), nest_winston_1.utilities.format.nestLike(`#${instanceId}`, {
        colors: true,
        prettyPrint: true,
        processId: false,
        appName: true,
    })),
    level: (0, startup_app_1.isDevOrDebugLogsEnabled)() ? 'debug' : 'http',
});
const assetsPath = (0, startup_app_1.isDevelopment)()
    ? node_path_1.default.join(__dirname, '..', '..', 'dev_frontend')
    : '/opt/app/frontend';
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: nest_winston_1.WinstonModule.createLogger({
            instance: logger,
        }),
    });
    app.disable('x-powered-by');
    app.use((0, cookie_parser_1.default)());
    app.use(middlewares_1.noRobotsMiddleware, middlewares_1.proxyCheckMiddleware, check_assets_cookie_middleware_1.checkAssetsCookieMiddleware, get_real_ip_1.getRealIp);
    app.useGlobalFilters(new not_found_exception_filter_1.NotFoundExceptionFilter());
    app.useStaticAssets(assetsPath, {
        index: false,
    });
    app.setBaseViewsDir(assetsPath);
    const consolidate = require('@ladjs/consolidate');
    app.engine('html', consolidate.ejs);
    app.setViewEngine('html');
    app.use((0, express_1.json)({ limit: '100mb' }));
    const config = app.get(config_1.ConfigService);
    app.use((0, helmet_1.default)({ contentSecurityPolicy: false }));
    app.use((0, compression_1.default)());
    app.use((0, morgan_1.default)(':remote-addr - ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));
    app.setGlobalPrefix(config.get('CUSTOM_SUB_PREFIX') || '');
    app.enableCors({
        origin: '*',
        methods: 'GET',
        credentials: false,
    });
    app.enableShutdownHooks();
    await app.listen(Number(config.getOrThrow('APP_PORT')));
    logger.info('\n' + (await (0, get_start_message_1.getStartMessage)()) + '\n');
}
void bootstrap();
//# sourceMappingURL=main.js.map