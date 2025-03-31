const scale = 5;
const y_planes = [150, 175, 200];
const y_modifier = 11;

const animations = {
    baby_walk: {
        title: "baby_walk",
        frames: [0, 1, 2, 3],
        timing: [1, 1, 1, 1],
        moving: true
    },
    baby_fall: {
        title: "baby_fall",
        frames: [4, 5, 4, 5, 6],
        timing: [1, 1, 1, 1, 1],
        moving: false
    },
    baby_sit_idle: {
        title: "baby_sit_idle",
        frames: [7, 8, 7, 9, 8],
    //  frames: [7, 5, 4, 5, 6, 7, 8, 7],
        timing: [1, 1, 1, 1, 1],
        moving: false
    },
    baby_sit_hold: {
        title: "baby_sit_hold",
        frames: [7, 9, 7, 7, 7, 7],
        timing: [1, 1, 1, 1, 1, 1],
        moving: false
    },
    baby_get_up: {
        title: "baby_get_up",
        frames: [8, 10, 4, 5, 4],
        timing: [1, 1, 1, 1, 1],
        moving: false
    },
    baby_catch_banana: {
        title: "baby_catch_banana",
        frames: [4, 11, 12],
        timing: [1, 1, 1],
        moving: false
    },
    baby_eat_banana: {
        title: "baby_eat_banana",
        frames: [13, 14],
        timing: [1, 1],
        moving: false
    },
    banana_hold: {
        title: "banana_hold",
        frames: [0],
        timing: [1],
        moving: false
    },
    banana_crawl: {
        title: "banana_crawl",
        frames: [1, 2, 0],
        timing: [1, 1, 1],
        moving: true
    }
}

const sprite_sets = {
    banana: {
        title:"banana",
        sprite_sheet_path: "images/banana-sprites.png",
        frame_width: 20,
        frame_height: 13,
        floor_plane: 5,
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
        floor_plane: 5,
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
        }
    }

    makeCanvases = (sprite_sheet) => {
        this.canvases.fullSheet = new OffscreenCanvas(sprite_sheet.width, sprite_sheet.height);
        this.contexts.fullSheet = this.canvases.fullSheet.getContext("2d");
        this.contexts.fullSheet.drawImage(sprite_sheet, 0, 0);
        this.canvases.singleFrame = new OffscreenCanvas(this.sprite_info.frame_width, this.sprite_info.frame_height);
        this.contexts.singleFrame = this.canvases.singleFrame.getContext("2d");
        console.log("singleFrame", this.contexts.singleFrame)
    }

    // Interactive
    makeFrame = (chosen_frame, flipped) => {
        const frame_coordinates = this.sprite_coordinates[chosen_frame];
        const frame_ctx = this.contexts.singleFrame;
        console.log(frame_ctx);

        frame_ctx.clearRect(0, 0, this.canvases.singleFrame.width, this.canvases.singleFrame.height);

        if (!flipped) {
            frame_ctx.drawImage(this.canvases.fullSheet, frame_coordinates?.x, frame_coordinates?.y, this.sprite_info.frame_width, this.sprite_info.frame_height, 0, 0, this.sprite_info.frame_width, this.sprite_info.frame_height);
        } else {
            // flips the canvas
            frame_ctx.translate(this.canvases.singleFrame.width, 0);
            frame_ctx.scale(-1, 1);
            // draws the image on the flipped canvas
            frame_ctx.drawImage(this.canvases.fullSheet, frame_coordinates?.x, frame_coordinates?.y, this.sprite_info.frame_width, this.sprite_info.frame_height, 0, 0, this.sprite_info.frame_width, this.sprite_info.frame_height);
            // flips the canvas back (now image will show up flipped)
            frame_ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        return this.canvases.singleFrame;
    }

    makeAnimFrame = (flipped) => {
        console.log("currentFrame", this.currentFrame);
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
            this.currentFrame = this.currentFrame + 1;
        }
    }

}


class GameCharacter {
    constructor(sprite_set, movement_rate, ctx) {
        this.takingInput = true;
        this.sprite_info = sprite_set;
        this.sprite_handler = null;
        this.movement_rate = movement_rate; // this is per frame
        // scale is a global setting, all pixels should be the same size
        this.floorplate = {};
        this.frame = null;
        this.state = "seek";
        this.facingLeft = false;
        this.targetCtx = ctx;
        this.x = 0;
        this.y = 0;
        this.y_level = 0;
        this.active = true;

        this.setup();
    }

    hitbox = () => {
        const width = this.sprite_info.frame_width * scale;
        const location = this.location();
        const hitbox = {
            start: location[0], 
            end: location[0] + width
        }
        return hitbox;
    }

    setup = () => {
        this.sprite_handler = new SpriteHandler(this.sprite_info);
        this.sprite_handler.setAnimation(this.sprite_info.animations["walk"]);

    }

    update = () => {
        if (this.sprite_handler.animInProgress) {
            this.takingInput = false;
            if (this.sprite_handler.currentAnimation.moving) {
                this.moveX()
            }
        } else {
            this.takingInput = true;
            //this.sprite_handler.setAnimation(this.sprite_info.animations["walk"]);
        }

    }


    drawFrame = () => {
        this.frame = this.sprite_handler.makeAnimFrame(this.facingLeft);
        this.sprite_handler.advanceFrame();
        console.log("animation in progress", this.sprite_handler.animInProgress);

        this.targetCtx.translate(0, (y_planes[this.y_level] - (this.sprite_handler.canvases.singleFrame.height * scale))); //transform/translate gets character on the right plane no matter how tall their sprite is
        this.targetCtx.drawImage(this.frame, this.x, 0, this.frame.width * scale, this.frame.height * scale);
        this.targetCtx.setTransform(1, 0, 0, 1, 0, 0); //resets transform

        console.log("character:", this.sprite_info.title, this.x, this.y);

    }

    forcePlace = (x, y) => {
        this.x = x;
        this.y_level = y;
        this.y = 0;
    }

    location = () => {
        return [this.x, this.y_level]
    }

    moveY = (direction) => {
        if (direction == "up") {
            if (this.y_level == 0) {
                return;
            } else {
                this.y_level = this.y_level - 1;
            }
        } else if (direction == "down") {
            if (this.y_level == 2) {
                return;
            } else {
                this.y_level++;
            }
        }
    }

    face(direction) {
        if (direction == "left") {
            this.facingLeft = true;
        } else if (direction == "right") {
            this.facingLeft = false;
        }
    }

    moveX = () => {
        if (this.facingLeft) {
            this.x = this.x - this.movement_rate;
        } else {
            this.x = this.x + this.movement_rate;
        }
    }

    seek = (targetCharacter) => {
        const target = targetCharacter;
        if (this.x < target.x) {
            this.face("right");
        } else {
            this.face("left");
        }
        if (this.y_level < target.y_level) {
            this.moveY("down");
        } else if (this.y_level > target.y_level) {
            this.moveY("up");
        }


    }

    walk = () => {
        this.sprite_handler.setAnimation(this.sprite_info.animations["walk"]);
    }

    catchBanana = () => {
        this.sprite_handler.setAnimation(this.sprite_info.animations["catch_banana"]);
    }

    eatBanana = () => {
        this.sprite_handler.setAnimation(this.sprite_info.animations["eat_banana"]);
    }

    fall = () => {
        this.sprite_handler.setAnimation(this.sprite_info.animations["fall"]);
    }

    sitIdle = () => {
        this.sprite_handler.setAnimation(this.sprite_info.animations["sit_idle"]);
    }

    sitHold = () => {
        this.sprite_handler.setAnimation(this.sprite_info.animations["sit_hold"]);
    }

    getUp = () => {
        this.sprite_handler.setAnimation(this.sprite_info.animations["get_up"]);
    }

    deactivate = () => {
        this.active = false;
    }

    hitboxOverlaps = (otherCharacter) => {
        const ownHitbox = this.hitbox();
        const otherHitbox = otherCharacter.hitbox();
        const overlaps = {
            y: false,
            x: false
        }
        if (this.y_level == otherCharacter.y_level) {
            overlaps.y = true;
        }
        if (this.facingLeft) {
            if (ownHitbox.start < otherHitbox.end) {
                overlaps.x = true;
            }
        } else if (!this.facingLeft) {
            if (ownHitbox.end > otherHitbox.start) {
                overlaps.x = true;
            }
        }

        if (overlaps.y && overlaps.x) {
            return true;
        } else {
            return false;
        }

    }



}


function gameController() {
    const gameField = {
        canvas: null,
        ctx: null,
        width: 0,
        y_plane: [40, 50, 60]
    };

    const gameState = {
        gameOver: false,
        gameStopped: false,
        playerCharacter: null,
    }

    const characters = {};
    const ui_elements = {
        gameOver_src: "images/ui_elements/gameOverSprite.png",
        babyChow_src: "images/ui_elements/babyChow.png",
        title_src: "images/ui_elements/title.png",
        gameOver: null,
        babyChow: null,
        title: null
        // TODO when UI element is turned on, add it to the "draw array"?
    };

    function setup() {
        gameField.canvas = document.getElementById("gameController-field");
        let ctx = gameField.canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false; // Disable smoothing
        ctx.mozImageSmoothingEnabled = false; // For Firefox support
        ctx.webkitImageSmoothingEnabled = false; // For Safari/Chrome support
        ctx.msImageSmoothingEnabled = false; // For IE/Edge support
        gameField.ctx = ctx;
        gameField.width = gameField.canvas.width;

        //characters.banana = new SpriteHandler(sprite_sets.banana);
        //characters.banana.loadSpriteSheet();


        characters.baby = new GameCharacter(sprite_sets.baby, 10, gameField.ctx);
        characters.baby.forcePlace(100, 0);
        characters.banana = new GameCharacter(sprite_sets.banana, 5, gameField.ctx);
        characters.banana.forcePlace(400, 0);
        gameState.playerCharacter = characters.banana; 


        //characters.baby = new SpriteHandler(sprite_sets.baby);
        //await characters.baby.loadSpriteSheet(); // Wait until sprite sheet is loaded
        //characters.baby.setAnimation(animations.baby_walk);

        ui_elements.gameOver = new Image();
        ui_elements.gameOver.src = ui_elements.gameOver_src;
        ui_elements.babyChow = new Image(); 
        ui_elements.babyChow.src = ui_elements.babyChow_src;
        ui_elements.title = new Image();
        ui_elements.title.src = ui_elements.title_src;
    }
    
    function randomNumber(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    

    function update() {
        characters.baby.update();
        characters.banana.update();


        if (characters.baby.takingInput) {

            if (characters.baby.hitboxOverlaps(characters.banana)) {
                characters.banana.deactivate();
                characters.baby.catchBanana();
            } else {
                const randomNum = randomNumber(1,6);
                if (randomNum == 4) {
                    characters.baby.fall();
                } else {
                    if (characters.baby.sprite_handler.currentAnimation.title == "baby_fall") {
                        characters.baby.sitIdle();
                    } else if (characters.baby.sprite_handler.currentAnimation.title == "baby_sit_idle") {
                        if (randomNum > 2) {
                            characters.baby.sitHold();
                        } else {
                            characters.baby.getUp();
                        }

                    } else if (characters.baby.sprite_handler.currentAnimation.title == "baby_get_up") {
                        characters.baby.walk();
                    } else {
                        characters.baby.seek(characters.banana);
                        characters.baby.walk();

                    }
                }

            }

            if (characters.baby.sprite_handler.currentAnimation.title == "baby_catch_banana") {
                characters.baby.eatBanana();
            }

            if (characters.baby.sprite_handler.currentAnimation.title == "baby_eat_banana") {
                characters.baby.eatBanana();
            }

        }

    }

    // this is where you keep everything that will be drawn, in order
    const drawStack = {};

    function draw() {
        gameField.ctx.clearRect(0, 0, gameField.width, gameField.canvas.height);
        if (characters.banana.active) {
            characters.banana.drawFrame(gameField.ctx);
        }

        characters.baby.drawFrame(gameField.ctx);
        
        
        //const frame = characters.baby.makeAnimFrame(true);
        //characters.baby.advanceFrame();

        //gameField.ctx.drawImage(frame, 0, 0, frame.width * scale, frame.height * scale);
        
    }

    function gameLoop() {
        update();
        draw();
    }

    // run the game
    setup(); // Wait for setup to complete

    function inputHandler(event) {
        if (gameState.playerCharacter.takingInput) {
            if (event.key == "ArrowUp") {
                event.preventDefault();
                gameState.playerCharacter.moveY("up");
            } else if (event.key == "ArrowDown") {
                event.preventDefault();
                gameState.playerCharacter.moveY("down");
            } else if (event.key == "ArrowLeft") {
                event.preventDefault();
                gameState.playerCharacter.face("left");
                gameState.playerCharacter.walk();
            } else if (event.key == "ArrowRight") {
                event.preventDefault();
                gameState.playerCharacter.face("right");
                gameState.playerCharacter.walk();
            }
        }

    }

    const fps = 6;
    let gameInterval = setInterval(gameLoop, 1000 / fps);
    document.addEventListener('keydown', (event) => {
        inputHandler(event);
    });

}


gameController();



