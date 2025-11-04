"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const validate_env_config_1 = require("./common/utils/validate-env-config");
const app_config_1 = require("./common/config/app-config");
const axios_module_1 = require("./common/axios/axios.module");
const subscription_page_backend_modules_1 = require("./modules/subscription-page-backend.modules");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_module_1.AxiosModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
                validate: (config) => (0, validate_env_config_1.validateEnvConfig)(app_config_1.configSchema, config),
            }),
            subscription_page_backend_modules_1.SubscriptionPageBackendModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map