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
const reportModel_1 = __importDefault(require("../../models/reportModel"));
class ReportRepository {
    getAllReportedPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("getall reports worked in repo :");
                const result = yield reportModel_1.default.find();
                console.log("result ", result);
                if (result)
                    return { success: true, data: result };
                return { success: false, message: "Failed to load  reports" };
            }
            catch (error) {
                console.log(error);
                return { duplicate: false, success: false };
            }
        });
    }
    getReportsByPostId(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("getall reports worked in repo :");
                const result = yield reportModel_1.default.find({ postId });
                console.log("result ", result);
                if (result)
                    return { success: true, data: result };
                return { success: false, message: "Failed to load  reports" };
            }
            catch (error) {
                console.log(error);
                return { duplicate: false, success: false };
            }
        });
    }
    changeActionStatus(reportId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Toggle action status worked in repo :");
                const report = yield reportModel_1.default.findById(reportId);
                if (!report) {
                    return { success: false, message: "Report not found" };
                }
                const updatedReport = yield reportModel_1.default.findByIdAndUpdate(reportId, { actionTaken: !report.actionTaken }, { new: true });
                console.log("result ", updatedReport);
                if (updatedReport) {
                    return { success: true, data: updatedReport };
                }
                return { success: false, message: "Failed to change action status" };
            }
            catch (error) {
                console.log(error);
                return { duplicate: false, success: false };
            }
        });
    }
}
exports.default = ReportRepository;
