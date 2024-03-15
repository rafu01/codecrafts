import { Express } from "express";
import express from "express";
import {copyS3Folder} from "./s3Service";

export function initialize(app: Express) {
  app.use(express.json());

  app.post("/project", async (request, response) => {
    const { id, language } = request.body;
    if (!id) {
      response.status(400).send("Bad request");
      return;
    }
    const treeNodes = await copyS3Folder(`base/${language}`, `code/${id}`);
    response.send(treeNodes);
  });
}
