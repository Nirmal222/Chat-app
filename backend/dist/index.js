"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const socketHandler_1 = require("./socket/socketHandler");
const auth_1 = __importDefault(require("./routes/auth"));
const connections_1 = __importDefault(require("./routes/connections"));
const messages_1 = __importDefault(require("./routes/messages"));
const user_1 = __importDefault(require("./routes/user"));
dotenv_1.default.config();
const PORT = process.env.PORT || 4000;
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
(0, socketHandler_1.setupSocketIO)(server);
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express_1.default.json());
app.use('/api/auth', auth_1.default);
app.use('/api/users', user_1.default);
app.use('/api/connections', connections_1.default);
app.use('/api/messages', messages_1.default);
(0, db_1.default)().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
//# sourceMappingURL=index.js.map