var RECOVERING_TIME = 750;

// lorn Character
var Lorn = (function () {
	// constructor
    function Lorn(x, y) {
    	// variables for movement reference
    	this.jumping , this.movingLeft , this.movingRight = false;
        this.velocityY = 0.0;

        // live and blink
        this.lives = 3;
        //this.hitten = false;

        // sprite size reference
        this._width  = 28;
        this._height = 48;

        // rectangle reference for collision detection

        // SpriteSheet setup
        this.data = {
            images: [queue.getResult("lorn")],
            frames: { width: this._width, height: this._height, regX: 14, regY: 24 },
            animations: {
                idle: { frames: [0,0], next: "walk"},
                jump: { frames: [4,5], next: "walk"},
                walk: [0, 8]
            }
        };

        this.spriteSheet = new createjs.SpriteSheet(this.data);
        this.animation = new createjs.Sprite(this.spriteSheet, "walk");

        this.animation.x = x;
        this.animation.y = y;

        stage.addChild(this.animation);
    }
    

    // set lorn for jumping
    Lorn.prototype.startJump = function () {

    	if(!this.jumping){
    		console.log("jump started");
    		this.velocityY = -13.0;
    		this.jumping = true;
    	}
    }

    // set end of jumping move
    Lorn.prototype.endJump = function () {
		
		console.log("jump ended");
    	
    	if(this.velocityY < -5.0){
    		this.velocityY = -5.0;
    	}
    }

    // set lorn for moving to the left
    Lorn.prototype.moveLeft = function (){
    	
    	this.movingLeft = true;
		lorn.animation.scaleX = -1;
    }

    // set lorn for moving to the right
    Lorn.prototype.moveRight = function (){
		
		lorn.animation.scaleX = 1;
    	this.movingRight += true;
    }

    // set end of left move
    Lorn.prototype.stopMovingLeft = function () {
    	
    	this.movingLeft = false;
    }

    // set end of right move
    Lorn.prototype.stopMovingRight = function () {
    	
    	this.movingRight = false;
    }

    // return sense based on sprite scaleX variable
    Lorn.prototype.getSense = function () {
    	
    	return this.animation.scaleX;
    }

    // if lorn wasHitten, check lives and set hitten delay
    Lorn.prototype.wasHitten = function (){
    	if(this.lives-- > 0){

    		this.animation.alpha = 0.5;
    		this.hitten = true;
    		
    		var _this = this;
    		setTimeout( function(){
    			_this.animation.alpha = 1.0;
    			_this.hitten = false;
    			console.log("back to the game.")
    		}, RECOVERING_TIME);
    	}else{
    		// GAME OVER
    	}
    }

    Lorn.prototype.update = function () {
    	// apply GRAVITY to vertical velocity
    	this.velocityY +=GRAVITY;
    	// set lorn vertical position based on velocity
    	this.animation.y += this.velocityY;

    	// check if lorn is back to the ground and ends jump arch
    	if(this.animation.y > GROUND_LEVEL - LORN_REG_Y){
    		this.animation.y = GROUND_LEVEL - LORN_REG_Y;
    		this.velocityY = 0.0;
    		this.jumping = false;
    	}

    	if(this.jumping)
    		this.animation.gotoAndPlay("jump");

    	// verify and apply horizontal moves
    	if(this.movingLeft)
    		this.animation.x -= LORN_MOVE;
    	if(this.movingRight)
    		this.animation.x += LORN_MOVE;

    	if(!this.movingLeft && !this.movingRight && !this.jumping)
    		this.animation.gotoAndPlay("idle");
    }

    return Lorn;
})();
