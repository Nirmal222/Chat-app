"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connection_1 = require("../controllers/connection");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.use(auth_1.authMiddleware);
router.post('/request', connection_1.sendConnectionRequest);
router.put('/respond', connection_1.respondToConnectionRequest);
router.get('/:userId', connection_1.getUserConnections);
router.get('/:userId/:otherUserId', connection_1.getUserConnection);
router.post("/requests", connection_1.getRequests);
exports.default = router;
//# sourceMappingURL=connections.js.map