import { Server as SocketServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import {getFileContents, copyToLocal, writeToFile} from "./s3Service";
import path from "path";
import * as dotenv from "dotenv";
import {TerminalManager} from "./terminalManager";
dotenv.config();

const terminalManager = new TerminalManager();

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
      await copyToLocal(`code/${id}`, path.join(__dirname, `../../tmp/${id}`));
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
        await writeToFile(filePath, updatedFile);
        callback(null, true);
      }
      catch (err) {
        callback(err);
      }
    })
    connection.on("requestTerminal", async () => {
      terminalManager.createPty(connection.id, id, (data, id) => {
        socket.emit('terminal', {
          data: Buffer.from(data,"utf-8")
        });
      });
    });

    connection.on("terminalData", async ({ data }: { data: string, terminalId: number }) => {
      terminalManager.write(connection.id, data);
    });
  });
}
