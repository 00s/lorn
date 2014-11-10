var RECOVERING_TIME = 750;
var DISTANCE_PER_MOVE = 10;
var HIT_CAT_SCORE = 50;
var GRAVITY  = 0.6;


// Auxiliar function for String Formating. 
// src: http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number] 
        : match
      ;
    });
  };
}

// lorn Character
var Lorn = (function () {
	// constructor
    function Lorn(x, y) {
    	// variables for movement reference
    	this.jumping , this.movingLeft , this.movingRight = false;
        this.velocityY = 0.0;

        // PLAYER STATUS ATTRIBUTES
        this.coveredDistance = 0;
        this.score = 0;
        this.lives = 3;

        // Diamonds and Fireballs
        this.fireballs = 0;
        this.diamonds = 0;

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

    Lorn.prototype.hasFireBalls = function () {
        return (this.fireballs > 0)
    }

    Lorn.prototype.shoot = function () {
        this.fireballs--;
    }

    // return Lives, distance, score, fireballs, diamonds
    Lorn.prototype.getPlayerStatus = function () {
        var status = [""+this.lives, ""+this.coveredDistance , ""+this.score, ""+this.fireballs, ""+this.diamonds];
        return status;
    }

    Lorn.prototype.toString = function () {
        var status = this.getPlayerStatus();
        return String.format("\nLIVES: \t\t\t\t{0}\n\nFIREBALLS: {1}\n\nSCORE: \t\t\t\t{2}\n\nDIAMONDS: \t{3}\n\nDISTANCE: \t{4}",status[0],status[3],status[2],status[4],status[1]);
    }
    

    Lorn.prototype.hitCat = function () {
        this.score += HIT_CAT_SCORE;
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
    	
        lorn.animation.scaleX = -1;
    	this.movingLeft = true;
    }

    // set lorn for moving to the right
    Lorn.prototype.moveRight = function (){
		
		lorn.animation.scaleX = 1;
    	this.movingRight = true;
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
    Lorn.prototype.getSense = function (considerIdle) {
    	
    	return (this.isIdle() && considerIdle) ? 0 : this.animation.scaleX;
    }

    // if lorn wasHitten, check lives and set hitten delay
    Lorn.prototype.wasHitten = function (state){
    	
        if(this.lives-- > 0){

    		this.animation.alpha = 0.5;
    		this.hitten = true;
    		
    		var _this = this;
    		setTimeout( function(){
    			_this.animation.alpha = 1.0;
    			_this.hitten = false;
    			console.log("back to the game with " + _this.lives+ " lives.")
    		}, RECOVERING_TIME);
    	}else{
    		// state = Game.OVER;
    	}
    }

    // check if lorn is not momving
    Lorn.prototype.isIdle = function (){
        
        return (!this.movingLeft && !this.movingRight && !this.jumping);
    }

    Lorn.prototype.colectDiamond = function (){
        this.diamonds++;
        this.fireballs += 10;
    }

    Lorn.prototype.getTotalScore = function (){
        return this.distance * 0.1 * this.score;
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

    	// verify and calculate horizontal moves
    	if(this.movingLeft)
    	   	this.coveredDistance -= DISTANCE_PER_MOVE;
    	if(this.movingRight)
    	 	this.coveredDistance += DISTANCE_PER_MOVE;

    	if(this.isIdle())
    		this.animation.gotoAndPlay("idle");
    }

    return Lorn;
})();
