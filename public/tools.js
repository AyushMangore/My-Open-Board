let toolsCont = document.querySelector(".tools-cont");
let optionsCont = document.querySelector(".options-cont");

let penciltoolCont = document.querySelector(".pencil-tool-cont");
let erasertoolCont = document.querySelector(".eraser-tool-cont");

let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");

let sticky = document.querySelector(".sticky");

let pencilFlag = false;
let eraserFlag = false;

let optionsFlag = true;

let upload = document.querySelector(".upload");

// show : true
// hide : false

optionsCont.addEventListener("click", (e) => {
    
    optionsCont.classList.add("scale-capture");

    optionsFlag = !optionsFlag;

    if (optionsFlag) {
        opentools();
    } else {
        closetools();
    }

    setTimeout(() => {
        optionsCont.classList.remove("scale-capture");
    }, 500);

})

// fa-times represents close
function opentools() {
    let iconElem = optionsCont.children[0];
    iconElem.classList.remove("fa-times");
    iconElem.classList.add("fa-bars");
    toolsCont.style.display = "flex";
}
function closetools() {
    let iconElem = optionsCont.children[0];
    iconElem.classList.add("fa-times");
    iconElem.classList.remove("fa-bars");
    toolsCont.style.display = "none";

    penciltoolCont.style.display = "none";
    erasertoolCont.style.display = "none";
}

pencil.addEventListener("click", (e) => {
    pencil.classList.add("scale-capture");
    pencilFlag = !pencilFlag;
    if (pencilFlag) {
        penciltoolCont.style.display = "block";
    } else {
        penciltoolCont.style.display = "none";
    }
    setTimeout(() => {
        pencil.classList.remove("scale-capture");
    }, 500);
})

eraser.addEventListener("click", (e) => {
    eraser.classList.add("scale-capture");
    eraserFlag = !eraserFlag;
    if (eraserFlag) {
        erasertoolCont.style.display = "flex";
    } else {
        erasertoolCont.style.display = "none";
    }
    setTimeout(() => {
        eraser.classList.remove("scale-capture");
    }, 500);
})

upload.addEventListener("click", (e) =>{
    upload.classList.add("scale-capture");
    let input = document.createElement("input");
    input.setAttribute("type","file");
    input.click();

    input.addEventListener("change", (e) => {
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let stickyTemplateHtml = `
        <div class="header-cont">
        <div class="minimize"></div>
        <div class="remove"></div>
        </div>
        <div class="note-cont">
            <img src=${url} />
        </div>
        `;
        createSticky(stickyTemplateHtml);
       
    })
    setTimeout(() => {
        upload.classList.remove("scale-capture");
    }, 500);
})

function createSticky(stickyTemplateHtml){
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-cont scale-tools");
   
    stickyCont.innerHTML = stickyTemplateHtml;

    document.body.appendChild(stickyCont);

    let minimize = stickyCont.querySelector(".minimize");
    let remove = stickyCont.querySelector(".remove");
    noteAction(minimize,remove,stickyCont);

    stickyCont.onmousedown = function(event) {
        dragAnddrop(stickyCont,event);
    };
      
    stickyCont.ondragstart = function() {
        return false;
    };
}

sticky.addEventListener("click", (e) => {
    sticky.classList.add("scale-capture");
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-cont scale-tools");
    
    let stickyTemplateHtml = `
    <div class="header-cont">
    <div class="minimize"></div>
    <div class="remove"></div>
    </div>
    <div class="note-cont">
        <textarea spellcheck="false" ></textarea>
    </div>
    `;
    createSticky(stickyTemplateHtml);
    setTimeout(() => {
        sticky.classList.remove("scale-capture");
    }, 500);
})

function noteAction(minimize,remove,stickyCont){
    remove.addEventListener("click", (e) => {
       
        stickyCont.remove();
        
    })
    minimize.addEventListener("click", (e) => {
   
        let noteCont = stickyCont.querySelector(".note-cont");
        let display = getComputedStyle(noteCont).getPropertyValue("display");
        if(display === "none"){
            noteCont.style.display = "block";
        }else{
            noteCont.style.display = "none";
        }
    })
}

function dragAnddrop(element,event){

    let shiftX = event.clientX - element.getBoundingClientRect().left;
        let shiftY = event.clientY - element.getBoundingClientRect().top;
      
        element.style.position = 'absolute';
        element.style.zIndex = 1000;
    
      
        moveAt(event.pageX, event.pageY);
      
        // moves the ball at (pageX, pageY) coordinates
        // taking initial shifts into account
        function moveAt(pageX, pageY) {
          element.style.left = pageX - shiftX + 'px';
          element.style.top = pageY - shiftY + 'px';
        }
      
        function onMouseMove(event) {
          moveAt(event.pageX, event.pageY);
        }
      
        // move the ball on mousemove
        document.addEventListener('mousemove', onMouseMove);
      
        // drop the ball, remove unneeded handlers
        element.onmouseup = function() {
          document.removeEventListener('mousemove', onMouseMove);
          element.onmouseup = null;
        };
}