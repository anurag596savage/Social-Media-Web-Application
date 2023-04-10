class ChatEngine {
  constructor(chatBoxId, userEmail) {
    this.chatBox = $(`.${chatBoxId}`);
    this.userEmail = userEmail;

    this.socket = io.connect("http://localhost:3000");
    if (this.userEmail) {
      this.connectionHandler();
    }
  }

  connectionHandler = () => {
    let self = this;
    this.socket.on("connect", () => {
      console.log("Connection established using sockets!");

      self.socket.emit("join_room", {
        user_email: self.userEmail,
        chatroom: "Codeial",
      });

      self.socket.on("user_joined", (data) => {
        console.log("New user has joined: ", data);
      });
    });

    $(".send-message-button").click(() => {
      let message = $(".send-message-input").val();
      if (message != " ") {
        self.socket.emit("send_message", {
          message: message,
          user_email: self.userEmail,
          chatroom: "Codeial",
        });
      }
    });

    self.socket.on("receive_message", (data) => {
      console.log("Message received: ", data);
      let newMessage = $("<span>", {
        html: data.message,
      });
      let messageType = "other-message";
      if (data.user_email == self.userEmail) {
        messageType = "self-message";
      }
      newMessage.addClass(messageType);
      $(".message-list").append(newMessage);
    });
  };
}
