import { Express } from "express";
import express from "express";

export function initialize(app: Express) {
  app.use(express.json());

  app.post("/project", async (request, response) => {
    const { id, language } = request.body;
    console.log(id, language);
    response.send("Workspace initialized");
  });
}
