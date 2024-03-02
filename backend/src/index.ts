import express from "express";
import * as dotenv from "dotenv";
import { initialize } from "./handler";
import { createServer } from "http";
dotenv.config();

const app = express();
const server = createServer(app);
initialize(app);
const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server started on ${port}`);
});
