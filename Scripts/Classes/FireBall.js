var FIREBALL_MOVE =  9
var FIREBALL_RELATIVE_X_VELOCITY = 4;

// width and height reference for spriteShitData
var FB_FRAME_W = 16;
var FB_FRAME_H = 12;

// FireBall Class

var FireBall = (function () {

	// constructor
	function FireBall (x, y, sense) {

        this._width  = FB_FRAME_W;
        this._height = FB_FRAME_H;

		// spriteSheet setup
		this.data = {
            images: [queue.getResult("fireball")],
            frames: { width: this._width, height: this._height, regX: FB_FRAME_W - 2, regY: FB_FRAME_H * 0.5},
            animations: {
                burn: [0, 5, "burn", 0.9]
            }
        };

        this.spriteSheet = new createjs.SpriteSheet(this.data);
        this.animation = new createjs.Sprite(this.spriteSheet, "burn");

		// x and y params used for seting the object in stage
        this.animation.x = x;
        this.animation.y = y;

        // set fireball sense (left or right)
        this.sense = sense;
        if(sense < 0)
        	this.animation.scaleX = sense;
	}

    // apply fireball movement based on lorn inertial reference
	FireBall.prototype.update = function (inertia) {
        var mv = (FIREBALL_MOVE * this.sense) + (inertia*-1) * FIREBALL_RELATIVE_X_VELOCITY;
        log("fireball orientation: "+mv + " , " + inertia);
	    this.animation.x += mv;
	}

	return FireBall;
})();
