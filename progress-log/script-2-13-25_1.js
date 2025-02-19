var character_path = "../images/characters/"
var banana_sprites_13 = ["banana00.png", "banana01.png", "banana02.png"];
var baby_sprites = ["baby00.png", "baby01.png", "baby02.png", "baby03.png"];

function canvasMaker(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false; // Disable smoothing
        ctx.mozImageSmoothingEnabled = false; // For Firefox support
        ctx.webkitImageSmoothingEnabled = false; // For Safari/Chrome support
        ctx.msImageSmoothingEnabled = false; // For IE/Edge support
        return {
            canvas: canvas,
            ctx: ctx
        }
    } else {
        console.log("canvas unsupported")
        // canvas-unsupported code here
    }
}

// make it so animations complete before the character moves x, y
function entityMaker(x, y, sprites, sprite_width, sprite_height, move_increment) {
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
    this.move = function() {
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

    this.flip = function() {
        if (this.faceLeft) {
            this.faceLeft = false;
        } else {
            this.faceLeft = true;
        }
    }

    // WTF I have no idea why this is not working??????
    // For some reason all the rendering context and flipping has to happen
    // inside the onload = function() brackets inside the animation handler
    this.drawEntity = function(ctx) {
        if (this.faceLeft) {
            this.animations[this.currentAnimation].drawLeft(this.ctx, this.canvas);
        } else {
            this.animations[this.currentAnimation].drawRight(this.ctx, this.canvas);
        }

        ctx.drawImage(this.canvas, this.x, this.y, this.scale, this.scale);
        this.animations[this.currentAnimation].nextFrame();

    }

    // make this actually give the center x coordinates of the canvas on the game field
    this.centerX = function() {
        centerX = this.x;
        return centerX;
    }

    
} 

// TODO add timing source argument to maker
// add something to pull in file names, animation names, and timing from a csv
// make it so the animation completes before the character moves x, y coords

// WTF why is one frame missing????
function animationMaker(sprite_set) {
    this.animation_inProgress = true;
    this.frames = sprite_set;
    this.frame_timing = [1, 1, 1, 1];
    this.currentFrame = 2;
    this.width = 40; // this is hard coded for now
    this.height = 40; // this is hard coded for now
    this.nextFrame = function() {  // QUESTION: is there a cleaner way to do this?
        if (this.currentFrame < (this.frames.length - 1)) {
            this.animation_inProgress = true;
            this.currentFrame = this.currentFrame + 1;
        } else {
            this.animation_inProgress = false;
            this.currentFrame = 0;
        }
    }
    
    this.drawRight = function(parent_ctx, parent_canvas) {

        frame = new Image();
        frame.src = character_path + this.frames[this.currentFrame];
        frame.onload = function() {
            parent_ctx.clearRect(0, 0, parent_canvas.width, parent_canvas.height);
            parent_ctx.drawImage(frame, 0, 0); 
        };
    }

    this.drawLeft = function(parent_ctx, parent_canvas) {
        frame = new Image();
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

var banana_animation_13 = new animationMaker(banana_sprites_13, "placeholder"); 
var baby_animation = new animationMaker(baby_sprites, "placeholder"); 
var banana_13 = new entityMaker(0, 0, banana_animation_13, 40, 40, 30);
var baby = new entityMaker(0, 0, baby_animation, 40, 40, 20);
var game_field_2 = canvasMaker("game-field-2");
var baby_field = canvasMaker("baby");

function drawGameField() {
    banana_13.drawEntity(game_field_2.ctx);
    game_field_2.ctx.clearRect(0, 0, game_field_2.canvas.width, game_field_2.canvas.height);
    banana_13.drawEntity(game_field_2.ctx);
    banana_13.move();

    if (banana_13.faceLeft && (banana_13.centerX() == 0)) {
        banana_13.flip();
    } else if (banana_13.centerX() > game_field_2.canvas.width) {
        banana_13.flip();
    }

    //drawBaby();

    function drawBaby() {
        baby.drawEntity(baby_field.ctx);
        baby_field.ctx.clearRect(0, 0, baby_field.canvas.width, baby_field.canvas.height);
        baby.drawEntity(baby_field.ctx);
        baby.move();

        if (baby.faceLeft && (baby.centerX() == 0)) {
            baby.flip();
        } else if (baby.centerX() > baby_field.canvas.width) {
            baby.flip();
        }

    }
    


   

}

function b13flip() {
    banana_13.flip();
    baby.flip();
    
}

const flipbutton = document.getElementById("change-direction");
window.addEventListener("load", drawGameField);
window.setInterval(drawGameField, 300);

flipbutton.addEventListener("click", b13flip);