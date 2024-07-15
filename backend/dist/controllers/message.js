"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatHistory = exports.sendMessage = void 0;
const message_1 = __importDefault(require("../models/message"));
const asyncHandler_1 = require("../utils/asyncHandler");
exports.sendMessage = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderId, recipientId, content } = req.body;
    const message = new message_1.default({ sender: senderId, recipient: recipientId, content });
    yield message.save();
    res.status(201).json(message);
}));
exports.getChatHistory = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId1, userId2 } = req.params;
    const messages = yield message_1.default.find({
        $or: [
            { sender: userId1, recipient: userId2 },
            { sender: userId2, recipient: userId1 }
        ]
    }).sort('timestamp');
    res.json(messages);
}));
//# sourceMappingURL=message.js.map