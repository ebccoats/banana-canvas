let baby_sprite_source = "images/baby-sprites.png";
let banana_sprite_source = "images/banana-sprites.png";

// manual animations
const baby_walk = {
    title: "baby_walk",
    frames: [0, 1, 2, 3],
    timing: [1, 1, 1, 1],
    move: true,
    loop: true,
    next: "any"
}

const baby_fall = {
    title: "baby_fall",
    frames: [4, 5, 4, 5, 6],
    timing: [1, 1, 1, 1, 1],
    move: false,
    loop: false,
    next: "baby_sit_hold"
}

const baby_sit_idle = {
    title: "baby_sit_idle",
    frames: [7, 8, 7, 9, 8],
  //  frames: [7, 5, 4, 5, 6, 7, 8, 7],
    timing: [1, 1, 1, 1, 1],
    move: false,
    loop: false,
    next: "any"
}

const baby_sit_hold = {
    title: "baby_sit_hold",
    frames: [7, 9, 7, 7, 7, 7],
    timing: [1, 1, 1, 1, 1, 1],
    move: false,
    loop: true,
    next: "any"
}

const baby_get_up = {
    title: "baby_get_up",
    frames: [8, 10, 4, 5, 4],
    timing: [1, 1, 1, 1, 1],
    move: false,
    loop: false,
    next: "baby_walk"
}

const baby_catch_banana = {
    title: "baby_catch_banana",
    frames: [4, 11, 12],
    timing: [1, 1, 1],
    move:false,
    loop: false,
    next: "baby_eat_banana"
}

const baby_eat_banana = {
    title: "baby_eat_banana",
    frames: [13, 14],
    timing: [1, 1],
    move: false,
    loop: true,
    next: "any"
}

const banana_hold = {
    title: "banana_hold",
    frames: [0],
    timing: [1],
    move: false,
    loop: true,
    next: "any"
}

const banana_crawl = {
    title: "banana_crawl",
    frames: [1, 2, 0],
    timing: [1, 1, 1],
    move: true,
    loop: true,
    next: "any"
}


class SpriteHandler {
    constructor(image_path, frame_width, frame_height, scale, character_string) {
        this.sprite_coordinates = [];
        this.canvases = {};
        this.contexts = {};
        this.animations = {};
        this.currentAnimation = {};
        this.currentFrame = 0;
        this.animFinished = true;
        this.info = {
            path: image_path,
            width: frame_width,
            height: frame_height,
            scale: scale
        }
        if (character_string == "baby") {
            this.animations = {
                "walk": baby_walk,
                "fall": baby_fall,
                "sit_idle": baby_sit_idle,
                "sit_hold": baby_sit_hold,
                "get_up": baby_get_up,
                "catch_banana": baby_catch_banana,
                "eat_banana": baby_eat_banana
            }
        } else if (character_string == "banana") {
            this.animations = {
                "walk": banana_crawl,
                "sit_hold": banana_hold
            }
        } else {
            console.log("character animations not handled yet for " + character_string);
        }
        this.loadImage(image_path);
    }

    // Startup methods
    loadImage(image_path) {
        const sprite_sheet = new Image();
        sprite_sheet.src = image_path;
        
        sprite_sheet.onload = () => {
            this.makeCanvases(sprite_sheet);
            let full_ctx = this.contexts.fullSheet;
            full_ctx.drawImage(sprite_sheet, 0, 0);

            const number_of_sprites = sprite_sheet.width / this.info.width;
            for (let i = 0; i < number_of_sprites; i++) {
                const frame = {
                    x: i * this.info.width,
                    y: 0
                }
                this.sprite_coordinates.push(frame);
            }

        }
    }


    makeCanvases(sprite_sheet) {
        this.canvases.singleFrame = new OffscreenCanvas(this.info.width, this.info.height);
        this.contexts.singleFrame = this.canvases.singleFrame.getContext("2d");
        this.canvases.fullSheet = new OffscreenCanvas(sprite_sheet.width, sprite_sheet.height);
        this.contexts.fullSheet = this.canvases.fullSheet.getContext("2d");

    }

    // Interactive methods

    // Make this into an arrow function?
    // Returns whatever frame in the sprite you asked for.
    makeFrame(chosen_frame, flipped) {
        // PROBLEM TROUBLESHOOT here why is it not working???
        console.log("chosen frame: ", chosen_frame, "coordinates for chosen frame: ", this.sprite_coordinates[chosen_frame]);
        const frame = this.sprite_coordinates[chosen_frame];
        // if (!frame) {
        //     debugger;
        // }

        let frame_ctx = this.contexts.singleFrame;
        frame_ctx.clearRect(0, 0, this.canvases.singleFrame.width, this.canvases.singleFrame.height);

        if (!flipped) {
            console.log({frame});
            frame_ctx.drawImage(this.canvases.fullSheet, frame?.x, frame?.y, this.info.width, this.info.height, 0, 0, this.info.width, this.info.height);
        } else {
            frame_ctx.translate(this.canvases.singleFrame.width, 0);
            frame_ctx.scale(-1, 1);
            frame_ctx.drawImage(this.canvases.fullSheet, frame?.x, frame?.y, this.info.width, this.info.height, 0, 0, this.info.width, this.info.height);
            frame_ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        return this.canvases.singleFrame;
    }

    // Returns animation's current frame
    makeAnimFrame(flipped) {
        const frame_index = this.currentFrame;
        const desired_sprite_clipout_index = this.currentAnimation.frames[frame_index];
        const desired_sprite_clipout_coordinates = this.sprite_coordinates[desired_sprite_clipout_index];
        // const debugObject = {
        //     "frame_index": frame_index,
        //     "desired_sprite_clipout_index": 
        // }
        console.log({
            "this.currentFrame": this.currentFrame, // 7 should be 0
        })

        // debugger;
        const animFrame = this.makeFrame(this.currentAnimation.frames[this.currentFrame], flipped);

        return animFrame;
    }

    // This will be handled by the CharacterEntity that owns the spritehandler. Leaving it in for now so the demo page doesn't break.
    placeFrame(ctx, x, y, chosen_frame, flipped) {
        let temp_frame = this.makeFrame(chosen_frame, flipped);
        let width = this.info.width * this.info.scale;
        let height = this.info.height * this.info.scale;
        ctx.drawImage(temp_frame, x, y, width, height);
    }

    // QUESTION: How would I make this an explicit "setter" function?
    // Is the way I did this a hacky DIY setter function?
    setAnimation(animation) {
        const selected_anim = animation;
        this.currentAnimation = this.animations[selected_anim];
        this.currentFrame = 0;
        this.animFinished = false;
    }

    // Happens after drawing.
    advanceFrame() {
        const anim_length = this.currentAnimation.frames.length;
        let looping = this.currentAnimation.loop;
        const nextAnim = this.currentAnimation.next;
        if (nextAnim == "any") {
            looping = true; // CHANGE THIS WHEN YOU FIGURE SOMETHING ELSE OUT
        }
        const currentFrame = this.currentFrame;
        console.log("current anim: ", this.currentAnimation, "current frame: ", currentFrame);
        if (currentFrame == (anim_length - 1)) {
            this.currentFrame = 0;
        } else {
            this.currentFrame++;
        }

    }


}



const sprite_clicker = document.getElementById("sprite-manual-animation");
let sprite_clicker_ctx = sprite_clicker.getContext("2d");
sprite_clicker_ctx.imageSmoothingEnabled = false;

const baby_sprite_2 = new SpriteHandler(baby_sprite_source, 29, 24, 5, "baby");
const banana_sprite_2 = new SpriteHandler(banana_sprite_source, 20, 13, 5, "banana");

let show_baby = true;

let counter = 0;


function drawFirstFrame() {

    sprite_clicker_drawFrame();
    console.log(baby_sprite_2.animations)
}

function swapSpriteSet() {
    counter = 0; // reset counter because baby has more frames than banana
    if (show_baby) {
        show_baby = false;
    } else {
        show_baby = true;
    }
    sprite_clicker_drawFrame();
}

function advanceFrame() {
    counter++;
    sprite_clicker_drawFrame();
  
}

function prevFrame() { 
    counter = counter - 1;
    sprite_clicker_drawFrame();
   
}

function sprite_clicker_drawFrame() {
    sprite_clicker_ctx.clearRect(0, 0, sprite_clicker.width, sprite_clicker.height);

    if (show_baby) {
        if (counter == (baby_sprite_2.sprite_coordinates.length)) {
            counter = 0;
        } else if (counter == -1) {
            counter = baby_sprite_2.sprite_coordinates.length - 1;
        } 
        baby_sprite_2.placeFrame(sprite_clicker_ctx, 0, 0, counter, false);
    } else if (!show_baby) {
        if (counter == banana_sprite_2.sprite_coordinates.length) {
            counter = 0;
        } else if (counter == -1) {
            counter = banana_sprite_2.sprite_coordinates.length - 1; 
        }
        banana_sprite_2.placeFrame(sprite_clicker_ctx, 0, 50, counter, false); // correcting for banana height difference by drawing it on the same Y level as baby
    }

}

class CharacterEntity {
    constructor(character_string, frame_width, frame_height, scale, sprite_path, is_autonomous, spawn_x, spawn_y) {
        this.character = character_string;
        this.sprite_set = new SpriteHandler(sprite_path, frame_width, frame_height, scale, character_string);
        this.is_autonomous = is_autonomous;
        this.x = spawn_x,
        this.y = spawn_y,
        this.facingLeft = false;
        this.hitbox = [this.x, (this.x + frame_width)];
        this.currentAnimation = "walk";
        this.nextAnimation = "walk";
        this.state = "walk";
        this.movement_rate = 30; // get this from constructor
        this.target_ctx;


    }

    setTargetCtx(target_ctx) {
        this.target_ctx = target_ctx;
    }

    updateHitbox() {
        this.hitbox = [this.x, (this.x + frame_width)];
    }

    face(direction) {
        if (direction == "left") {
            this.facingLeft = true;
        } else if (direction == "right") {
            this.facingLeft = false;
        }
    }

    moveX() {
        if (this.facingLeft) {
            this.x = this.x - this.movement_rate;
        } else {
            this.x = this.x + this.movement_rate;
        }
    }

    animateInPlace() {

    }

    animateMoveX() {
        this.moveX();
        this.updateHitbox();
    }

    placeFrame() {
        const frame = this.sprite_set.makeAnimFrame();
        let width = this.sprite_set.info.width * this.sprite_set.info.scale;
        let height = this.sprite_set.info.height * this.sprite_set.info.scale;
        this.target_ctx.drawImage(frame, this.x, this.y, width, height);


    }

    setAnim(animation) {
        this.currentAnimation = animation;
        this.sprite_set.setAnimation(animation);
    }

    nextFrame() {
        this.sprite_set.advanceFrame();
    }


}

window.addEventListener("load", drawFirstFrame);
const sprite_advance_button = document.getElementById("sprite-manual-next-frame");
sprite_advance_button.addEventListener("click", advanceFrame);
const sprite_prev_button = document.getElementById("sprite-manual-prev-frame");
sprite_prev_button.addEventListener("click", prevFrame);
const swap_sprite_set_button = document.getElementById("baby-to-banana");
swap_sprite_set_button.addEventListener("click", swapSpriteSet);


// 3-panel animation canvases: 
const animation_1 = document.getElementById("animation-1");
let animation_1_ctx = animation_1.getContext("2d");
animation_1_ctx.imageSmoothingEnabled = false;

const animation_2 = document.getElementById("animation-2");
let animation_2_ctx = animation_2.getContext("2d");
animation_2_ctx.imageSmoothingEnabled = false;

const animation_3 = document.getElementById("animation-3");
let animation_3_ctx = animation_3.getContext("2d");
animation_3_ctx.imageSmoothingEnabled = false;


// 3-panel animation objects: 
const baby_sprite_3 = new SpriteHandler(baby_sprite_source, 29, 24, "baby");
const banana_sprite_3 = new SpriteHandler(banana_sprite_source, 20, 13, "banana");

const anim_1_baby = new CharacterEntity("baby", 29, 24, 5, baby_sprite_source, true, 0, 0);
const anim_2_baby = new CharacterEntity("baby", 29, 24, 5, baby_sprite_source, true, 0, 0); 
const anim_3_baby = new CharacterEntity("baby", 29, 24, 5, baby_sprite_source, true, 0, 0);


// 3-panel animation functions
function draw_sprite_animations() {
    const ctxs = [animation_1_ctx, animation_2_ctx, animation_3_ctx];
    for (ctx of ctxs) {
        ctx.clearRect(0, 0, 150, 150);
    }

    const sprite_babies = [anim_1_baby, anim_2_baby, anim_3_baby];
    for (baby of sprite_babies) {
        baby.placeFrame();
        baby.nextFrame();
    }

    



}

function setup_sprite_animations_canvases() {
    anim_1_baby.setTargetCtx(animation_1_ctx);
    anim_1_baby.setAnim("eat_banana");
    anim_2_baby.setTargetCtx(animation_2_ctx);
    anim_2_baby.setAnim("sit_hold");
    anim_3_baby.setTargetCtx(animation_3_ctx);
    // TROUBLESHOOTING: all the animations except baby_walk and baby_fall are broken??? 
    anim_3_baby.setAnim("sit_idle");
    const sprite_babies = [anim_1_baby, anim_2_baby, anim_3_baby];
    for (baby of sprite_babies) {
        baby.placeFrame();

    }
}

// 3-panel animation listeners
window.addEventListener("load", setup_sprite_animations_canvases);
window.setInterval(draw_sprite_animations, 300);

const up_button = document.getElementById("up");
const down_button = document.getElementById("down");
const left_button = document.getElementById("left");
const right_button = document.getElementById("right");
up_button.addEventListener("click", moveUp);
down_button.addEventListener("click", moveDown);
left_button.addEventListener("click", moveLeft);
right_button.addEventListener("click", moveRight);

// TODO add keyboard arrow keys handling, intercept them so they don't scroll the browser window?
document.addEventListener('keydown', function(event) {
    if (event.key == "ArrowUp") {
        moveUp();
    } else if (event.key == "ArrowDown") {
        moveDown();
    } else if (event.key == "ArrowLeft") {
        moveLeft();
    } else if (event.key == "ArrowRight") {
        moveRight();
    }
});

function moveUp() {
    console.log("move up");
}

function moveDown() {
    console.log("move down");
}

function moveLeft() {
    console.log("move left");
}

function moveRight() {
    console.log("move right");
}