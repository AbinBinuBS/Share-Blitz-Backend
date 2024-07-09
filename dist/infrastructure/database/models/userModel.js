"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importStar(require("mongoose"));
const userConstants_1 = require("../../constants/userConstants");
const connectionsModel_1 = __importDefault(require("./connectionsModel"));
const jwtToken_1 = __importDefault(require("../../utils/helpers/jwtToken"));
const JWT = new jwtToken_1.default();
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    mobile: {
        type: String,
        required: false,
        validate: {
            validator: function (v) {
                return /\d{10}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long']
    },
    bio: {
        type: String,
        required: false,
    },
    dob: {
        type: String,
        required: false,
    },
    profileImageUrl: {
        type: String,
        required: false,
        default: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4eMoz7DH8l_Q-iCzSc1xyu_C2iryWh2O9_FcDBpY04w&s`
    },
    backgroundImageUrl: {
        type: String,
        required: false,
        default: `https://e0.pxfuel.com/wallpapers/105/23/desktop-wallpaper-compromised-character-gaming-profile-dark-cute-cartoon-boys-thumbnail.jpg`,
    },
    role: {
        type: String,
        enum: userConstants_1.AvailableUserRoles,
        default: userConstants_1.UserRolesEnum.USER
    },
    loginType: {
        type: String,
        enum: userConstants_1.AvailableSocialLogins,
        default: userConstants_1.UserLoginType.EMAIL_PASSWORD
    },
    refreshToken: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: false,
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    creationTime: {
        type: Date,
        default: Date.now
    },
    savedPost: [{
            postId: { type: String, required: false }
        }],
    followings: [{
            id: { type: String, required: true }
        }],
    followers: [{
            id: { type: String, required: true }
        }]
});
userSchema.post("save", function (user, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const connections = yield connectionsModel_1.default.findOne({ userId: user._id });
        if (!connections) {
            yield connectionsModel_1.default.create({
                userId: user._id,
                followings: [],
                followers: []
            });
        }
        next();
    });
});
userSchema.methods.generateAccessToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('user genrating toke access');
        return JWT.createJwtToken(this._id, this.role, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRY || "1d");
    });
};
userSchema.methods.generateRefreshToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('user genrating toke refresh');
        return JWT.createJwtToken(this._id, this.role, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRY || "10d");
    });
};
const UserModel = mongoose_1.default.model('User', userSchema);
exports.default = UserModel;
