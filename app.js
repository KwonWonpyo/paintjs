const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const brush = document.getElementById("jsBrush");
const fill = document.getElementById("jsFill");
const erase = document.getElementById("jsErase");
const cursorFollower = document.getElementById("cursorFollower");
const colors = Array.from(document.getElementsByClassName("sp-colorize"));
const range = document.getElementById("jsRange");
const rangeValue = document.getElementById("jsRangeValue");
const rangePreview = document.getElementById("jsRangePreview");
const savePng = document.getElementById("jsSavePNG");
const saveJpg = document.getElementById("jsSaveJPG");

const INITIAL_COLOR = "#2c2c2c";
const INITIAL_LINEWIDTH = 3.0;
const CANVAS_SIZE = 500;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = INITIAL_LINEWIDTH;

cursorFollower.style.width = INITIAL_LINEWIDTH + "px";
cursorFollower.style.height = INITIAL_LINEWIDTH + "px";

rangeValue.value = INITIAL_LINEWIDTH;
range.value = INITIAL_LINEWIDTH;
rangePreview.style.backgroundColor = INITIAL_COLOR;
rangePreview.style.width = INITIAL_LINEWIDTH + "px";
rangePreview.style.height = INITIAL_LINEWIDTH + "px";
rangePreview.style.top = (20 - INITIAL_LINEWIDTH)/2 + "px";
rangePreview.style.right = (45 - INITIAL_LINEWIDTH)/2 + "px";

// 모드 설정 - 첫 로딩 시 brush
const MODE_BUTTON = [brush, fill, erase];
let mode = brush;
let painting = false;

function startPainting() { painting = true; }
function stopPainting() { painting = false; }

function changeCursor(mode) {
    if(mode === brush) {
        document.body.style.cursor = "url(pencil_big.cur), auto";
    }
    else if(mode === fill) {
        document.body.style.cursor = "url(paint_bucket.cur), auto";
    }
    else if(mode === erase) {
        document.body.style.cursor = "url(eraser.cur), auto";
    }
    else {
        document.body.style.cursor = "auto";
    }
}

function changeColor(color) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    rangePreview.style.backgroundColor = color;
    cursorFollower.style.backgroundColor = color;
}

function onMouseMove(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    if(mode === brush){
        if(!painting) {
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
        else {
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }
    else if(mode === erase){
        if(painting) {
            ctx.clearRect(x-ctx.lineWidth/2, y-ctx.lineWidth/2, ctx.lineWidth, ctx.lineWidth);
        }
    }
}

function handleModeChange(event) {
    mode = event.target;
    changeCursor(mode);

    // 지우개 효과
    if(mode === erase){
        rangePreview.style.backgroundColor = "white";
        cursorFollower.style.backgroundColor = "white";
    }
    else {
        rangePreview.style.backgroundColor = ctx.strokeStyle;
        cursorFollower.style.backgroundColor = ctx.strokeStyle;
    }
    // Button Highlight
    for(i = 0 ; i < MODE_BUTTON.length ; i++){
        var button = MODE_BUTTON[i];
        if(button === mode){
            button.style.backgroundColor = "#3e98ff";
        }
        else {
            button.style.backgroundColor = "white";
        }
    }
}

function handleColorClick(event) {
    const color = event.target.style.backgroundColor;
    changeColor(color);
}

function handleRangeChange(event) {
    const size = event.target.value;
    ctx.lineWidth = size;
    rangeValue.value = size;
    range.value = size;
    rangePreview.style.width = size + "px";
    rangePreview.style.height = size + "px";
    rangePreview.style.top = (20 - size)/2 + "px";
    rangePreview.style.right = (45 - size)/2 + "px";
    cursorFollower.style.width = size + "px";
    cursorFollower.style.height = size + "px";
}

function handleCanvasClick() {
    if (mode === MODE_BUTTON[1]) {
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function handleCM(event) {
    event.preventDefault();
}

function handleSaveClick(event) {
    var image;
    if(event.target === savePng){
        image = canvas.toDataURL();
    }
    else if(event.target === saveJpg){
        image = canvas.toDataURL("image/jpeg");
    }
    const link = document.createElement("a");
    link.href = image;
    link.download = "MyPaint";
    link.click();
}

if (canvas) {
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("contextmenu", handleCM); //우클릭
}

MODE_BUTTON.forEach(mode => mode.addEventListener("click", handleModeChange));

range.addEventListener("input", handleRangeChange);
rangeValue.addEventListener("input", handleRangeChange);
savePng.addEventListener("click", handleSaveClick);
saveJpg.addEventListener("click", handleSaveClick);

document.onmousemove = (e) => {
    cursorFollower.style.left = e.pageX - ctx.lineWidth/2 + "px";
    cursorFollower.style.top = e.pageY - ctx.lineWidth/2 + "px";
}