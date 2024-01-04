const express = require("express"); // Access
const socket = require("socket.io");

const app = express(); //Initialized and server ready

app.use(express.static("public"));
//app.use(require("cors")({ origin: "*" }));

let port = process.env.PORT || 5001;
let server = app.listen(port, () => {
  console.log("Listening to port" + port);
});

let io = socket(server, {
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    }
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
