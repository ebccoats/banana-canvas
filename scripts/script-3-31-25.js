
const mainCanvas = document.getElementById("translate-field");

const shortCanvas = document.getElementById("short-field");

const tallCanvas = document.getElementById("tall-field");

const mainCtx = mainCanvas.getContext("2d");
const shortCtx = shortCanvas.getContext("2d");
const tallCtx = tallCanvas.getContext("2d");

// draw rectangles in each one
shortCtx.fillStyle = "red";
tallCtx.fillStyle = "blue";

mainCtx.beginPath();
mainCtx.moveTo(0, 150);
mainCtx.lineTo(500, 150);
mainCtx.stroke();


// place a rectangle at x, y coordinates
shortCtx.fillRect(0, 0, shortCanvas.width - 10, shortCanvas.height - 10);
tallCtx.fillRect(0, 0, tallCanvas.width - 10, tallCanvas.height -10);


mainCtx.translate(0, 150 - shortCanvas.height);


// draw both canvases on main canvas.
mainCtx.drawImage(shortCanvas, 0, 0, shortCanvas.width, shortCanvas.height);
mainCtx.setTransform(1, 0, 0, 1, 0, 0);
mainCtx.translate(0, 150 - tallCanvas.height);
mainCtx.drawImage(tallCanvas, tallCanvas.width, 0, tallCanvas.width, tallCanvas.height);
mainCtx.setTransform(1, 0, 0, 1, 0, 0);