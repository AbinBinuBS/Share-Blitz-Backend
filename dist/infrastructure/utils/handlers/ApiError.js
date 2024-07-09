"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    constructor(statusCode, message = 'Something went wrong', errors = [], stack) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.default = ApiError;
// import ApiError from './path-to-your-ApiError-file';
// try {
//     throw new ApiError(404, 'Resource not found', ['Detail about the error']);
// } catch (error) {
//     if (error instanceof ApiError) {
//         console.log(error.statusCode); // 404
//         console.log(error.message); // Resource not found
//         console.log(error.errors); // ['Detail about the error']
//     }
// }
