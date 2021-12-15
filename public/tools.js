// Acquring the reference of tools and options container with the help of query selector
let toolsCont = document.querySelector(".tools-cont");
let optionsCont = document.querySelector(".options-cont");
// Acquring the reference of pencil and eraser container with the help of query selector
let penciltoolCont = document.querySelector(".pencil-tool-cont");
let erasertoolCont = document.querySelector(".eraser-tool-cont");
// Acquring the reference of pencil and tool with the help of query selector
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
// Acquring the reference of sticky notes container with the help of query selector
let sticky = document.querySelector(".sticky");

// we will select and unselect penicl and eraser by toggling the two flags
let pencilFlag = false;
let eraserFlag = false;
// option flag for displaying and hiding the options tab
let optionsFlag = true;
// Acquring the reference of upload container with the help of query selector
let upload = document.querySelector(".upload");

// show : true
// hide : false
// Whenever user will click on hamburger icon, we have to hide the options tab
// if visible initially or vice versa
// we have created separate functions for that
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
// when this function will be called we will change our display style to flex of the tool box
function opentools() {
    let iconElem = optionsCont.children[0];
    iconElem.classList.remove("fa-times");
    iconElem.classList.add("fa-bars");
    toolsCont.style.display = "flex";
}
// when this function will be called we will change our display style to none of the tool box
function closetools() {
    let iconElem = optionsCont.children[0];
    iconElem.classList.add("fa-times");
    iconElem.classList.remove("fa-bars");
    toolsCont.style.display = "none";

    penciltoolCont.style.display = "none";
    erasertoolCont.style.display = "none";
}

// below is the click listener on pencil icon when ever it will be clicked 
// then we have to display the container for width and color of the pencil
// or if already displayed then we have to hide we can simply toggle out pencil flag
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

// whenever eraser will be clicked then width option will appear or hide here also we will use eraser flag for toggling
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

// whenever upload button will be clicked then we will make a html element with the help
// of create input element function and set our type to file and implicitly click it, this will
// browse thee files in  the computer from where user can select any imagae to upload 
upload.addEventListener("click", (e) =>{
    upload.classList.add("scale-capture");
    let input = document.createElement("input");
    input.setAttribute("type","file");
    input.click();
    // input tag has a listener called change which denoted file is uploaded then we will read single
    // file multiple files can also be reead the nwe will create a url with the help URL.createobjectURL function
    // now to display the image we have to create a div element for this we will write our html and store it in a 
    // variable and set our image source as the url and finally we will call a function create sticky
    // because we will display our image as a sticky note
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

// below function is used to display sticky notes
// first we will create a div element and set a class then we will paste the inner html
// of this div tag same as that of p[assed in paramaeter now we will append our sticky element
// in document body, now our sticky element has two options one for minimizing and one for removing
// these functionality will be handled in sepaate function,drag and drop feature has been also implemented
// in different function called drag and drop
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
// if sticky icon is clicked then we have to create a sticky element but not with the image container
// but with the text area container, one line will change instead of image tag we will use textarea tag
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

// if remove is clicked simply remove the whole html element
// if minimize is clicked then we will select our note container and toggle 
// its display property if earlier it was block the nwe will set it to none or vice versa
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

// mouse down is the event and sticky container is the element
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
      
        // where ever mouse will point element will follow
        function onMouseMove(event) {
          moveAt(event.pageX, event.pageY);
        }
      
        // move the element on mousemove
        document.addEventListener('mousemove', onMouseMove);
      
        // drop the element, remove unneeded handlers
        element.onmouseup = function() {
          document.removeEventListener('mousemove', onMouseMove);
          element.onmouseup = null;
        };
}