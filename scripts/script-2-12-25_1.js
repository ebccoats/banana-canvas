
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

class AnimationMaker {
    constructor(sprite_set) {
        this.frames = sprite_set;
        this.currentFrame = 0;
    }

    nextFrame() {
        if (this.currentFrame == this.frames.length - 1) {
            this.currentFrame = 0;
        } else {
            this.currentFrame++;
        }
    }

    drawFrame(ctx, x, y, scale) {
        let frame = new Image();
        frame.src = character_path + this.frames[this.currentFrame];
        frame.onload = function() {
            ctx.drawImage(frame, x, y, scale, scale);
        }
    }
}

function animation_Maker(sprite_set) {
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

let banana_animation;
let click_banana = canvasMaker("manual-animation");

let autonomous_banana_animation;
let autonomous_banana = canvasMaker("not-flashing-animation");

let flashy_banana_animation;
let flashy_banana = canvasMaker("flashing-animation");

function handle_with_functions() {
    banana_animation = new animation_Maker(banana_sprites, "placeholder"); 
    autonomous_banana_animation = new animation_Maker(banana_sprites, "placeholder");
    flashy_banana_animation = new animation_Maker(banana_sprites, "placeholder");
}

function handle_with_classes() {
    banana_animation = new AnimationMaker(banana_sprites, "placeholder"); 
    autonomous_banana_animation = new AnimationMaker(banana_sprites, "placeholder");
    flashy_banana_animation = new AnimationMaker(banana_sprites, "placeholder");
}

function draw_on_load() {
    handle_with_functions();
    click_banana.ctx.clearRect(0, 0, 200, 200);
    banana_animation.drawFrame(click_banana.ctx, 0, 0, 200);
    banana_animation.nextFrame();
}

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

const frames_button = document.getElementById("manual-next-frame");
const class_button = document.getElementById("use-classes");
const functions_button = document.getElementById("use-functions");

window.addEventListener("load", draw_on_load);
frames_button.addEventListener("click", draw_on_click);
class_button.addEventListener("click", handle_with_classes);
functions_button.addEventListener("click", handle_with_functions);

window.setInterval(draw_on_timer, 500);