const express = require("express");
const cors = require("cors");
const app = express();
const uniqid = require("uniqid");
const port = 8000;

const messages = [
  {
    id: uniqid(),
    author: "server",
    text: "Welcome in wild chat",
  },
];

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "DELETE", "PUT"],
};

app.use(cors(corsOptions));

const server = app.listen(port, () =>
  console.log(`app listening at http://localhost:${port}`)
);

const io = require("socket.io")(server, {
  cors: corsOptions,
});

io.on("connect", (socket) => {
  console.log("user is connected");
  socket.on("disconnect", () => {
    console.log("user is disconnected");
  });
  socket.emit("initialMessageList", messages);
  socket.on("messageFromClient", (messageTextAuthor) => {
    const message = {
      id: uniqid(),
      ...messageTextAuthor,
    };
    messages.push(message);
    io.emit("messageFromServer", messages);
  });
});
