var character_path = "../images/characters/"
var banana_sprites = ["banana00.png", "banana01.png", "banana02.png", "banana03.png"];

function canvasMaker(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false; // Disable smoothing
        ctx.mozImageSmoothingEnabled = false; // For Firefox support
        ctx.webkitImageSmoothingEnabled = false; // For Safari/Chrome support
        ctx.msImageSmoothingEnabled = false; // For IE/Edge support
        return {
            canvas_: canvas,
            ctx: ctx
        }
    } else {
        console.log("canvas unsupported")
        // canvas-unsupported code here
    }
}

// TODO add timing source argument to maker
function animationMaker(sprite_set) {
    this.frames = sprite_set;
    this.frame_timing = [1, 1, 1, 1];
    this.currentFrame = 0;
    this.nextFrame = function() {  // QUESTION: is there a cleaner way to do this?
        if (this.currentFrame == (this.frames.length - 1)) {
            this.currentFrame = 0;
        } else {
            this.currentFrame = this.currentFrame + 1; // isn't there something like += that just increments by 1?
        } 
    }
    
    this.drawFrame = function(ctx, x, y, scale) {
        frame = new Image();
        frame.src = character_path + this.frames[this.currentFrame];
        frame.onload = function() {
            ctx.drawImage(frame, x, y, scale, scale); 
        };
    }

}

var banana_animation = new animationMaker(banana_sprites, "placeholder"); 
var click_banana = canvasMaker("click_banana");

var autonomous_banana_animation = new animationMaker(banana_sprites, "placeholder");
var autonomous_banana = canvasMaker("autonomous_banana");

var flashy_banana_animation = new animationMaker(banana_sprites, "placeholder");
var flashy_banana = canvasMaker("flashy_banana");

function draw_on_click() {
    click_banana.ctx.clearRect(0, 0, 200, 200);
    banana_animation.drawFrame(click_banana.ctx, 0, 0, 200);
    banana_animation.nextFrame();
}

function draw_on_timer() {
    autonomous_banana_animation.drawFrame(autonomous_banana.ctx, 0, 0, 200);
    autonomous_banana.ctx.clearRect(0, 0, 200, 200); // move this into the canvas handler
    autonomous_banana_animation.drawFrame(autonomous_banana.ctx, 0, 0, 200);
    autonomous_banana_animation.nextFrame();

    flashy_banana.ctx.clearRect(0, 0, 200, 200);
    flashy_banana_animation.drawFrame(flashy_banana.ctx, 0, 0, 200);
    flashy_banana_animation.nextFrame();
}

const frames_button = document.getElementById("next-frame");

window.addEventListener("load", draw_on_click);
frames_button.addEventListener("click", draw_on_click);
window.setInterval(draw_on_timer, 300);