var CAT_MOVE = -9;
var CAT_RELATIVE_X_VELOCITY = 4;
var CAT_REG_Y = 16;

// Cat Class

var Cat = (function () {
	function Cat() {

		this.vertical_velocity = 3;

        this._width  = 36;
        this._height = 32;
        this.onGroundLevel = false;

		this.data ={
			framerate: 40,
			images: [queue.getResult("cat")],
			frames: { width: this._width, height: this._height, regX: 18, regY: 16},
			animations: {
				sit: 8,
				standUp: {frames: [7, 6, 0], next: "walk", speed: 2},
				walk: [0,5, "walk", 1]
			}
		};
        this.spriteSheet = new createjs.SpriteSheet(this.data);
        this.animation = new createjs.Sprite(this.spriteSheet, "walk");
		
        stage.addChild(this.animation);
		this.randomizeCatDrop();

	}

	Cat.prototype.randomizeCatDrop = function (){
		this.animation.x = canvasW + Math.random()* 100;
		this.animation.y = (canvasH - CAT_REG_Y) * Math.random();
		this.vertical_velocity = Math.floor(Math.random() * 3)+3;
		this.onGroundLevel = false;
	}


	Cat.prototype.update = function (inertia) {
		
		this.animation.x += (CAT_MOVE);// + (inertia*CAT_RELATIVE_X_VELOCITY);
		if(inertia > 0){
			this.animation.x += CAT_MOVE;
		}if(inertia < 0){
			this.animation.x += CAT_MOVE*-0.7;
		}
		if(!this.onGroundLevel){
			if(this.animation.y < canvasH - CAT_REG_Y){
				this.animation.y +=this.vertical_velocity;
				this.animation.gotoAndPlay("standUp");
			}else{
				this.onGroundLevel = true;
				this.animation.gotoAndPlay("walk");
			}
		}

		if(this.animation.x < 0)
			this.randomizeCatDrop();
	}

	return Cat;
})();