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
exports.initialize = void 0;
const express_1 = __importDefault(require("express"));
const s3Service_1 = require("./s3Service");
const dotenv = __importStar(require("dotenv"));
const createPod_1 = require("./createPod");
dotenv.config();
function initialize(app) {
    app.use(express_1.default.json());
    app.post("/project", (request, response) => __awaiter(this, void 0, void 0, function* () {
        const { id, language } = request.body;
        if (!id) {
            response.status(400).send("Bad request");
            return;
        }
        let exists = yield (0, s3Service_1.checkIfIdExists)(id);
        let treeNodes;
        if (exists) {
            treeNodes = yield (0, s3Service_1.fetchAllObjects)(`${process.env.CODE_FOLDER}${id}`);
        }
        else {
            treeNodes = yield (0, s3Service_1.copyS3Folder)(`${process.env.BASE_FOLDER}${language}`, `${process.env.CODE_FOLDER}${id}`);
        }
        yield (0, createPod_1.createKubernetes)(id);
        response.send(treeNodes);
    }));
}
exports.initialize = initialize;
