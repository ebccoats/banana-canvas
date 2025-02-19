var character_path = "../images/characters/"
var banana_sprites = ["banana00.png", "banana01.png", "banana02.png", "banana03.png"];

function draw() {
    const canvas1 = document.getElementById("tiny_banana");
    if (canvas1.getContext) {
        const ctx1 = canvas1.getContext("2d");
        // drawing code here    
        drawing1 = new Image();
        drawing1.src = character_path + banana_sprites[0]; 
        drawing1.onload = function() {
            ctx1.drawImage(drawing1, 0, 0);
        }
    } else {
        // canvas-unsupported code here
    }
 
    const canvas2 = document.getElementById("blurry_banana");
    if (canvas2.getContext) {
        const ctx2 = canvas2.getContext("2d");
        // drawing code here    
        drawing2 = new Image();
        drawing2.src = character_path + banana_sprites[0]; 
        drawing2.onload = function() {
            ctx2.drawImage(drawing2, 0, 0, 200, 200);
        }
    } else {
        // canvas-unsupported code here
    }
  
    const canvas = document.getElementById("banana");
    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false; // Disable smoothing
        ctx.mozImageSmoothingEnabled = false; // For Firefox support
        ctx.webkitImageSmoothingEnabled = false; // For Safari/Chrome support
        ctx.msImageSmoothingEnabled = false; // For IE/Edge support
        // drawing code here    
        drawing = new Image();
        drawing.src = character_path + banana_sprites[0]; 
        drawing.onload = function() {
            ctx.drawImage(drawing, 0, 0, 200, 200);
        }
    } else {
        // canvas-unsupported code here
    }
}

window.addEventListener("load", draw);