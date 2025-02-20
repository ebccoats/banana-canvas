var character_path = "images/characters/"
var banana_sprites = ["banana00.png", "banana01.png", "banana02.png", "banana03.png"];

function make_banana_appear() {
    const canvas1 = document.getElementById("banana-appears");
    if (canvas1.getContext) {
        const ctx1 = canvas1.getContext("2d");
        ctx1.clearRect(0, 0, canvas1.width, canvas1.height); 
        // drawing code here    
        drawing1 = new Image();
        drawing1.src = character_path + banana_sprites[0]; 
        drawing1.onload = function() {
            ctx1.drawImage(drawing1, 0, 0);
        }
    } else {
        // canvas-unsupported code here
    }
}

function make_banana_bigger() {
    const canvas2 = document.getElementById("resized-but-blurry");
    if (canvas2.getContext) {
        const ctx2 = canvas2.getContext("2d");
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height); 
        // drawing code here    
        drawing2 = new Image();
        drawing2.src = character_path + banana_sprites[0]; 
        drawing2.onload = function() {
            ctx2.drawImage(drawing2, 0, 0, 200, 200);
        }
    } else {
        // canvas-unsupported code here
    }
}

function clear_static_banana_canvases() {
    const canvas2 = document.getElementById("resized-but-blurry");
    if (canvas2.getContext) {
        const ctx2 = canvas2.getContext("2d");
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height); 
    }
    const canvas1 = document.getElementById("banana-appears");
    if (canvas1.getContext) {
        const ctx1 = canvas1.getContext("2d");
        ctx1.clearRect(0, 0, canvas1.width, canvas1.height); 
    }
}

function draw_static_banana() {
    const canvas2 = document.getElementById("resized-not-blurry");
    if (canvas2.getContext) {
        const ctx2 = canvas2.getContext("2d");
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height); 
        ctx2.imageSmoothingEnabled = true; // Disable smoothing
        ctx2.mozImageSmoothingEnabled = true; // For Firefox support
        ctx2.webkitImageSmoothingEnabled = true; // For Safari/Chrome support
        ctx2.msImageSmoothingEnabled = true; // For IE/Edge support
        // drawing code here    
        drawing2 = new Image();
        drawing2.src = character_path + banana_sprites[0]; 
        drawing2.onload = function() {
            ctx2.drawImage(drawing2, 0, 0, 200, 200);
        }
    } else {
        // canvas-unsupported code here
    }
}

function unblur_banana() {
  
    const canvas = document.getElementById("resized-not-blurry");
    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
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

window.addEventListener("load", draw_static_banana);

const add_banana_button = document.getElementById("make-banana-appear");
add_banana_button.addEventListener("click", make_banana_appear);

const resize_banana_button = document.getElementById("make-banana-bigger");
resize_banana_button.addEventListener("click", make_banana_bigger);

const unblur_banana_button = document.getElementById("unblur-banana");
unblur_banana_button.addEventListener("click", unblur_banana);

const reblur_banana_button = document.getElementById("reblur-banana");
reblur_banana_button.addEventListener("click", draw_static_banana);

const clear_static_bananas = document.getElementById("static-banana-clear");
clear_static_bananas.addEventListener("click", clear_static_banana_canvases);