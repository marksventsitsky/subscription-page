"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canParseJSON = canParseJSON;
function canParseJSON(jsonString) {
    try {
        JSON.parse(jsonString);
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=can-parse-json.js.map