import { Server as SocketServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import {getFolder} from "./s3Service";
import path from "path";

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
    connection.on('fetchFileContent', (filePath, callback) => {
      console.log("asking for files completed");
    })
  });
}
