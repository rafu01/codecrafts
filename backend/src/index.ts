import express from "express";
import * as dotenv from "dotenv";
import { initialize } from "./handler";
import { createServer } from "http";
import cors from 'cors';
import {initializeSocket} from "./socketConnection";

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:8082' }));
const server = createServer(app);
initializeSocket(server);
initialize(app);
const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server started on ${port}`);
});
