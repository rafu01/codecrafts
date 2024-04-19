import { Server as SocketServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import {getFileContents, copyToLocal, writeToFile} from "./s3Service";
import * as dotenv from "dotenv";
import {initiate, runCommand} from "./terminalService";
dotenv.config();

export function initializeSocket(httpServer: HttpServer) {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'WS']
    }
  });
  io.on("connection", async (socket) => {
    console.log("connection reached to backend");
    socket.on('fetchFileContent', async (filePath, callback) => {
      try {
        let fileContent = await getFileContents(filePath);
        callback(null, fileContent);
      }
      catch (err) {
        callback(err);
      }
    })
    socket.on('saveChange', async (updatedFile, filePath, callback) => {
      try {
        await writeToFile(filePath, updatedFile);
        callback(null, true);
      }
      catch (err) {
        callback(err);
      }
    })
    socket.on("requestTerminal", async (idObject, callback) => {
      const {id} = idObject;
      const {output, cwd} = await initiate(id);
      callback(null, {data: output, cwd});
    });

    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });

    socket.on("executeCommand", async (command, callback) => {
      console.log('command: ', command);
      const output = await runCommand(command);
      callback(null, {output});
    });
  });
}
