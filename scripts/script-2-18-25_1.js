let baby_sprite_source = "images/baby-sprites.png";
let banana_sprite_source = "images/banana-sprites.png";

const sprite_clicker = document.getElementById("sprite-manual-animation");
let sprite_clicker_ctx = sprite_clicker.getContext("2d");
sprite_clicker_ctx.imageSmoothingEnabled = false;

let baby_sprite_2;
let banana_sprite_2; 

let show_baby = true;

let counter = 0;


function drawFirstFrame() {
    baby_sprite_2 = new SpriteHandler(baby_sprite_source, 29, 24);
    banana_sprite_2 = new SpriteHandler(banana_sprite_source, 20, 13);

    // TODO draw a frame so canvas doesn't start out blank

}

function swapSpriteSet() {
    counter = 0; // reset counter because baby has more frames than banana
    if (show_baby) {
        show_baby = false;
    } else {
        show_baby = true;
    }
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
        console.log("Showing baby");
        if (counter == (baby_sprite_2.sprite_coordinates.length)) {
            counter = 0;
        } else if (counter == -1) {
            counter = baby_sprite_2.sprite_coordinates.length - 1;
        } 
        baby_sprite_2.placeFrame(sprite_clicker_ctx, 0, 0, 5, counter, false);
    } else if (!show_baby) {
        console.log("Showing banana");
        if (counter == banana_sprite_2.sprite_coordinates.length) {
            counter = 0;
        } else if (counter == -1) {
            counter = banana_sprite_2.sprite_coordinates.length - 1; 
        }
        banana_sprite_2.placeFrame(sprite_clicker_ctx, 0, 50, 5, counter, false); // correcting for banana height difference by drawing it on the same Y level as baby
    }

}

window.addEventListener("load", drawFirstFrame);
const sprite_advance_button = document.getElementById("sprite-manual-next-frame");
sprite_advance_button.addEventListener("click", advanceFrame);
const sprite_prev_button = document.getElementById("sprite-manual-prev-frame");
sprite_prev_button.addEventListener("click", prevFrame);
const swap_sprite_set_button = document.getElementById("baby-to-banana");
swap_sprite_set_button.addEventListener("click", swapSpriteSet);


class SpriteHandler {
    constructor(image_path, frame_width, frame_height) {
        this.sprite_coordinates = [];
        this.canvases = {};
        this.contexts = {};
        this.info = {
            path: image_path,
            width: frame_width,
            height: frame_height
        }
        this.loadImage(image_path);
    }

    loadImage(image_path) {
        const sprite_sheet = new Image();
        sprite_sheet.src = image_path;
        
        sprite_sheet.onload = () => {
            this.makeCanvases(sprite_sheet);
            let full_ctx = this.contexts.fullSheet;
            full_ctx.drawImage(sprite_sheet, 0, 0);

            const number_of_sprites = sprite_sheet.width / this.info.width;
            console.log(number_of_sprites);
            for (let i = 0; i < number_of_sprites; i++) {
                const frame = {
                    x: i * this.info.width,
                    y: 0
                }
                this.sprite_coordinates.push(frame);
            }

        }
    }

    // Working as expected
    makeCanvases(sprite_sheet) {
        this.canvases.singleFrame = new OffscreenCanvas(this.info.width, this.info.height);
        this.contexts.singleFrame = this.canvases.singleFrame.getContext("2d");
        this.canvases.fullSheet = new OffscreenCanvas(sprite_sheet.width, sprite_sheet.height);
        this.contexts.fullSheet = this.canvases.fullSheet.getContext("2d");

    }

    // Make this into an arrow function?
    makeFrame(chosen_frame, flipped) {
        const frame = this.sprite_coordinates[chosen_frame];

        let frame_ctx = this.contexts.singleFrame; //ERROR
        frame_ctx.clearRect(0, 0, this.canvases.singleFrame.width, this.canvases.singleFrame.height);

        if (!flipped) {
            frame_ctx.drawImage(this.canvases.fullSheet, frame.x, frame.y, this.info.width, this.info.height, 0, 0, this.info.width, this.info.height);
        } else {
            frame_ctx.translate(this.canvases.singleFrame.width, 0);
            frame_ctx.scale(-1, 1);
            frame_ctx.drawImage(this.canvases.fullSheet, frame.x, frame.y, this.info.width, this.info.height, 0, 0, this.info.width, this.info.height);
            frame_ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        return this.canvases.singleFrame;
    }

    placeFrame(ctx, x, y, scale, chosen_frame, flipped) {
        let temp_frame = this.makeFrame(chosen_frame, flipped);
        let width = this.info.width * scale;
        let height = this.info.height * scale;
        console.log(width, height)
        ctx.drawImage(temp_frame, x, y, width, height);
    }
}



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

class BabyAnimationHandler {
    constructor() {
        this.currentAnimation = baby_walk;
        this.currentFrame = 0;
        this.animDictionary = {
            "baby_walk": baby_walk,
            "baby_fall": baby_fall,
            "baby_sit_idle": baby_sit_idle,
            "baby_sit_hold": baby_sit_hold,
            "baby_get_up": baby_get_up,
            "baby_catch_banana": baby_catch_banana,
            "baby_eat_banana": baby_eat_banana
        }
    }


}

class BananaAnimationHandler {
    constructor() {
        this.currentAnimation = banana_crawl;
        this.currentFrame = 0;
        this.animDictionary = {
            "banana_hold": banana_hold,
            "banana_crawl": banana_crawl
        }
    }
}


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
const baby_sprite_3 = new SpriteHandler(baby_sprite_source, 29, 24);
const banana_sprite_3 = new SpriteHandler(banana_sprite_source, 20, 13);

const anim_1_baby = new BabyAnimationHandler();
const anim_2_baby = new BabyAnimationHandler();
const anim_3_baby = new BabyAnimationHandler(); 


// 3-panel animation functions
function draw_sprite_animations() {



}

// 3-panel animation listeners
window.addEventListener("load", draw_sprite_animations);
window.setInterval(draw_sprite_animations, 300);
