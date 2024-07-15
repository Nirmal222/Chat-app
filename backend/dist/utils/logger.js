"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const path_1 = __importDefault(require("path"));
function logError(message, error) {
    var _a;
    const timestamp = new Date().toISOString();
    const fileName = path_1.default.basename(__filename);
    const lineNumber = ((_a = error.stack) === null || _a === void 0 ? void 0 : _a.split('\n')[1].split(':')[1]) || 'unknown';
    console.error(`[${timestamp}] [${fileName}:${lineNumber}] ${message} - ${error.message}`);
}
function logInfo(message) {
    const timestamp = new Date().toISOString();
    console.info(`[${timestamp}] ${message}`);
}
function logWarning(message) {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] ${message}`);
}
exports.logger = { error: logError, warn: logWarning, info: logInfo };
//# sourceMappingURL=logger.js.map