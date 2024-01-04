const express = require("express"); // Access
const socket = require("socket.io");

const app = express(); //Initialized and server ready

app.use(express.static("public"));

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200
};
app.use(require("cors")(corsOptions));

let port = process.env.PORT || 5001;
let server = app.listen(port, () => {
  console.log("Listening to port" + port);
});

let io = socket(server, {
  cors: {
    origin: "*",
    methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
    credentials: false,
  },
});

io.on("connection", (socket) => {
  console.log("Made socket connection");

  socket.on("beginPath", (data) => {
    io.sockets.emit("beginPath", data);
  });
  socket.on("drawPath", (data) => {
    io.sockets.emit("drawPath", data);
  });
  socket.on("undoRedoCanvas", (data) => {
    io.sockets.emit("undoRedoCanvas", data);
  });
});
