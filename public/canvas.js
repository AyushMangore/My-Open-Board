// The HTML <canvas> element is used to draw graphics, on the fly, via JavaScript.

// The <canvas> element is only a container for graphics. You must use JavaScript to actually draw the graphics.

// Canvas has several methods for drawing paths, boxes, circles, text, and adding images.

// setting canvas width and height as same as that of our window width and height
let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// selecting all the operations that will affect the drawing like pencil color
// pencil width, eraser width, undo, redo
let pencilcolor = document.querySelectorAll(".pencil-color");
let pencilwidthElem = document.querySelector(".pencil-width");
let eraserwidthElem = document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

// default color of pencil will be red and eraser will be white
// default width of the pencil and eraser will be same as that we have kept there in html element
let pencolor = "red";
let erasercolor = "white";
let penwidth = pencilwidthElem.value;
let eraserwidth = eraserwidthElem.value;

// we will collect undo element in this array
let undoredoTracker = []; // data
let track = 0; // represent action from track array

let mousedown = false;

// API
let tools = canvas.getContext("2d");// api

// stroke style is the method to set color
// line width is the method to set line width
tools.strokeStyle = pencolor;
tools.lineWidth = penwidth;

// mouse down -> start new path
// mouse move -> path fill (graphics)

canvas.addEventListener("mousedown", (e) => {
    mousedown = true;
    // beginPath({
    //     x: e.clientX,
    //     y: e.clientY
    // })
    // whenever mousedown happen then we will fetch out start location of the drawing therefore
    // storing x and y axis of the mouse cursor in data object and passing it to begin path function
    let data = {
        x: e.clientX,
        y: e.clientY
    }
    // sending to server
    // emit() to send a message to all the connected clients. 
    // This code will notify when a user connects to the server.
    socket.emit("beginPath",data);
})
// whereever our mouse pointer will move line will be drawn 
// first we will check whether mouse down is true or not
canvas.addEventListener("mousemove", (e) =>{
    if(mousedown){
        // if mousedown is true then we will collect all information in an object
        // like location and color, width and pass it to draw Stroke function
        let data = {
            x: e.clientX,
            y: e.clientY,
            color : eraserFlag ? erasercolor : pencolor,
            // eraser width will only be selected if eraser is selected
            width : eraserFlag ? eraserwidth : penwidth
        }
        // will emit to server
        socket.emit("drawStroke",data);
    }
})
// if user will release the mouse then flag will be false and we store this instance in our undo redo tracker array
// creating a url of the canvas and set our track to new updated length of the array
canvas.addEventListener("mouseup", (e) => {
    mousedown = false;

    let url = canvas.toDataURL();
    undoredoTracker.push(url);
    track = undoredoTracker.length-1;
})

// below is the insights to use canvas
// tools.beginPath(); // new graphic (path) (line)
// tools.moveTo(10,10); // start point
// tools.lineTo(100,150);// end point
// tools.stroke();// fill color or graphic

// tools.strokeStyle = "lightblue";
// tools.beginPath();
// tools.moveTo(110,151);
// tools.lineTo(250,250);
// tools.stroke();

// When undo will be clicked, we have to use last track and set our canvas to the last track
undo.addEventListener("click", (e) => {
    undo.classList.add("scale-capture");


    // decrementing if track is positive
    if(track > 0){
        track--;
    }

    // we will create a objet of the current track and array andn pass it to undoredocanvas function
    let data = {
        trackValue : track,
        undoredoTracker
    }
    // undoredocanvas(trackObj);

    socket.emit("redoUndo",data);


    setTimeout(() => {
        undo.classList.remove("scale-capture");
    }, 500);
})

// if redo will be clicked then reverse operation than that of undo will take place
// instead of decrementing, we will increment the track value 
redo.addEventListener("click", (e) => {
    redo.classList.add("scale-capture");
    if(track < undoredoTracker.length-1){
        track++;
    }

    let data = {
        trackValue : track,
        undoredoTracker
    }

    socket.emit("redoUndo",data);
    // undoredocanvas(trackObj);
    setTimeout(() => {
        redo.classList.remove("scale-capture");
    }, 500);
})

// with the help of the track object, track and array will be updated
function undoredocanvas(trackObj){
    track = trackObj.trackValue;
    undoredoTracker = trackObj.undoredoTracker;

    // now as we know, we have stored the canvas urls in the array
    // simply we will fetch the url stored in particular track
    // then we will create a image reference and pass image source as our url then we will load our
    // image as a canvas drawing on the full screen on the window
    let url = undoredoTracker[track];
    let img = new Image(); // reference
    img.src = url;
    img.onload = (e) => {
        tools.drawImage(img,0,0,canvas.width,canvas.height);
    }

}


// we will begin our drawing with the help of beginPath function and move our pointer 
// to x and y axis of passed object
function beginPath(strokeObj){
    tools.beginPath();
    tools.moveTo(strokeObj.x,strokeObj.y);// start point
}

// here we will set color and width and also mention the end of the line in lineto function
function drawStroke(strokeObj){
    tools.strokeStyle = strokeObj.color;
    tools.lineWidth = strokeObj.width;
    tools.lineTo(strokeObj.x,strokeObj.y);// end point
    tools.stroke();// fill color
}

// we have three color options in the pencil we will iterate through them
// and attacth a click listener and which ever is clicked, its first class list will be collected
// and we will set it as our pen color and also we will update the tools stroke style color at the same time
pencilcolor.forEach((colorElem) => {
    colorElem.addEventListener("click", (e) => {
        pencilcolor.forEach((color) => {
            color.style.border = "none";
        })
        colorElem.style.border = "2px solid white";
        let color = colorElem.classList[0];
        pencolor = color;
        tools.strokeStyle = pencolor;
    })
})

// whenever pencil width will be changed we will modify our pen width and tools linewidth
pencilwidthElem.addEventListener("change", (e) => {
    penwidth = pencilwidthElem.value;
    tools.lineWidth = penwidth;
})
// whenevr eraser width will be changed we will modify our eraser width and tools linewidth
eraserwidthElem.addEventListener("change", (e) => {
    eraserwidth = eraserwidthElem.value;
    tools.lineWidth = eraserwidth;
})

// whenever eraser will be clicked, if eraser flag is true then we will set stroke style to eraser color
// and line width to eraser width or else we will set stroke to pencolor and linewidth to penwidth
eraser.addEventListener("click" ,(e) => {
    if(eraserFlag){
        tools.strokeStyle = erasercolor;
        tools.lineWidth = eraserwidth;
    }else{
        tools.strokeStyle = pencolor;
        tools.lineWidth = penwidth;
    }
})

// if download button is clicked we will simply make an anchor element
// and with the help of canvas.toDataURL function we will generate url of the canvas
// and set the href of anchor element to url and file name to board.jpg and implicitly
// click the anchor element
download.addEventListener("click", (e) => {
    download.classList.add("scale-capture");

    let url = canvas.toDataURL();
    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();

    setTimeout(() => {
        download.classList.remove("scale-capture");
    }, 500);
})

// to know socket has sent me some data
// on() Start listening for socket events from Sails with the specified eventName . 
// Triggers the provided callback function when a matching event is received.
// begin path
socket.on("beginPath", (data) => {
    // data is the data which we are receiving through server
    // we will call the function associated with "beginPath" event
    beginPath(data);
})
// on draw stroke event
socket.on("drawStroke", (data) => {
    // data is the data which we are receiving through server
    // we will call the function associated with "drawStroke" event
    drawStroke(data);
})
// redo undo
socket.on("redoUndo", (data) => {
    // we will call the function associated with "redoUndo" event
    undoredocanvas(data);
})