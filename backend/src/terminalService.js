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
exports.runCommand = exports.initiate = void 0;
const get_pty_output_1 = require("get-pty-output");
const path_1 = __importDefault(require("path"));
let workingFilePath = '';
function initiate(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const cwd = path_1.default.join(__dirname, `/workspace/${filePath}`);
        workingFilePath = filePath;
        const res = yield (0, get_pty_output_1.exec)(`cd ${cwd}`);
        return { output: res.output, cwd };
    });
}
exports.initiate = initiate;
function runCommand(command) {
    return __awaiter(this, void 0, void 0, function* () {
        const cwd = path_1.default.join(__dirname, `/workspace/${workingFilePath}`);
        try {
            let out = '';
            const timeoutPromise = new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 500);
            });
            // @ts-ignore
            const { output } = yield Promise.race([
                (0, get_pty_output_1.exec)(command, { cwd, timeout: 500 }),
                timeoutPromise
            ]);
            out = output;
            return out;
        }
        catch (err) {
            return 'Unknown Command';
        }
    });
}
exports.runCommand = runCommand;
