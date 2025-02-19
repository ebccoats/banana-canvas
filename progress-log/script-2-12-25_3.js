var character_path = "../images/characters/";
var banana_sprites = ["banana00.png", "banana01.png", "banana02.png", "banana03.png"];


// for tomorrow: make every entity object have its own offscreen canvas to draw its animations on. Then it can easily flip the offscreen canvas. 
function draw_flipped() {
    const offscreen = new OffscreenCanvas(40, 40);
    const off_ctx = offscreen.getContext("2d");

    const canvas_big = document.getElementById("game-field");
    const ctx_big = canvas_big.getContext("2d");
    if (canvas_big.getContext) {
        // drawing code here    
        drawing1 = new Image();
        drawing1.src = character_path + banana_sprites[0]; 
        drawing1.onload = function() {
            off_ctx.translate(offscreen.width, 0);
            off_ctx.scale(-1, 1);
            off_ctx.drawImage(drawing1, 0, 0);
            off_ctx.setTransform(1, 0, 0, 1, 0, 0); // Resets transformation

            ctx_big.drawImage(offscreen, 0, 0, 200, 200);
        };
    }
}

window.addEventListener("load", draw_flipped);