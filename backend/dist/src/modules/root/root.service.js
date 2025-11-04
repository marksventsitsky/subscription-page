"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RootService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootService = void 0;
const node_crypto_1 = require("node:crypto");
const nanoid_1 = require("nanoid");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const common_2 = require("@nestjs/common");
const axios_service_1 = require("../../common/axios/axios.service");
const utils_1 = require("../../common/utils");
let RootService = RootService_1 = class RootService {
    configService;
    jwtService;
    axiosService;
    logger = new common_2.Logger(RootService_1.name);
    isMarzbanLegacyLinkEnabled;
    marzbanSecretKey;
    constructor(configService, jwtService, axiosService) {
        this.configService = configService;
        this.jwtService = jwtService;
        this.axiosService = axiosService;
        this.isMarzbanLegacyLinkEnabled = this.configService.getOrThrow('MARZBAN_LEGACY_LINK_ENABLED');
        this.marzbanSecretKey = this.configService.get('MARZBAN_LEGACY_SECRET_KEY');
    }
    async serveSubscriptionPage(clientIp, req, res, shortUuid, clientType) {
        try {
            const userAgent = req.headers['user-agent'];
            let shortUuidLocal = shortUuid;
            if (this.isGenericPath(req.path)) {
                res.socket?.destroy();
                return;
            }
            if (this.isMarzbanLegacyLinkEnabled) {
                const username = await this.decodeMarzbanLink(shortUuid);
                if (username) {
                    const sanitizedUsername = (0, utils_1.sanitizeUsername)(username.username);
                    this.logger.log(`Decoded Marzban username: ${username.username}, sanitized username: ${sanitizedUsername}`);
                    const userInfo = await this.axiosService.getUserByUsername(clientIp, sanitizedUsername);
                    if (!userInfo.isOk || !userInfo.response) {
                        this.logger.error(`Decoded Marzban username is not found in Remnawave, decoded username: ${sanitizedUsername}`);
                        res.socket?.destroy();
                        return;
                    }
                    shortUuidLocal = userInfo.response.response.shortUuid;
                }
            }
            if (userAgent && this.isBrowser(userAgent)) {
                return this.returnWebpage(clientIp, req, res, shortUuidLocal);
            }
            let subscriptionDataResponse = null;
            subscriptionDataResponse = await this.axiosService.getSubscription(clientIp, shortUuidLocal, req.headers, !!clientType, clientType);
            if (!subscriptionDataResponse) {
                res.socket?.destroy();
                return;
            }
            if (subscriptionDataResponse.headers) {
                Object.entries(subscriptionDataResponse.headers)
                    .filter(([key]) => {
                    const ignoredHeaders = ['transfer-encoding', 'content-length', 'server'];
                    return !ignoredHeaders.includes(key.toLowerCase());
                })
                    .forEach(([key, value]) => {
                    res.setHeader(key, value);
                });
            }
            res.status(200).send(subscriptionDataResponse.response);
        }
        catch (error) {
            this.logger.error('Error in serveSubscriptionPage', error);
            res.socket?.destroy();
            return;
        }
    }
    async generateJwtForCookie() {
        return this.jwtService.sign({
            sessionId: (0, nanoid_1.nanoid)(32),
        }, {
            expiresIn: '1h',
        });
    }
    isBrowser(userAgent) {
        const browserKeywords = [
            'Mozilla',
            'Chrome',
            'Safari',
            'Firefox',
            'Opera',
            'Edge',
            'TelegramBot',
        ];
        return browserKeywords.some((keyword) => userAgent.includes(keyword));
    }
    isGenericPath(path) {
        const genericPaths = ['favicon.ico', 'robots.txt'];
        return genericPaths.some((genericPath) => path.includes(genericPath));
    }
    async returnWebpage(clientIp, req, res, shortUuid) {
        try {
            const cookieJwt = await this.generateJwtForCookie();
            const subscriptionDataResponse = await this.axiosService.getSubscriptionInfo(clientIp, shortUuid);
            if (!subscriptionDataResponse.isOk) {
                this.logger.error(`Get subscription info failed, shortUuid: ${shortUuid}`);
                res.socket?.destroy();
                return;
            }
            const subscriptionData = subscriptionDataResponse.response;
            let devicesData = null;
            if (subscriptionData?.response?.user?.username) {
                const userIdentifier = subscriptionData.response.user?.userUuid
                    || subscriptionData.response.user?.uuid
                    || subscriptionData.response.user.username;
                this.logger.log(`Attempting to fetch devices with identifier: ${userIdentifier}`);
                const devicesResponse = await this.axiosService.getUserDevices(clientIp, userIdentifier);
                if (devicesResponse.isOk && devicesResponse.response) {
                    devicesData = devicesResponse.response;
                }
            }
            const combinedData = {
                ...subscriptionData,
                devices: devicesData,
            };
            res.cookie('session', cookieJwt, {
                httpOnly: true,
                secure: true,
                maxAge: 3_600_000,
            });
            res.render('index', {
                metaTitle: this.configService
                    .getOrThrow('META_TITLE')
                    .replace(/^"|"$/g, ''),
                metaDescription: this.configService
                    .getOrThrow('META_DESCRIPTION')
                    .replace(/^"|"$/g, ''),
                panelData: Buffer.from(JSON.stringify(combinedData)).toString('base64'),
            });
        }
        catch (error) {
            this.logger.error('Error in returnWebpage', error);
            res.socket?.destroy();
            return;
        }
    }
    async decodeMarzbanLink(shortUuid) {
        const token = shortUuid;
        this.logger.debug(`Verifying token: ${token}`);
        if (!token || token.length < 10) {
            this.logger.debug(`Token too short: ${token}`);
            return null;
        }
        if (token.split('.').length === 3) {
            try {
                const payload = await this.jwtService.verifyAsync(token, {
                    secret: this.marzbanSecretKey,
                    algorithms: ['HS256'],
                });
                if (payload.access !== 'subscription') {
                    throw new Error('JWT access field is not subscription');
                }
                const jwtCreatedAt = new Date(payload.iat * 1000);
                if (!this.checkSubscriptionValidity(jwtCreatedAt, payload.sub)) {
                    return null;
                }
                this.logger.debug(`JWT verified successfully, ${JSON.stringify(payload)}`);
                return {
                    username: payload.sub,
                    createdAt: jwtCreatedAt,
                };
            }
            catch (err) {
                this.logger.debug(`JWT verification failed: ${err}`);
            }
        }
        const uToken = token.slice(0, token.length - 10);
        const uSignature = token.slice(token.length - 10);
        this.logger.debug(`Token parts: base: ${uToken}, signature: ${uSignature}`);
        let decoded;
        try {
            decoded = Buffer.from(uToken, 'base64url').toString();
        }
        catch (err) {
            this.logger.debug(`Base64 decode error: ${err}`);
            return null;
        }
        const hash = (0, node_crypto_1.createHash)('sha256');
        hash.update(uToken + this.marzbanSecretKey);
        const digest = hash.digest();
        const expectedSignature = Buffer.from(digest).toString('base64url').slice(0, 10);
        this.logger.debug(`Expected signature: ${expectedSignature}, actual: ${uSignature}`);
        if (uSignature !== expectedSignature) {
            this.logger.debug('Signature mismatch');
            return null;
        }
        const parts = decoded.split(',');
        if (parts.length < 2) {
            this.logger.debug(`Invalid token format: ${decoded}`);
            return null;
        }
        const username = parts[0];
        const createdAtInt = parseInt(parts[1], 10);
        if (isNaN(createdAtInt)) {
            this.logger.debug(`Invalid created_at timestamp: ${parts[1]}`);
            return null;
        }
        const createdAt = new Date(createdAtInt * 1000);
        if (!this.checkSubscriptionValidity(createdAt, username)) {
            return null;
        }
        this.logger.debug(`Token decoded. Username: ${username}, createdAt: ${createdAt}`);
        return {
            username,
            createdAt,
        };
    }
    checkSubscriptionValidity(createdAt, username) {
        const validFrom = this.configService.get('MARZBAN_LEGACY_SUBSCRIPTION_VALID_FROM');
        if (!validFrom) {
            return true;
        }
        const validFromDate = new Date(validFrom);
        if (createdAt < validFromDate) {
            this.logger.debug(`createdAt JWT: ${createdAt.toISOString()} is before validFrom: ${validFromDate.toISOString()}`);
            this.logger.warn(`${JSON.stringify({ username, createdAt })} – subscription createdAt is before validFrom`);
            return false;
        }
        return true;
    }
};
exports.RootService = RootService;
exports.RootService = RootService = RootService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        jwt_1.JwtService,
        axios_service_1.AxiosService])
], RootService);
//# sourceMappingURL=root.service.js.map