const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());

const users = {}; // Stores { username: socketId }

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  // Register a user with their username
  socket.on('register', (username) => {
    users[username] = socket.id;
    socket.username = username;
    console.log('Users connected:', users);
  });

  // Handle sending a private message
  socket.on('private message', ({ content, to }) => {
    const recipientSocketId = users[to];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('private message', {
        content,
        from: socket.username
      });
    }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.username);
    delete users[socket.username];
    console.log('Users connected:', users);
  });
});

server.listen(3001, () => {
  console.log('Server listening on *:3001');
});
