import express from "express";
import * as dotenv from "dotenv";
import { createServer } from "http";
import cors from 'cors';
import {initializeSocket} from "./socketConnection";

dotenv.config();

const app = express();
app.use(cors());
const server = createServer(app);
initializeSocket(server);

const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server started on ${port}`);
});
