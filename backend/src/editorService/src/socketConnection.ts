import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import {getFileContents, writeToFile} from "./s3Service";
import * as dotenv from "dotenv";
import {executeFile, initiate, runCommand} from "./terminalService";
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

    socket.on('executeFile', async (fileName, callback) => {
      console.log('executing file: ', fileName);
      const {output, cwd} = await executeFile(fileName);
      callback(null, {output, cwd});
    });

    socket.on("executeCommand", async (command, callback) => {
      const {output, cwd} = await runCommand(command);
      callback(null, {output, cwd});
    });
  });
}
