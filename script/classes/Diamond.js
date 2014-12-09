var NEXT_POS_FACTOR = 5;
var D_GRAVITY = 0.05;
var WIGGLE_VELOCITY = -4;

// Diamond CLass

var Diamond = (function () {

    // constructor
    function Diamond(x, y) {

        this._width  = 52;
        this._height = 40;

        // spriteSheet setup
        this.data = {
            images: [queue.getResult("diamond")],
            frames: { width: this._width, height: this._height, regX: 26, regY: 20},
            animations: {
                glow: [0, 2, "glow", 0.3]
            }
        };

        this.spriteSheet = new createjs.SpriteSheet(this.data);
        this.animation = new createjs.Sprite(this.spriteSheet, "glow");

        this.animation.scaleX = 0.5;
        this.animation.scaleY = 0.5;
        // x and y params used for seting the object in stage
        this.animation.x = x;
        this.animation.y = y;

        // ref for wiggling move
        this.initialHeight = y + 10;
        this.wiggleUp = true;
        this.wigVelocity = -WIGGLE_VELOCITY;
        
        //stage.addChild(this.animation);
        log("diamond added at " + x +", "+ y);
        log("initialHeight " + this.initialHeight);
	}

    Diamond.prototype.update = function (sense, velocity) {

        this.animation.x -= sense*(velocity);
        this.wiggle();
    }

    Diamond.prototype.wiggle = function () {

        this.wigVelocity += D_GRAVITY;
        this.animation.y += this.wigVelocity;
        
        if(this.animation.y > this.initialHeight){
            this.wigVelocity = -4;
            this.animation.y = this.initialHeight;
        }
    }

    Diamond.prototype.redefinePosition = function () {
        
        this.animation.x = canvasW * NEXT_POS_FACTOR;
    }

	return Diamond;
})();
