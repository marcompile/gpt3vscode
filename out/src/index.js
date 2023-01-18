"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const extension_1 = require("./extension");
function activate(context) {
    (0, extension_1.activate)(context);
}
exports.activate = activate;
