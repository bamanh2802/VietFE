import { WebSocketServer } from "ws";

let wss;

export default function handler(req, res) {
  if (!wss) {
    wss = new WebSocketServer({ noServer: true });

    // Thiết lập sự kiện khi có kết nối mới
    wss.on("connection", (ws) => {
      console.log("Client connected");

      ws.on("message", (message) => {
        console.log(`Received message: ${message}`);
        // Phản hồi lại client
        ws.send(`Server received: ${message}`);
      });

      ws.on("close", () => {
        console.log("Client disconnected");
      });
    });

    // Định nghĩa một server WebSocket để kết nối với API route
    res.socket.server.on("upgrade", (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    });

    console.log("WebSocket server created");
  } else {
    console.log("WebSocket server already running");
  }

  res.end();
}
