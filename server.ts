import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
// import cors from 'cors';

const app = express();
// app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins in development
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Basic Express route
app.get('/ws', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.send('WebSocket server is running');
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.emit('news', {hello: 'world'});
  // Handle incoming messages
  socket.on('message', (data) => {
    console.log('Received message:', data);
    // Broadcast the message to all connected clients
    io.emit('message', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
