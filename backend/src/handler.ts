import { Express } from "express";
import express from "express";
import {checkIfIdExists, copyS3Folder, fetchObjects} from "./s3Service";
import {TreeNode} from "./treeNodeService";
import * as dotenv from "dotenv";
dotenv.config();
export function initialize(app: Express) {
  app.use(express.json());

  app.post("/project", async (request, response) => {
    const { id, language } = request.body;
    if (!id) {
      response.status(400).send("Bad request");
      return;
    }
    let exists = await checkIfIdExists(id);
    let treeNodes: TreeNode[];
    if(exists) {
      treeNodes = await fetchObjects(`${process.env.CODE_FOLDER}${id}`);
    }
    else {
      treeNodes = await copyS3Folder(`${process.env.BASE_FOLDER}${language}`, `${process.env.CODE_FOLDER}${id}`);
    }

    response.send(treeNodes);
  });
}
