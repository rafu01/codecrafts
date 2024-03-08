import express from "express";
import * as dotenv from "dotenv";
import { initialize } from "./handler";
import { createServer } from "http";
import cors from 'cors';
dotenv.config();

const app = express();
app.use(cors());
const server = createServer(app);
initialize(app);
const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server started on ${port}`);
});
