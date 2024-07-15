"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ConnectionSchema = new mongoose_1.default.Schema({
    requester: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });
ConnectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });
ConnectionSchema.pre('save', function (next) {
    if (this.requester.toString() === this.recipient.toString()) {
        next(new Error('Cannot create a connection with yourself'));
    }
    else {
        next();
    }
});
const Connection = mongoose_1.default.model('Connection', ConnectionSchema);
exports.default = Connection;
//# sourceMappingURL=connection.js.map