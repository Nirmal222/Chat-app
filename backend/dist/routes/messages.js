"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const message_1 = require("../controllers/message");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.use(auth_1.authMiddleware);
router.post('/', message_1.sendMessage);
router.get('/chat/:userId1/:userId2', message_1.getChatHistory);
exports.default = router;
//# sourceMappingURL=messages.js.map