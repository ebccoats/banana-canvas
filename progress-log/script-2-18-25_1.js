let baby_sprite_source = "images/baby-sprites.png";

const sprite_clicker = document.getElementById("sprite-clicker");
let sprite_clicker_ctx = sprite_clicker.getContext("2d");
sprite_clicker_ctx.imageSmoothingEnabled = false;

let baby_sprite_2;

let counter = 0;

function sprite_clicker_drawFrame() {
    baby_sprite_2 = new SpriteHandler(baby_sprite_source, 29, 24);
    let here_frame = baby_sprite_2.makeFrame(5, false);
    game_ctx.drawImage(here_frame, 0, 0);

    baby_sprite.placeFrame(sprite_clicker_ctx, counter * 10, 0, counter, false);
    counter++;


}

sprite_clicker_button = document.getElementById("sprite-clicker-button");
sprite_clicker_button.addEventListener("click", sprite_clicker_drawFrame);


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
        console.log(this.contexts.singleFrame);
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
        this.contexts.singleFrame = this.canvases.singleFrame.getContext("2d");
        this.canvases.fullSheet = new OffscreenCanvas(sprite_sheet.width, sprite_sheet.height);
        this.contexts.fullSheet = this.canvases.fullSheet.getContext("2d");

    }

    makeFrame(chosen_frame, flipped) {
        const frame = this.sprite_coordinates[chosen_frame];

        let frame_ctx = this.contexts.singleFrame;
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