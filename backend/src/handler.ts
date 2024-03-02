import { Express } from "express";
import express from "express";

export function initialize(app: Express) {
  app.use(express.json());

  app.post("/project", async (request, response) => {
    const { id, language } = request.body;
    response.send("Workspace initialized");
  });
}
