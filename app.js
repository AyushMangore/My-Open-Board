// download express
// npm install express
// download socket.io
// npm install socket.io
// first we will require express and socket
const express = require("express");
const socket = require("socket.io");

const app = express(); // reference of app (initialization)

// as our index page is stored in public folder in the same directory
app.use(express.static("public")); // to connect to our index html page

// selecting a port
let port = process.env.PORT || 5000;

// start listening to the port
let server = app.listen(port, () => {
    console.log("Listening to port : "+port); // to start server node app.js
})

let io = socket(server); // to make a connection with server
// socket will connect all the station with the port
// event 
io.on("connection", (socket) => {
    console.log("Connection Established");

    // received some data through socket
    // to identify
    socket.on("beginPath",(data) => {
        // now we have identified that data is received
        // we are triggering function beginPath()
        // now we have to transfer to all the stations
        // this will be managed by socket
        // transfering to all : - >
        // emit() to send a message to all the connected clients. 
        // This code will notify when a user connects to the server
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