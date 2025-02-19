const character_path = "images/characters/"
const banana_sprites = ["banana00.png", "banana01.png", "banana02.png"];
const baby_sprites = ["baby00.png", "baby01.png", "baby02.png", "baby03.png"];


class gameCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext("2d");
            this.ctx.imageSmoothingEnabled = false; // Disable smoothing
            this.ctx.mozImageSmoothingEnabled = false; // For Firefox support
            this.ctx.webkitImageSmoothingEnabled = false; // For Safari/Chrome support
            this.ctx.msImageSmoothingEnabled = false; // For IE/Edge support
        } else {
            console.log("canvas unsupported")
            // canvas-unsupported code here
        }
    }
    
}

// make it so animations complete before the character moves x, y
class Entity {
    constructor (x, y, sprites, sprite_width, sprite_height, move_increment) {
        this.animations = [sprites];
        this.currentAnimation = 0;
        this.x = x;
        this.y = y;
        this.scale = 200;
        this.width = sprite_width;
        this.height = sprite_height;
        this.pace = move_increment;
        this.canvas = new OffscreenCanvas(sprite_width, sprite_height);
        this.ctx = this.canvas.getContext("2d");
        this.faceLeft = false;
    }

    move() {
        if (this.animations[this.currentAnimation].animation_inProgress) {
            return;
        } else {
            if (this.faceLeft) { 
                this.x = this.x - this.pace;
            } else {
                this.x = this.x + this.pace;
            }
        }
        
    } 

    flip() {
        if (this.faceLeft) {
            this.faceLeft = false;
        } else {
            this.faceLeft = true;
        }
    }

    // WTF I have no idea why this is not working??????
    // For some reason all the rendering context and flipping has to happen
    // inside the onload = function() brackets inside the animation handler
    drawEntity(ctx) {
        if (this.faceLeft) {
            this.animations[this.currentAnimation].drawLeft(this.ctx, this.canvas);
        } else {
            this.animations[this.currentAnimation].drawRight(this.ctx, this.canvas);
        }

        ctx.drawImage(this.canvas, this.x, this.y, this.scale, this.scale);
        this.animations[this.currentAnimation].nextFrame();

    }

    // make this actually give the center x coordinates of the canvas on the game field
    get centerX() {
        let centerX = this.x;
        return centerX;
    } 

} 

// TODO add timing source argument to maker
// add something to pull in file names, animation names, and timing from a csv
// make it so the animation completes before the character moves x, y coords

// WTF why is one frame missing????

class Animation {
    constructor(sprite_set) {
        this.animation_inProgress = true;
        this.frames = sprite_set;
        this.frame_timing = [1, 1, 1, 1];
        this.currentFrame = 2;
        this.width = 40; // this is hard coded for now
        this.height = 40; // this is hard coded for now
    }
    
    nextFrame() {  // QUESTION: is there a cleaner way to do this?
        if (this.currentFrame < (this.frames.length - 1)) {
            this.animation_inProgress = true;
            this.currentFrame = this.currentFrame + 1;
        } else {
            this.animation_inProgress = false;
            this.currentFrame = 0;
        }
    }
    
    drawRight(parent_ctx, parent_canvas) {

        let frame = new Image();
        frame.src = character_path + this.frames[this.currentFrame];
        frame.onload = function() {
            parent_ctx.clearRect(0, 0, parent_canvas.width, parent_canvas.height);
            parent_ctx.drawImage(frame, 0, 0); 
        };
    }

    drawLeft(parent_ctx, parent_canvas) {
        let frame = new Image();
        frame.src = character_path + this.frames[this.currentFrame];
        frame.onload = function() {
            parent_ctx.clearRect(0, 0, parent_canvas.width, parent_canvas.height);
            parent_ctx.translate(parent_canvas.width, 0);
            parent_ctx.scale(-1, 1);
            parent_ctx.drawImage(frame, 0, 0);
            parent_ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
    }

}

const banana_animation = new Animation(banana_sprites); 
const banana = new Entity(0, 0, banana_animation, 40, 40, 30);
const field_1 = new gameCanvas("game-field");

const baby_animation = new Animation(baby_sprites);
const baby = new Entity(10, 10, baby_animation, 40, 40, 20);

function draw() {
    banana.drawEntity(field_1.ctx);
    baby.drawEntity(field_1.ctx);
    field_1.ctx.clearRect(0, 0, field_1.canvas.width, field_1.canvas.height);
    banana.drawEntity(field_1.ctx);
    baby.drawEntity(field_1.ctx);
    banana.move();
    baby.move();

    if (banana.faceLeft && (banana.centerX() == 0)) {
        banana.flip();
    } else if (banana.centerX() > field_1.canvas.width) {
        banana.flip();
    }

    console.log(baby.centerX())
    console.log(field_1.canvas.width)
    // why does this not work: !??! It works with the banana
    if (baby.faceLeft && (baby.centerX() < 0)) {
        baby.flip();
    } else if (baby.centerX() > field_1.canvas.width) {
        baby.flip();
    }
   

}

function flip() {
    banana.flip();
    baby.flip();
    
}

window.addEventListener("load", draw);
window.setInterval(draw, 300);
window.addEventListener("click", flip);