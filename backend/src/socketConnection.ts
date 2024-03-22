import { Server as SocketServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import {getFileContents, copyToLocal, writeToFile} from "./s3Service";
import path from "path";
import * as dotenv from "dotenv";
import {TerminalManager} from "./terminalManager";
import {initTerminal} from "./terminalService";
dotenv.config();

const terminalManager = new TerminalManager();

export function initializeSocket(httpServer: HttpServer) {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });
  io.on("connection", async (socket) => {
    const id = socket.handshake.query.id as string;
    socket.on('init', async (idObject)=> {
      const {id} = idObject;
      await copyToLocal(`code/${id}`, path.join(__dirname, `../../tmp/${id}`));
    })
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
      terminalManager.createPty(socket.id, id, (data, cwd, terminalId) => {
        callback(null, {data: Buffer.from(data,"utf-8"), cwd});
      });
    });

    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });

    socket.on("terminalData", async ({ data }: { data: string, terminalId: number }) => {
      terminalManager.write(socket.id, data);
    });
  });
}
