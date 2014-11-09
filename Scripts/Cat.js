var CAT_MOVE = 8;
var CAT_RELATIVE_VELOCITY = 4;

// Cat Class

var Cat = (function () {
	function Cat(x, y) {

        this._width  = 36;
        this._height = 32;

		this.data ={
			framerate: 40,
			images: [queue.getResult("cat")],
			frames: { width: this._width, height: this._height, regX: 18, regY: 16},
			animations: {
				sit: 8,
				standUp: [7, 6, 0],
				walk: [0,5, "walk", 1]
			}
		};
        this.spriteSheet = new createjs.SpriteSheet(this.data);
    	this.walkSprite = new createjs.Sprite(this.spriteSheet, "walk");
        this.animation = this.walkSprite;
		
		// x and y params used for seting the object in stage
        this.animation.x = x;
        this.animation.y = y;

        stage.addChild(this.animation);
	}


	Cat.prototype.update = function (sense) {
		
		this.animation.x += (-(sense)*CAT_RELATIVE_VELOCITY) - (CAT_MOVE);

		if(this.animation.x < 0)
			this.animation.x = canvasW;
	}

	return Cat;
})();