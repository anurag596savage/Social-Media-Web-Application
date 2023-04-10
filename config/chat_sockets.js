module.exports.chatSockets = (socketServer) => {
  let io = require("socket.io")(socketServer);
  io.sockets.on("connection", (socket) => {
    console.log("New connection received with the id : ", socket.id);

    socket.on("disconnect", () => {
      console.log("Socket disconnected!");
    });

    socket.on("join_room", (data) => {
      console.log("Joining request received: ", data);
      socket.join(data.chatroom);
      io.in(data.chatroom).emit("user_joined", data);
    });

    socket.on("send_message", (data) => {
      io.in(data.chatroom).emit("receive_message", data);
    });
  });
};
