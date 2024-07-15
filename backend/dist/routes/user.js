"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const auth_1 = require("../middlewares/auth");
const connection_1 = require("../controllers/connection");
const router = express_1.default.Router();
router.use(auth_1.authMiddleware);
router.get('/search', user_1.userController.searchUsers);
router.get('/all', user_1.userController.getAllUsers);
router.get('/:id', user_1.userController.getUser);
router.delete('/:id', user_1.userController.deleteUser);
router.post('/requests', connection_1.getRequests);
exports.default = router;
//# sourceMappingURL=user.js.map