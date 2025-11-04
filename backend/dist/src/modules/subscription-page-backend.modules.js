"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPageBackendModule = void 0;
const common_1 = require("@nestjs/common");
const root_module_1 = require("./root/root.module");
let SubscriptionPageBackendModule = class SubscriptionPageBackendModule {
};
exports.SubscriptionPageBackendModule = SubscriptionPageBackendModule;
exports.SubscriptionPageBackendModule = SubscriptionPageBackendModule = __decorate([
    (0, common_1.Module)({
        imports: [root_module_1.RootModule],
    })
], SubscriptionPageBackendModule);
//# sourceMappingURL=subscription-page-backend.modules.js.map