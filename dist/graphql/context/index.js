"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = __importDefault(require("../services/api"));
const db_1 = require("../services/db");
const pubsub_1 = __importDefault(require("../services/pubsub"));
const nodeCache_1 = __importDefault(require("../services/nodeCache"));
const nodeMailer_1 = require("../services/nodeMailer");
const context = async ({ req, res }) => {
    return { api: api_1.default, req, res, db: db_1.db, pubsub: pubsub_1.default, cache: nodeCache_1.default, mail: nodeMailer_1.transporter };
};
exports.default = context;
