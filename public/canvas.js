let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilcolor = document.querySelectorAll(".pencil-color");
let pencilwidthElem = document.querySelector(".pencil-width");
let eraserwidthElem = document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

let pencolor = "red";
let erasercolor = "white";
let penwidth = pencilwidthElem.value;
let eraserwidth = eraserwidthElem.value;

let undoredoTracker = []; // data
let track = 0; // represent action from track array

let mousedown = false;

// API
let tools = canvas.getContext("2d");// api


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
    let data = {
        x: e.clientX,
        y: e.clientY
    }
    // sending to server
    socket.emit("beginPath",data);
})
canvas.addEventListener("mousemove", (e) =>{
    if(mousedown){
        let data = {
            x: e.clientX,
            y: e.clientY,
            color : eraserFlag ? erasercolor : pencolor,
            width : eraserFlag ? eraserwidth : penwidth
        }
        // will emit to server
        socket.emit("drawStroke",data);
    }
})
canvas.addEventListener("mouseup", (e) => {
    mousedown = false;

    let url = canvas.toDataURL();
    undoredoTracker.push(url);
    track = undoredoTracker.length-1;
})

// tools.beginPath(); // new graphic (path) (line)
// tools.moveTo(10,10); // start point
// tools.lineTo(100,150);// end point
// tools.stroke();// fill color or graphic

// tools.strokeStyle = "lightblue";
// tools.beginPath();
// tools.moveTo(110,151);
// tools.lineTo(250,250);
// tools.stroke();

undo.addEventListener("click", (e) => {
    undo.classList.add("scale-capture");


    if(track > 0){
        track--;
    }

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

function undoredocanvas(trackObj){
    track = trackObj.trackValue;
    undoredoTracker = trackObj.undoredoTracker;

    let url = undoredoTracker[track];
    let img = new Image(); // reference
    img.src = url;
    img.onload = (e) => {
        tools.drawImage(img,0,0,canvas.width,canvas.height);
    }

}



function beginPath(strokeObj){
    tools.beginPath();
    tools.moveTo(strokeObj.x,strokeObj.y);
}


function drawStroke(strokeObj){
    tools.strokeStyle = strokeObj.color;
    tools.lineWidth = strokeObj.width;
    tools.lineTo(strokeObj.x,strokeObj.y);
    tools.stroke();
}

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

pencilwidthElem.addEventListener("change", (e) => {
    penwidth = pencilwidthElem.value;
    tools.lineWidth = penwidth;
})

eraserwidthElem.addEventListener("change", (e) => {
    eraserwidth = eraserwidthElem.value;
    tools.lineWidth = eraserwidth;
})

eraser.addEventListener("click" ,(e) => {
    if(eraserFlag){
        tools.strokeStyle = erasercolor;
        tools.lineWidth = eraserwidth;
    }else{
        tools.strokeStyle = pencolor;
        tools.lineWidth = penwidth;
    }
})

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

socket.on("beginPath", (data) => {
    // data is the data which we are receiving through server
    beginPath(data);
})
// on draw stroke event
socket.on("drawStroke", (data) => {
    // data is the data which we are receiving through server
    drawStroke(data);
})
// redo undo
socket.on("redoUndo", (data) => {
    undoredocanvas(data);
})