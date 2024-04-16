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
exports.checkIfIdExists = exports.getFileContents = exports.copyToLocal = exports.writeToFile = exports.copyS3Folder = exports.fetchAllObjects = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv"));
const treeNodeService_1 = require("./treeNodeService");
dotenv.config();
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    // endpoint: process.env.AWS_ENDPOINT,
    s3ForcePathStyle: true,
});
function fetchAllObjects(sourcePrefix) {
    return __awaiter(this, void 0, void 0, function* () {
        const listedObjects = yield fetchObjects(sourcePrefix);
        let responseList = [];
        for (const object of listedObjects.Contents) {
            responseList.push(object.Key);
        }
        return (0, treeNodeService_1.createTreeFromPaths)(responseList);
    });
}
exports.fetchAllObjects = fetchAllObjects;
function fetchObjects(sourcePrefix) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const listParams = {
            Bucket: (_a = process.env.AWS_S3_BUCKET) !== null && _a !== void 0 ? _a : "",
            Prefix: sourcePrefix,
        };
        return yield s3.listObjectsV2(listParams).promise();
    });
}
function copyS3Folder(sourcePrefix, destinationPrefix) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const listedObjects = yield fetchObjects(sourcePrefix);
            if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
                console.log("base is empty");
            }
            let responseList = [];
            for (const object of listedObjects.Contents) {
                if (!object.Key)
                    continue;
                const destinationKey = object.Key.replace(sourcePrefix, destinationPrefix);
                const copyParams = {
                    Bucket: (_a = process.env.AWS_S3_BUCKET) !== null && _a !== void 0 ? _a : "",
                    CopySource: `${process.env.AWS_S3_BUCKET}/${object.Key}`,
                    Key: destinationKey
                };
                try {
                    yield s3.copyObject(copyParams).promise();
                    console.log(`Copied ${object.Key} to ${destinationKey}`);
                    responseList.push(destinationKey);
                }
                catch (error) {
                    console.error(`Error copying ${object.Key} to ${destinationKey}:`, error);
                }
            }
            return (0, treeNodeService_1.createTreeFromPaths)(responseList);
        }
        catch (error) {
            console.error('Error copying folder:', error);
            throw error;
        }
    });
}
exports.copyS3Folder = copyS3Folder;
function writeFile(filePath, fileData) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        yield createFolder(path_1.default.dirname(filePath));
        fs_1.default.writeFile(filePath, fileData, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    }));
}
function getPath(filePath, codeFolderLength) {
    return path_1.default.join(__dirname, `/workspace/${filePath.substring(codeFolderLength)}`);
}
function writeToFile(filePath, fileData) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        let codeFolderLength = `${process.env.CODE_FOLDER}`.length;
        fs_1.default.writeFile(getPath(filePath, codeFolderLength), fileData, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
        yield uploadToS3(filePath, fileData);
    }));
}
exports.writeToFile = writeToFile;
function uploadToS3(filePath, fileData) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const putObjectParams = {
            Bucket: (_a = process.env.AWS_S3_BUCKET) !== null && _a !== void 0 ? _a : "",
            Key: filePath,
            Body: fileData,
            ContentType: 'text/plain'
        };
        try {
            yield s3.putObject(putObjectParams).promise();
        }
        catch (err) {
            console.log("error uploading file", err);
        }
    });
}
function createFolder(dirName) {
    return new Promise((resolve, reject) => {
        fs_1.default.mkdir(dirName, { recursive: true }, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
const copyToLocal = (key, path) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let listedObjects = yield s3.listObjectsV2({
            Bucket: process.env.AWS_S3_BUCKET,
            Prefix: key
        }).promise();
        for (const object of listedObjects.Contents) {
            const getObjectParams = {
                Bucket: (_a = process.env.AWS_S3_BUCKET) !== null && _a !== void 0 ? _a : '',
                Key: object.Key
            };
            const data = yield s3.getObject(getObjectParams).promise();
            if (data.Body) {
                const fileData = data.Body;
                const filePath = `${path}${object.Key.replace(key, "")}`;
                yield writeFile(filePath, fileData);
                console.log(`Download ${object.Key} to ${filePath}`);
            }
        }
    }
    catch (error) {
        console.log("Error fetching folder from S3", error);
    }
});
exports.copyToLocal = copyToLocal;
const getFileContents = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        let codeFolderLength = `${process.env.CODE_FOLDER}`.length;
        fs_1.default.readFile(getPath(filePath, codeFolderLength), 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
});
exports.getFileContents = getFileContents;
const checkIfIdExists = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const headObjectParams = {
            Bucket: (_b = process.env.AWS_S3_BUCKET) !== null && _b !== void 0 ? _b : "",
            Prefix: `${process.env.CODE_FOLDER}${id}`,
        };
        let listObjects = yield s3.listObjectsV2(headObjectParams).promise();
        return listObjects.Contents.length > 0;
    }
    catch (err) {
        console.log(err);
        return false;
    }
});
exports.checkIfIdExists = checkIfIdExists;
