const scale = 5;

const animations = {
    baby_walk: {
        title: "baby_walk",
        frames: [0, 1, 2, 3],
        timing: [1, 1, 1, 1]
    },
    baby_fall: {
        title: "baby_fall",
        frames: [4, 5, 4, 5, 6],
        timing: [1, 1, 1, 1, 1]
    },
    baby_sit_idle: {
        title: "baby_sit_idle",
        frames: [7, 8, 7, 9, 8],
    //  frames: [7, 5, 4, 5, 6, 7, 8, 7],
        timing: [1, 1, 1, 1, 1]
    },
    baby_sit_hold: {
        title: "baby_sit_hold",
        frames: [7, 9, 7, 7, 7, 7],
        timing: [1, 1, 1, 1, 1, 1]
    },
    baby_get_up: {
        title: "baby_get_up",
        frames: [8, 10, 4, 5, 4],
        timing: [1, 1, 1, 1, 1]
    },
    baby_catch_banana: {
        title: "baby_catch_banana",
        frames: [4, 11, 12],
        timing: [1, 1, 1]
    },
    baby_eat_banana: {
        title: "baby_eat_banana",
        frames: [13, 14],
        timing: [1, 1]
    },
    banana_hold: {
        title: "banana_hold",
        frames: [0],
        timing: [1]
    },
    banana_crawl: {
        title: "banana_crawl",
        frames: [1, 2, 0],
        timing: [1, 1, 1]
    }
}

const sprite_sets = {
    banana: {
        title:"banana",
        sprite_sheet_path: "images/banana-sprites.png",
        frame_width: 20,
        frame_height: 13,
        animations: {
            "walk": animations.banana_crawl,
            "sit_hold": animations.banana_hold
        }
    },
    baby: {
        title: "baby",
        sprite_sheet_path: "images/baby-sprites.png",
        frame_width: 29,
        frame_height: 24,
        animations: {
            "walk": animations.baby_walk,
            "fall": animations.baby_fall,
            "sit_idle": animations.baby_sit_idle,
            "sit_hold": animations.baby_sit_hold,
            "get_up": animations.baby_get_up,
            "catch_banana": animations.baby_catch_banana,
            "eat_banana": animations.baby_eat_banana
        }
    }
}

class SpriteHandler {
    constructor(sprite_set) {
        this.sprite_info = sprite_set;
        this.canvases = {};
        this.contexts = {};
        this.sprite_coordinates = [];
        this.currentAnimation = {};
        this.currentFrame = 0;
        this.animInProgress = false;

        this.loadSpriteSheet();

    }

    // Setup
    loadSpriteSheet = () => {
        return new Promise((resolve, reject) => {
            const sprite_sheet = new Image();
            sprite_sheet.src = this.sprite_info.sprite_sheet_path;
            sprite_sheet.onload = () => {
                console.log("sprite sheet loaded");
                this.makeCanvases(sprite_sheet);

                const number_of_sprites = sprite_sheet.width / this.sprite_info.frame_width;
                for (let i = 0; i < number_of_sprites; i++) {
                    const frame = {
                        x: i * this.sprite_info.frame_width,
                        y: 0
                    }
                    this.sprite_coordinates.push(frame);
                }
                resolve();  // Resolve the promise when loading is done
            };
            sprite_sheet.onerror = reject;  // Reject the promise if there's an error
        });

    }

    makeCanvases = (sprite_sheet) => {
        this.canvases.fullSheet = new OffscreenCanvas(sprite_sheet.width, sprite_sheet.height);
        this.contexts.fullSheet = this.canvases.fullSheet.getContext("2d");
        this.contexts.fullSheet.drawImage(sprite_sheet, 0, 0);

        this.canvases.singleFrame = new OffscreenCanvas(this.sprite_info.frame_width, this.sprite_info.frame_height);
        this.contexts.singleFrame = this.canvases.singleFrame.getContext("2d");
    }

    // Interactive
    makeFrame = (chosen_frame, flipped) => {
        const frame_coordinates = this.sprite_coordinates[chosen_frame];
        const frame_ctx = this.contexts.singleFrame;

        frame_ctx.clearRect(0, 0, this.canvases.singleFrame.width, this.canvases.singleFrame.height);

        if (!flipped) {
            frame_ctx.drawImage(this.canvases.fullSheet, frame_coordinates?.x, frame_coordinates?.y, this.sprite_info.frame_width, this.sprite_info.frame_height, 0, 0, this.sprite_info.frame_width, this.sprite_info.frame_height);
        } else {
            frame_ctx.translate(this.canvases.singleFrame.width, 0);
            frame_ctx.scale(-1, 1);
            frame_ctx.drawImage(this.canvases.fullSheet, frame_coordinates?.x, frame_coordinates?.y, this.sprite_info.frame_width, this.sprite_info.frame_height, 0, 0, this.sprite_info.frame_width, this.sprite_info.frame_height);
            frame_ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        return this.canvases.singleFrame;
    }

    makeAnimFrame = (flipped) => {
        const frame_index = this.currentFrame;
        const desired_sprite_clipout_index = this.currentAnimation.frames[frame_index];
        const desired_sprite_clipout_coordinates = this.sprite_coordinates[desired_sprite_clipout_index];

        const animFrame = this.makeFrame(this.currentAnimation.frames[this.currentFrame], flipped);

        return animFrame;
    }

    setAnimation = (animation) => {
        this.currentAnimation = animation;
        this.currentFrame = 0;
        this.animInProgress = true;
    }

    advanceFrame = () => {
        const anim_length = this.currentAnimation.frames.length;
        const currentFrame = this.currentFrame;
        if (currentFrame == (anim_length - 1)) {
            this.currentFrame = 0;
            this.animInProgress = false;
        } else if (this.animInProgress) {
            this.currentFrame++;
        }
    }

}

async function gameController() {
    const gameField = {
        canvas: null,
        ctx: null,
        width: 0,
        y_plane: [40, 50, 60]
    };

    const gameState = {
        gameOver: false,
        playerCharacter: null,
        npcs: null
    }

    const characters = {};

    

    async function setup() {
        gameField.canvas = document.getElementById("gameController-field");
        let ctx = gameField.canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false; // Disable smoothing
        ctx.mozImageSmoothingEnabled = false; // For Firefox support
        ctx.webkitImageSmoothingEnabled = false; // For Safari/Chrome support
        ctx.msImageSmoothingEnabled = false; // For IE/Edge support
        gameField.ctx = ctx;
        gameField.width = gameField.canvas.width;

        characters.baby = new SpriteHandler(sprite_sets.baby);
        await characters.baby.loadSpriteSheet(); // Wait until sprite sheet is loaded
        
    }

    function update() {

    }

    function draw() {
        gameField.ctx.clearRect(0, 0, gameField.width, gameField.canvas.height);

        
        characters.baby.setAnimation(animations.baby_fall);
        const frame = characters.baby.makeAnimFrame(true);

        console.log("frame", frame);
        gameField.ctx.drawImage(frame, 0, 0, frame.width * scale, frame.height * scale);
        
    }

    function gameLoop() {
        update();
        draw();
    }

    // run the game
    await setup(); // Wait for setup to complete
    draw();

}


gameController();



