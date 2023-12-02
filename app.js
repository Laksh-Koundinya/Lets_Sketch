let menuContainer = document.querySelector(".options-cont");
let toolsList = document.querySelector(".tools-cont");
let functCont = document.querySelector(".funct-comt");
let pencilCont = document.querySelector(".pencil-functionality");
let eraserCont = document.querySelector(".eraser-box");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let upload = document.querySelector(".upload");
let sticky = document.querySelector(".sticky");
let stickyNoteOpen = false;
let pencilOpen = false;
let eraserOpen = false;
let menuClicked = true;

menuContainer.addEventListener("click", (ev) => {
  console.log("DKK", eraserOpen);
  menuClicked = !menuClicked;
  pencilOpen = !pencilOpen;
  let iconElem = menuContainer.children[0];
  if (menuClicked) {
    iconElem.classList.remove("fa-times");
    iconElem.classList.add("fa-bars");
    toolsList.style.display = "flex";
  } else {
    iconElem.classList.remove("fa-bars");
    iconElem.classList.add("fa-times");
    toolsList.style.display = "none";
    eraserCont.style.display = "none";
    pencilCont.style.display = "none";
  }
});

pencil.addEventListener("click", (e) => {
  pencilOpen = !pencilOpen;
  if (pencilOpen) pencilCont.style.display = "block";
  else pencilCont.style.display = "none";
});

eraser.addEventListener("click", (e) => {
  eraserOpen = !eraserOpen;
  if (eraserOpen) eraserCont.style.display = "flex";
  else eraserCont.style.display = "none";
});

sticky.addEventListener("click", (e) => {
  let stickyTemplateHTML = `
    <div class="cont-header">
        <div class="minimise"></div>
        <div class="close"></div>
    </div>
    <div class="sticky-content">
        <textarea spellcheck="false"></textarea>
    </div>
    `;
  let stickyCont = document.createElement("div");
  stickyCont.setAttribute("class", "cont-note");
  stickyCont.innerHTML = stickyTemplateHTML;
  document.body.appendChild(stickyCont);

  let minimise = stickyCont.querySelector(".minimise");
  let close = stickyCont.querySelector(".close");
  performActions(minimise, close, stickyCont);

  stickyCont.onmousedown = function (event) {
    dragAndDrop(stickyCont, event);
  };

  stickyCont.ondragstart = function () {
    return false;
  };
});

upload.addEventListener("click", (e) => {
  let inputTag = document.createElement("input");
  inputTag.setAttribute("type", "file");
  inputTag.setAttribute("accept","image/png, image/gif, image/jpeg")
//   accept=
  inputTag.click();
  inputTag.addEventListener("change", (ev) => {
    let file = inputTag.files[0];
    let url = URL.createObjectURL(file);
    let imageTemplateHTML = `
        <div class="cont-header">
            <div class="minimise"></div>
            <div class="close"></div>
        </div>
        <div class="sticky-content">
        <img src="${url}"/>
        </div>
        `;
    let imageCont = document.createElement("div");
    imageCont.setAttribute("class", "cont-note");
    imageCont.innerHTML = imageTemplateHTML;
    document.body.appendChild(imageCont);
    let minimise = imageCont.querySelector(".minimise");
    let close = imageCont.querySelector(".close");
    performActions(minimise, close, imageCont);
    imageCont.onmousedown = function (event) {
      dragAndDrop(imageCont, event);
    };

    imageCont.ondragstart = function () {
      return false;
    };
  });
});

function dragAndDrop(element, event) {
  let shiftX = event.clientX - element.getBoundingClientRect().left;
  let shiftY = event.clientY - element.getBoundingClientRect().top;

  element.style.position = "absolute";
  element.style.zIndex = 1000;

  moveAt(event.pageX, event.pageY);

  // moves the ball at (pageX, pageY) coordinates
  // taking initial shifts into account
  function moveAt(pageX, pageY) {
    element.style.left = pageX - shiftX + "px";
    element.style.top = pageY - shiftY + "px";
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // move the ball on mousemove
  document.addEventListener("mousemove", onMouseMove);

  // drop the ball, remove unneeded handlers
  element.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    element.onmouseup = null;
  };
}

function performActions(minimise, close, stickyCont) {
  close.addEventListener("click", (e) => {
    stickyCont.remove();
  });
  minimise.addEventListener("click", (e) => {
    let noteContainer = stickyCont.querySelector(".sticky-content");
    let display = getComputedStyle(noteContainer).getPropertyValue("display");
    if (display === "none") noteContainer.style.display = "block";
    else noteContainer.style.display = "none";
  });
}
