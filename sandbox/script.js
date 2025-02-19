let baby_sprite_source = "progress-log/images/baby-sprites.png";

const sprite_canvas = document.getElementById("sprite-field");
let sprite_ctx = sprite_canvas.getContext("2d");

if (sprite_canvas.getContext) {
    sprite_ctx = sprite_canvas.getContext("2d");
    sprite_ctx.imageSmoothingEnabled = false;
}

const game_field = document.getElementById("game-field");
let game_ctx = game_field.getContext("2d");
game_ctx.imageSmoothingEnabled = false;

let baby_sprite;

function drawBabySprite() {
    baby_sprite = new SpriteHandler(baby_sprite_source, 29, 24);
}

let counter = 0;

function drawFrame() {
    let frame = baby_sprite.makeFrame(5, false);
    game_ctx.drawImage(frame, 0, 0);

    baby_sprite.placeFrame(game_ctx, counter * 10, 0, counter, false);
    counter++;


}

window.addEventListener("load", drawBabySprite);
window.addEventListener("click", drawFrame);

// this has to be a promise because it involves loading something?
// Confused...
function spriteChopper(image_path, frame_width, frame_height) {
    const sprite_set = [];
    const sprite_sheet = new Image();
    sprite_sheet.src = image_path;
    sprite_sheet.onload = function() {
        const sprite_width = sprite_sheet.width;
        const number_of_sprites = sprite_width / frame_width;
        const sprite_source_canvas = new OffscreenCanvas(sprite_width, frame_height);
        const sprite_source_ctx = sprite_source_canvas.getContext("2d");

        const sprite_prep_canvas = new OffscreenCanvas(frame_width, frame_height);
        const sprite_prep_ctx = sprite_prep_canvas.getContext("2d");

        for (let i = 0; i < number_of_sprites; i++) {
            console.log("loop for sprite #", i);
            const frame_coordinates = {
                x: number_of_sprites * i,
                y: 0
            }
            sprite_set.push(frame_coordinates);
        }
        let sprite_chopper_object = {
            source_canvas: sprite_source_canvas,
            prep_canvas: sprite_prep_canvas,
            sprite_set: sprite_set,
            sprite_width: frame_width,
            sprite_height: frame_height
        };
    }
    // how to flip? 

}

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
            let full_ctx = this.canvases.fullSheet.ctx;
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

    makeCanvases(sprite_sheet) {
        this.canvases.singleFrame = new OffscreenCanvas(this.info.width, this.info.height);
        this.canvases.singleFrame.ctx = this.canvases.singleFrame.getContext("2d");
        this.canvases.fullSheet = new OffscreenCanvas(sprite_sheet.width, sprite_sheet.height);
        this.canvases.fullSheet.ctx = this.canvases.fullSheet.getContext("2d");
    }

    makeFrame(chosen_frame, flipped) {
        const frame = this.sprite_coordinates[chosen_frame];

        let frame_ctx = this.canvases.singleFrame.ctx;
        console.log(frame_ctx);
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

    placeFrame(ctx, x, y, chosen_frame, flipped) {
        let temp_frame = this.makeFrame(chosen_frame, flipped);
        ctx.drawImage(temp_frame, x, y);
    }
}