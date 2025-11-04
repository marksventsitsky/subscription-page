"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customLogFilter = void 0;
const winston_1 = __importDefault(require("winston"));
const contextsToIgnore = ['InstanceLoader', 'RoutesResolver', 'RouterExplorer'];
exports.customLogFilter = winston_1.default.format((info) => {
    if (info.context) {
        const contextValue = String(info.context);
        if (contextsToIgnore.some((ctx) => contextValue === ctx)) {
            return false;
        }
    }
    return info;
});
//# sourceMappingURL=filter-logs.js.map