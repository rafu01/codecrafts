import express from "express";
import {checkIfIdExists, copyS3Folder, fetchAllObjects} from "./s3Service";
import {TreeNode} from "./treeNodeService";
import * as dotenv from "dotenv";
import {createKubernetes} from "./createPod";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/project", async (request, response) => {
    const {id, language} = request.body;
    if (!id) {
        response.status(400).send("Bad request");
        return;
    }
    let exists = await checkIfIdExists(id);
    let treeNodes: TreeNode[];
    if (exists) {
        treeNodes = await fetchAllObjects(`${process.env.CODE_FOLDER}${id}`);
    } else {
        treeNodes = await copyS3Folder(`${process.env.BASE_FOLDER}${language}`, `${process.env.CODE_FOLDER}${id}`);
    }
    await createKubernetes(id);

    response.status(200).send(treeNodes);
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server started on | start ${port}`);
});
