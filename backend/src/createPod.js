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
exports.createKubernetes = void 0;
const fs_1 = __importDefault(require("fs"));
const yaml_1 = __importDefault(require("yaml"));
const path_1 = __importDefault(require("path"));
const client_node_1 = require("@kubernetes/client-node");
const kubeconfig = new client_node_1.KubeConfig();
kubeconfig.loadFromDefault();
const coreV1Api = kubeconfig.makeApiClient(client_node_1.CoreV1Api);
const appsV1Api = kubeconfig.makeApiClient(client_node_1.AppsV1Api);
const networkingV1Api = kubeconfig.makeApiClient(client_node_1.NetworkingV1Api);
const readAndParseKubeYaml = (filePath, replId) => {
    const fileContent = fs_1.default.readFileSync(filePath, 'utf8');
    const docs = yaml_1.default.parseAllDocuments(fileContent).map((doc) => {
        let docString = doc.toString();
        const regex = new RegExp(`code_service`, 'g');
        docString = docString.replace(regex, replId);
        console.log(docString);
        return yaml_1.default.parse(docString);
    });
    return docs;
};
const createKubernetes = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const namespace = "default";
    try {
        const kubeManifests = readAndParseKubeYaml(path_1.default.join(__dirname, "../service.yaml"), id);
        for (const manifest of kubeManifests) {
            switch (manifest.kind) {
                case "Deployment":
                    yield appsV1Api.createNamespacedDeployment(namespace, manifest);
                    break;
                case "Service":
                    yield coreV1Api.createNamespacedService(namespace, manifest);
                    break;
                case "Ingress":
                    yield networkingV1Api.createNamespacedIngress(namespace, manifest);
                    break;
                default:
                    console.log(`Unsupported kind: ${manifest.kind}`);
            }
        }
        console.log("Resources created!");
        return true;
    }
    catch (error) {
        console.error("Failed to create resources", error);
        return false;
    }
});
exports.createKubernetes = createKubernetes;
