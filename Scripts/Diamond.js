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

        stage.addChild(this.animation);
        console.log("diamond added at " + x +", "+ y);

	}

    Diamond.prototype.update = function (sense, velocity) {

        this.animation.x -= sense*(velocity);
    }

    Diamond.prototype.redefinePosition = function () {
        this.animation.x = canvasW * 5;
    }

    FireBall.prototype.dismiss = function () {

        stage.removeChild(this.animation);
    }

	return Diamond;
})();
