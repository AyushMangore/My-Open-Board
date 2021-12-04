// download express
// npm install express
// download socket.io
// npm install socket.io

const express = require("express");
const socket = require("socket.io");

const app = express(); // reference of app (initialization)

app.use(express.static("public")); // to connect to our index html page

let port = process.env.PORT || 5000;

let server = app.listen(port, () => {
    console.log("Listening to port : "+port); // to start server node app.js
})

let io = socket(server); // to make a connection with server
// socket will connect al the station with the port
// event 
io.on("connection", (socket) => {
    console.log("Connection Established");

    // received some data through socket
    // to identify
    socket.on("beginPath",(data) => {
        // now we have identified that data is received
        // we are triggering function beginPath()
        // now we have to transfer to all the stations
        // this will be managed bu socket
        // transfering to all : - >
        io.sockets.emit("beginPath",data);
    })

    // triggering event of drawstroke
    socket.on("drawStroke",(data) => {
        io.sockets.emit("drawStroke",data);
    })

    // redo undo
    socket.on("redoUndo", (data) => {
        io.sockets.emit("redoUndo",data);
    })
})
// nodemon will handle the app crash
// npm install --save-dev nodemon
// nodemon app.js