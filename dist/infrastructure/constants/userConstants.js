"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableSocialLogins = exports.UserLoginType = exports.AvailableUserRoles = exports.UserRolesEnum = void 0;
/**
 * @type {{ ADMIN: "ADMIN"; USER: "USER"} as const}
 */
exports.UserRolesEnum = {
    ADMIN: "ADMIN",
    USER: "USER",
};
exports.AvailableUserRoles = Object.values(exports.UserRolesEnum);
/**
 * @type {{ GOOGLE: "GOOGLE";  EMAIL_PASSWORD: "EMAIL_PASSWORD"} as const}
 */
exports.UserLoginType = {
    GOOGLE: "GOOGLE",
    EMAIL_PASSWORD: "EMAIL_PASSWORD",
};
exports.AvailableSocialLogins = Object.values(exports.UserLoginType);
