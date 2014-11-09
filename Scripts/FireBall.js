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
                burn: [0, 5, "burn", 0.4]
            }
        };

        this.spriteSheet = new createjs.SpriteSheet(this.data);
    	this.burnSprite = new createjs.Sprite(this.spriteSheet, "burn");
        this.animation = this.burnSprite;

		// x and y params used for seting the object in stage
        this.animation.x = x;
        this.animation.y = y;

        // set fireball sense (left or right)
        this.sense = sense;
        if(sense < 0)
        	this.animation.scaleX = sense;
	}

	FireBall.prototype.update = function () {
		
		this.animation.x += (FIREBALL_SPEED * this.sense);
	}

    FireBall.prototype.dismiss  = function () {
        stage.removeChild(fireballs[i].animation);
        fireballs.pop(i);
    }

	return FireBall;
})();
