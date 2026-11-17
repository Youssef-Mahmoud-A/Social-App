"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const Model_1 = require("../../DB/Model");
const base_repository_1 = require("./base.repository");
class UserRepository extends base_repository_1.DatabaseRepository {
    constructor() {
        super(Model_1.UserModel);
    }
}
exports.UserRepository = UserRepository;
