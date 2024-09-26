// Node Server which will handle socket.io connections

const io = require("socket.io")(8000, {
  cors: {
    origin: "*",
  },
});

const users = {};

io.on("connection", (socket) => {
  // Event when a new user joins
  socket.on("new-user-joined", (name) => {
    console.log("New User Joined: ", name);
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  // Event when a user sends a message
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  // Event when a user disconnects
  socket.on("disconnect", () => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});
