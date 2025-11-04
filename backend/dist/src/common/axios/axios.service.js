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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AxiosService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiosService = void 0;
const axios_1 = __importStar(require("axios"));
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const backend_contract_1 = require("@remnawave/backend-contract");
let AxiosService = AxiosService_1 = class AxiosService {
    configService;
    axiosInstance;
    logger = new common_1.Logger(AxiosService_1.name);
    constructor(configService) {
        this.configService = configService;
        this.axiosInstance = axios_1.default.create({
            baseURL: this.configService.getOrThrow('REMNAWAVE_PANEL_URL'),
            timeout: 45_000,
            headers: {
                'x-forwarded-for': '127.0.0.1',
                'x-forwarded-proto': 'https',
                'user-agent': 'Remnawave Subscription Page',
                Authorization: `Bearer ${this.configService.get('REMNAWAVE_API_TOKEN')}`,
            },
        });
        const caddyAuthApiToken = this.configService.get('CADDY_AUTH_API_TOKEN');
        const cloudflareZeroTrustClientId = this.configService.get('CLOUDFLARE_ZERO_TRUST_CLIENT_ID');
        const cloudflareZeroTrustClientSecret = this.configService.get('CLOUDFLARE_ZERO_TRUST_CLIENT_SECRET');
        if (caddyAuthApiToken) {
            this.axiosInstance.defaults.headers.common['X-Api-Key'] = caddyAuthApiToken;
        }
        if (cloudflareZeroTrustClientId && cloudflareZeroTrustClientSecret) {
            this.axiosInstance.defaults.headers.common['CF-Access-Client-Id'] =
                cloudflareZeroTrustClientId;
            this.axiosInstance.defaults.headers.common['CF-Access-Client-Secret'] =
                cloudflareZeroTrustClientSecret;
        }
    }
    async getUserByUsername(clientIp, username) {
        try {
            const response = await this.axiosInstance.request({
                method: backend_contract_1.GetUserByUsernameCommand.endpointDetails.REQUEST_METHOD,
                url: backend_contract_1.GetUserByUsernameCommand.url(username),
                headers: {
                    [backend_contract_1.REMNAWAVE_REAL_IP_HEADER]: clientIp,
                },
            });
            return {
                isOk: true,
                response: response.data,
            };
        }
        catch (error) {
            if (error instanceof axios_1.AxiosError) {
                this.logger.error('Error in Axios GetUserByUsername Request:', error.message);
                return {
                    isOk: false,
                };
            }
            else {
                this.logger.error('Error in GetUserByUsername Request:', error);
                return {
                    isOk: false,
                };
            }
        }
    }
    async getSubscriptionInfo(clientIp, shortUuid) {
        try {
            const response = await this.axiosInstance.request({
                method: backend_contract_1.GetSubscriptionInfoByShortUuidCommand.endpointDetails.REQUEST_METHOD,
                url: backend_contract_1.GetSubscriptionInfoByShortUuidCommand.url(shortUuid),
                headers: {
                    [backend_contract_1.REMNAWAVE_REAL_IP_HEADER]: clientIp,
                },
            });
            return {
                isOk: true,
                response: response.data,
            };
        }
        catch (error) {
            if (error instanceof axios_1.AxiosError) {
                this.logger.error('Error in GetSubscriptionInfo Request:', error.message);
            }
            else {
                this.logger.error('Error in GetSubscriptionInfo Request:', error);
            }
            return { isOk: false };
        }
    }
    async getSubscription(clientIp, shortUuid, headers, withClientType = false, clientType) {
        try {
            let basePath = 'api/sub/' + shortUuid;
            if (withClientType && clientType) {
                basePath += '/' + clientType;
            }
            const response = await this.axiosInstance.request({
                method: 'GET',
                url: basePath,
                headers: {
                    ...this.filterHeaders(headers),
                    [backend_contract_1.REMNAWAVE_REAL_IP_HEADER]: clientIp,
                },
            });
            return {
                response: response.data,
                headers: response.headers,
            };
        }
        catch (error) {
            if (error instanceof axios_1.AxiosError) {
                this.logger.error('Error in GetSubscription Request:', error.message);
            }
            else {
                this.logger.error('Error in GetSubscription Request:', error);
            }
            return null;
        }
    }
    async getUserDevices(clientIp, username) {
        try {
            const response = await this.axiosInstance.request({
                method: 'GET',
                url: `api/hwid/devices/${username}`,
                headers: {
                    [backend_contract_1.REMNAWAVE_REAL_IP_HEADER]: clientIp,
                },
            });
            return {
                isOk: true,
                response: response.data,
            };
        }
        catch (error) {
            if (error instanceof axios_1.AxiosError) {
                this.logger.error('Error in GetUserDevices Request:', error.message);
            }
            else {
                this.logger.error('Error in GetUserDevices Request:', error);
            }
            return { isOk: false };
        }
    }
    filterHeaders(headers) {
        const allowedHeaders = [
            'user-agent',
            'accept',
            'accept-language',
            'accept-encoding',
            'x-hwid',
            'x-device-os',
            'x-ver-os',
            'x-device-model',
            'x-app-version',
            'x-device-locale',
            'x-client',
        ];
        const filteredHeaders = Object.fromEntries(Object.entries(headers).filter(([key]) => allowedHeaders.includes(key)));
        return filteredHeaders;
    }
};
exports.AxiosService = AxiosService;
exports.AxiosService = AxiosService = AxiosService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AxiosService);
//# sourceMappingURL=axios.service.js.map