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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RootController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootController = void 0;
const common_1 = require("@nestjs/common");
const backend_contract_1 = require("@remnawave/backend-contract");
const get_ip_1 = require("../../common/decorators/get-ip");
const root_service_1 = require("./root.service");
let RootController = RootController_1 = class RootController {
    rootService;
    logger = new common_1.Logger(RootController_1.name);
    constructor(rootService) {
        this.rootService = rootService;
    }
    async root(clientIp, request, response, shortUuid, clientType) {
        if (request.path.startsWith('/assets') || request.path.startsWith('/locales')) {
            response.socket?.destroy();
            return;
        }
        if (clientType === undefined) {
            return await this.rootService.serveSubscriptionPage(clientIp, request, response, shortUuid);
        }
        if (!backend_contract_1.REQUEST_TEMPLATE_TYPE_VALUES.includes(clientType)) {
            this.logger.error(`Invalid client type: ${clientType}`);
            response.socket?.destroy();
            return;
        }
        else {
            return await this.rootService.serveSubscriptionPage(clientIp, request, response, shortUuid, clientType);
        }
    }
};
exports.RootController = RootController;
__decorate([
    (0, common_1.Get)([':shortUuid', ':shortUuid/:clientType']),
    __param(0, (0, get_ip_1.ClientIp)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.Param)('shortUuid')),
    __param(4, (0, common_1.Param)('clientType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "root", null);
exports.RootController = RootController = RootController_1 = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [root_service_1.RootService])
], RootController);
//# sourceMappingURL=root.controller.js.map