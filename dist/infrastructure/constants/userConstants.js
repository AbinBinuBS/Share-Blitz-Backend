"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableNotificationTypes = exports.NotificationTypeEnum = exports.USER_TEMPORARY_TOKEN_EXPIRY = exports.AvailableSocialLogins = exports.UserLoginType = exports.AvailableUserRoles = exports.UserRolesEnum = void 0;
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
exports.USER_TEMPORARY_TOKEN_EXPIRY = 20 * 60 * 1000; // 20 minutes
/**
 * @type {{ ADMIN: "ADMIN"; USER: "USER"} as const}
 */
exports.NotificationTypeEnum = {
    ERROR: "ERROR",
    FRIENDREQUEST: "FRIENDREQUEST",
    NEWMESSAGE: "NEWMESSAGE",
    DEFAULT: "DEFAULT",
};
exports.AvailableNotificationTypes = Object.values(exports.NotificationTypeEnum);
