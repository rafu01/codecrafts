import { Server as SocketServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";

export function initializeSocket(httpServer: HttpServer) {
  const socket = new SocketServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  socket.on("connection", async (connection) => {
    const id = connection.handshake.query.id as string;
  });
}
