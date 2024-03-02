import { Server as SocketServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";

export function initializeSocket(httpServer: HttpServer) {
  const socket = new SocketServer(httpServer);

  socket.on("connection", async (connection) => {});
}
