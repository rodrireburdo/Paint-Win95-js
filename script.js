// Constants
const MODES = {
    DRAW: "draw",
    ERASE: "erase",
    RECTANGLE: "rectangle",
    ELLIPSE: "ellipse",
    LINE: "line",
};

// Utilities
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelector(selector);

// Elements
const $canvas = $("#canvas");
const $colorPicker = $("#color-picker");
const $clearBtn = $("#clear-btn");
const $drawBtn = $("#draw-btn");
const $rectangleBtn = $("#rectangle-btn");
const $ellipseBtn = $("#ellipse-btn");
const $eraseBtn = $("#erase-btn");
const $lineBtn = $("#line-btn");
const ctx = $canvas.getContext("2d");

// State
let isDrawing = false;
let startX, startY;
let lastX = 0;
let lastY = 0;
let mode = MODES.DRAW;
let imageData;

// Events
$canvas.addEventListener("mousedown", startDrawing);
$canvas.addEventListener("mousemove", draw);
$canvas.addEventListener("mouseup", stopDrawing);
$canvas.addEventListener("mouseleave", stopDrawing);

$colorPicker.addEventListener("change", handleChangeColor);
$clearBtn.addEventListener("click", clearCanvas);

$drawBtn.addEventListener("click", () => {
    setMode(MODES.DRAW);
});

$rectangleBtn.addEventListener("click", () => {
    setMode(MODES.RECTANGLE);
});

$ellipseBtn.addEventListener("click", () => {
    setMode(MODES.ELLIPSE);
});

$eraseBtn.addEventListener("click", () => {
    setMode(MODES.ERASE);
});

$lineBtn.addEventListener("click", () => {
    setMode(MODES.LINE);
});

// Methods
function startDrawing(event) {
    isDrawing = true;

    const { offsetX, offsetY } = event;

    // Guardar las coordenadas iniciales
    [startX, startY] = [offsetX, offsetY];
    [lastX, lastY] = [offsetX, offsetY];

    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function draw(event) {
    if (!isDrawing) return;

    const { offsetX, offsetY } = event;

    if (mode === MODES.DRAW || mode === MODES.ERASE) {
        // Comenzar a dibujar
        ctx.beginPath();

        // Mover el trazado a las nuevas coordenadas
        ctx.moveTo(lastX, lastY);

        // Dibujar una línea entre las coordenadas
        ctx.lineTo(offsetX, offsetY);

        ctx.stroke();

        // Actualizar las coordenadas
        [lastX, lastY] = [offsetX, offsetY];

        return;
    }

    if (mode === MODES.RECTANGLE) {
        ctx.putImageData(imageData, 0, 0);

        const width = offsetX - startX;
        const height = offsetY - startY;

        ctx.beginPath();
        ctx.rect(startX, startY, width, height);
        ctx.stroke();
        return;
    }

    if (mode === MODES.ELLIPSE) {
        ctx.putImageData(imageData, 0, 0);

        const radiusX = (offsetX - startX) / 2;
        const radiusY = (offsetY - startY) / 2;
        const centerX = startX + radiusX;
        const centerY = startY + radiusY;

        ctx.beginPath();
        ctx.ellipse(centerX, centerY, Math.abs(radiusX), Math.abs(radiusY), 0, 0, Math.PI * 2);
        ctx.stroke();
        return;
    }

    if (mode === MODES.LINE) {
        ctx.putImageData(imageData, 0, 0); 
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
        return;
    }
}

function stopDrawing() {
    isDrawing = false;
}

function handleChangeColor() {
    const { value } = $colorPicker;
    ctx.strokeStyle = value;
}

function clearCanvas() {
    ctx.clearRect(0, 0, $canvas.width, $canvas.height);
}

function setMode(newMode) {
    mode = newMode;
    // Limpiar el botón activo
    $("button.active")?.classList.remove("active");

    if (mode === MODES.DRAW) {
        $drawBtn.classList.add("active");
        canvas.style.cursor = "url(./cursors/pincel.png) 0 24, auto";
        ctx.globalCompositeOperation = "source-over";
        ctx.lineWidth = 1;
        return;
    }

    if (mode === MODES.RECTANGLE) {
        $rectangleBtn.classList.add("active");
        canvas.style.cursor = "url(./cursors/point.png), auto";
        ctx.globalCompositeOperation = "source-over";
        ctx.lineWidth = 1;
        return;
    }

    if (mode === MODES.ELLIPSE) {
        $ellipseBtn.classList.add("active");
        canvas.style.cursor = "url(./cursors/point.png), auto";
        ctx.globalCompositeOperation = "source-over";
        ctx.lineWidth = 1;
        return;
    }

    if (mode === MODES.ERASE) {
        $eraseBtn.classList.add("active");
        canvas.style.cursor = "url(./cursors/erase.png) 0 20, auto";
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = 15;
        return;
    }

    if (mode === MODES.LINE) {
        $lineBtn.classList.add("active");
        canvas.style.cursor = "url(./cursors/point.png)";

        ctx.globalCompositeOperation = "source-over";
        ctx.lineWidth = 1;
        return;
    }
}

// Init
setMode(MODES.DRAW);
$colorPicker.value = "#000000";
