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
const app_1 = require("./infrastructure/config/app");
const mongoose_1 = __importDefault(require("mongoose"));
function getMongoDS() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect('mongodb://localhost:27017/shareBlitz');
            console.log('MongoDB database connection established successfully 🚀');
            return;
        }
        catch (error) {
            console.error('MongoDB connection error:', error);
            throw error; // Rethrow the error for further handling or termination
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    const dataSource = yield getMongoDS();
    const newServer = (0, app_1.createServer)();
    newServer === null || newServer === void 0 ? void 0 : newServer.listen(5000, () => console.log('Running on http://localhost:4000'));
}))();
