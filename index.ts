import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

interface Message {
  id: string;
  text: string;
  timestamp: number;
}

const app = express();
const server = http.createServer(app);

// set up a new socketIO webserver with cors param allows specified origins to connect
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Or "*" for all origins (use with caution in production)
    methods: ["GET", "POST"], // Specify allowed HTTP methods
    credentials: true // If you need to send cookies or authentication info
  }
});

// extra steps necessary tro add __dirname in node23
// import { fileURLToPath } from 'url'; 
// import { dirname } from 'path'; 
// const __dirname = dirname(fileURLToPath(import.meta.url)); 

const PORT = process.env.PORT || 3001;

// serve a simple message when the user navigates to the root url
app.get('/', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  // res.sendFile(__dirname + '/index.html');
  res.send("WebSocket Server is running");
});

// listen for a connection event and emit a message to all clients when a user connects
io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
    
    // send a message to all clients when a user disconnects
    const msg: Message = {
      id: Date.now().toString(),
      text: "user disconnected",
      timestamp: Date.now(),
    }
    io.emit('chat message', msg);
  }); 

  // listen for chat message event and emit it to all clients
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

// start the server
server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});