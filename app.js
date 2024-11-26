// const http = require("http");
// const express =  require("express");
// const port = 4500 || process.env.PORT;
// const cors = require("cors");



// const socketID = require("socket.io");
// const { user } = require("../frontend/src/component/Join/Join");

// const app = express();
// const users = [{}];

// app.use(cors());
// const server = http.createServer(app);

// const io = socketID(server);

// io.on("connection",(socket)=>{
//     console.log("Client connected");

//     socket.on('joined' ,({user})=>{
//         users[socket.id] = user;
//         console.log(`${user} joined`);
//     })
//     socket.emit('welcome', {user: "Admin",message:"welcome to chat"});
// })

// server.listen(port , ()=>{
//     console.log(`server is running on port ${port}`);
// })

const http = require("http");
const express = require("express");
const cors = require("cors");
const socketID = require("socket.io");

const port = process.env.PORT || 4500;
const app = express();

const users = {}; // Use an object to store users with socket IDs as keys

app.use(cors());
const server = http.createServer(app);
const io = socketID(server);

io.on("connection", (socket) => {
  console.log("Client connected");

  // Handle when a user joins
  socket.on("joined", ({ user }) => {
    users[socket.id] = user; // Map socket ID to the username
    console.log(`${user} joined`);
    
    // Welcome message to the user
    socket.emit("welcome", { user: "Admin", message: "Welcome to the chat!" });

    // Notify other users (optional)
    socket.broadcast.emit("userJoined", { user:"Admin", message: `${user} has joined the chat` });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`${users[socket.id]} disconnected`);
    delete users[socket.id]; // Remove user from the object
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
