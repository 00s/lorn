var FIREBALL_MOVE =  9
var FIREBALL_RELATIVE_X_VELOCITY = 4;

// FireBall Class

var FireBall = (function () {

	// constructor
	function FireBall (x, y, sense) {

        this._width  = 16;
        this._height = 12;

		// spriteSheet setup
		this.data = {
            images: [queue.getResult("fireball")],
            frames: { width: this._width, height: this._height, regX: 10, regY: 6},
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

	   this.animation.x += (FIREBALL_MOVE * this.sense) + (inertia*-1) * FIREBALL_RELATIVE_X_VELOCITY;
	}


	return FireBall;
})();
