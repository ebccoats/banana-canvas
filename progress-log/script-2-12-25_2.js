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
            canvas: canvas,
            ctx: ctx
        }
    } else {
        console.log("canvas unsupported")
        // canvas-unsupported code here
    }
}

function entityMaker(x, y, sprites, sprite_width, sprite_height, move_increment) {
    this.animations = [sprites];
    this.currentAnimation = 0;
    this.x = x;
    this.y = y;
    this.scale = 200;
    this.width = sprite_width;
    this.height = sprite_height;
    this.pace = move_increment;
    this.faceRight = true;
    this.move = function() {
        if (this.faceRight) { 
            this.x = this.x + this.pace;
        } else {
            this.x = this.x - this.pace;
        }
    } 

    this.drawEntity = function(ctx) {
        if (this.faceRight) {
            this.animations[this.currentAnimation].faceRight = true;
        } else {
            this.animations[this.currentAnimation].faceRight = false;
        }
        this.animations[this.currentAnimation].drawFrame(ctx, this.x, this.y, this.scale);
        this.animations[this.currentAnimation].nextFrame();
    }

    this.centerX = function() {
        centerX = this.x;
        return centerX;
    }

    
} 

// TODO add timing source argument to maker
function animationMaker(sprite_set) {
    this.animation_inProgress = false;
    this.frames = sprite_set;
    this.frame_timing = [1, 1, 1, 1];
    this.currentFrame = 0;
    this.width = 40; // this is hard coded for now
    this.height = 40; // this is hard coded for now
    this.flipped_width = -40 // this is hard coded for now
    this.faceRight = true;
    this.nextFrame = function() {  // QUESTION: is there a cleaner way to do this?
        if (this.currentFrame == (this.frames.length - 1)) {
            this.currentFrame = 0;
            this.animation_inProgress = false;
        } else {
            this.currentFrame = this.currentFrame + 1; // isn't there something like += that just increments by 1?
            this.animation_inProgress = true;
        } 
    }
    
    this.drawFrame = function(ctx, x, y, scale) {
        var width = scale
        if (this.faceRight == false) {
            width = scale * -1;
        } else {
            width = scale;
        }
        frame = new Image();
        frame.src = character_path + this.frames[this.currentFrame];
        frame.onload = function() {
            ctx.drawImage(frame, x, y, width, scale); 
        };
    }

}

var banana_animation_crawling = new animationMaker(banana_sprites, "placeholder"); 
var banana = new entityMaker(0, 0, banana_animation_crawling, 40, 40, 10);
var banana_crawling = canvasMaker("crawling_banana");

function crawl_draw() {
    banana.drawEntity(banana_crawling.ctx);
    banana_crawling.ctx.clearRect(0, 0, banana_crawling.canvas.width, banana_crawling.canvas.height);
    banana.drawEntity(banana_crawling.ctx);
    banana.move();
    if (banana.centerX() == banana_crawling.canvas.width) {
        banana.faceRight = false;
    } else if (banana.centerX() == 0) {
        banana.faceRight = true;
    }

}

window.addEventListener("load", crawl_draw);
window.setInterval(crawl_draw, 300);