"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStartMessage = getStartMessage;
const table_1 = require("table");
const pkg_types_1 = require("pkg-types");
async function getStartMessage() {
    const pkg = await (0, pkg_types_1.readPackageJSON)();
    return (0, table_1.table)([['Docs → https://remna.st\nCommunity → https://t.me/remnawave']], {
        header: {
            content: `Remnawave Subscription Page v${pkg.version}`,
            alignment: 'center',
        },
        columnDefault: {
            width: 60,
        },
        columns: {
            0: { alignment: 'center' },
            1: { alignment: 'center' },
        },
        drawVerticalLine: () => false,
        border: (0, table_1.getBorderCharacters)('ramac'),
    });
}
//# sourceMappingURL=get-start-message.js.map