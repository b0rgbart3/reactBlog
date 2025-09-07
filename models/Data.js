"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Data = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const DataSchema = new mongoose_1.default.Schema({
    id: String,
    message: String,
});
exports.Data = mongoose_1.default.model("Data", DataSchema);
//# sourceMappingURL=Data.js.map