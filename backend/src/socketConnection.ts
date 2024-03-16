import { Server as SocketServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import {getFileContents, getFolder, writeToFile} from "./s3Service";
import path from "path";
import * as dotenv from "dotenv";
dotenv.config();
export function initializeSocket(httpServer: HttpServer) {
  const socket = new SocketServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  socket.on("connection", async (connection) => {
    const id = connection.handshake.query.id as string;
    connection.on('init', async (idObject)=> {
      const {id} = idObject;
      await getFolder(`code/${id}`, path.join(__dirname, `../../tmp/${id}`));
    })
    connection.on('fetchFileContent', async (filePath, callback) => {
      try {
        let fileContent = await getFileContents(filePath);
        callback(null, fileContent);
      }
      catch (err) {
        callback(err);
      }
    })
    connection.on('saveChange', async (updatedFile, filePath, callback) => {
      try {
        console.log(filePath);
        await writeToFile(filePath, updatedFile);
        callback(null, true);
      }
      catch (err) {
        callback(err);
      }
    })
  });
}
