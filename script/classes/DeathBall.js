var DEATHBALL_RELATIVE_X_VELOCITY = 4;

// width and height reference for spriteShitData
var DB_FRAME_W = 16;
var DB_FRAME_H = 16;

// DeathBall Class

var DeathBall = (function () {

	// constructor
	function DeathBall (x, y) {

        this._width  = DB_FRAME_W;
        this._height = DB_FRAME_H;

		// spriteSheet setup
		this.data = {
            images: [queue.getResult("deathball")],
            frames: { width: this._width, height: this._height, regX: DB_FRAME_W - 2, regY: DB_FRAME_H * 0.5},
            animations: {
                burn: [0, 24, "burn", 0.7]
            }
        };

        this.spriteSheet = new createjs.SpriteSheet(this.data);
        this.animation = new createjs.Sprite(this.spriteSheet, "burn");

		// x and y params used for seting the object in stage
        this.animation.x = x;
        this.animation.y = y;

	}

    // apply fireball movement based on lorn inertial reference
	DeathBall.prototype.update = function (inertia) {
        var mv = (inertia*-1) * DEATHBALL_RELATIVE_X_VELOCITY;
        log("fireball orientation: "+ mv + " , " + inertia + " , " + inertia);
	    this.animation.x += mv;
        this.animation.y += 4;
	}

	return DeathBall;
})();
