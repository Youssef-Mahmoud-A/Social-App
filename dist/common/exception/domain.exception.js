"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooManyRequestsException = exports.ConflictException = exports.ForbiddenException = exports.UnauthorizedException = exports.NotFoundException = exports.BadRequestException = void 0;
const application_exception_js_1 = require("./application.exception.js");
class BadRequestException extends application_exception_js_1.ApplicationException {
    constructor(message = "Bad Request", cause) {
        super(message, 400, cause);
    }
}
exports.BadRequestException = BadRequestException;
class NotFoundException extends application_exception_js_1.ApplicationException {
    constructor(message = "Not Found", cause) {
        super(message, 404, cause);
    }
}
exports.NotFoundException = NotFoundException;
class UnauthorizedException extends application_exception_js_1.ApplicationException {
    constructor(message = "Unauthorized", cause) {
        super(message, 401, cause);
    }
}
exports.UnauthorizedException = UnauthorizedException;
class ForbiddenException extends application_exception_js_1.ApplicationException {
    constructor(message = "Forbidden", cause) {
        super(message, 403, cause);
    }
}
exports.ForbiddenException = ForbiddenException;
class ConflictException extends application_exception_js_1.ApplicationException {
    constructor(message = "Conflict", cause) {
        super(message, 409, cause);
    }
}
exports.ConflictException = ConflictException;
class TooManyRequestsException extends application_exception_js_1.ApplicationException {
    constructor(message = "Too Many Requests", cause) {
        super(message, 429, cause);
    }
}
exports.TooManyRequestsException = TooManyRequestsException;
