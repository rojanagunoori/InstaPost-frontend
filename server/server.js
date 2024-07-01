const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
 /*cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());*/
 cors: {
    origin: 'https://instapost-deploy-frontend.vercel.app', 
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin: 'https://instapost-deploy-frontend.vercel.app',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

const users = {}; // Stores { username: socketId }

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  // Register a user with their username
  /*socket.on('register', (username) => {
    users[username] = socket.id;
    socket.username = username;
    console.log('Users connected:', users);
  });*/

  socket.on('register', (userId) => {
    users[userId] = socket.id;
    socket.userId = userId; // Store userId on socket
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

  socket.on('new post', (data) => {
    console.log(`New post from ${data.user}: ${data.description}`);
    // Notify all users except the one who created the post
    Object.values(users).forEach(socketId => {
        console.log("Emited ",users,socketId)
        if (socket.id !== socketId) {
            io.to(socketId).emit('notification', `${data.user} posted a new update: ${data.description}`);
        }
    });
});

socket.on('like', (data) => {
    console.log(`New like from ${data.user}: ${data.description}`);
    console.log('Users connected:', users); 
    const postOwnerSocketId = users[data.postOwner]; 
    console.log('Post owner socket ID:', postOwnerSocketId);
    console.log('Data:', data);
    
    
    console.log("postOwner",data.postOwner)
    const {postOwner}=data
    console.log("postOwner2",postOwner)
    if (postOwner) {
        console.log('Emitting notification to:', );
        io.to(postOwnerSocketId).emit('notification', `${data.user} liked your post.`);
    } else {
        console.log('Post owner socket ID not found:', data.postOwner);
    }
});



  // Handle dislike
  socket.on('dislike', (data) => {
    console.log(`New dislike from ${data.user}: ${data.description}`);
    const postOwnerSocketId = users[data.postOwner];
    if (postOwnerSocketId) {
      io.to(postOwnerSocketId).emit('notification', `${data.user} disliked your post.`);
    }
  });

  // Handle comment
  socket.on('comment', (data) => {
    console.log(`New comment from ${data.user}: ${data.description}`);
    const postOwnerSocketId = users[data.postOwner];
    if (postOwnerSocketId) {
      io.to(postOwnerSocketId).emit('notification', `${data.user} commented on your post: ${data.comment}`);
    }
  });



  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.username);
    delete users[socket.userId];
    console.log('Users connected:', users);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log('Server listening on *:3000');
});
