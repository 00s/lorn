
// PRESET ATTRIBUTES AND REFS
var RECOVERING_TIME = 1300;
var DISTANCE_PER_MOVE = 10;
var HIT_CAT_SCORE = 50;
var GRAVITY  = 0.6;
var LIVES = 3;

// width and height reference for spriteShitData
var LORN_FRAME_W = 28;
var LORN_FRAME_H = 48;

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
        this.lives = LIVES;

        // Diamonds and Fireballs counters
        this.fireballs = 0;
        this.diamonds = 0;

        // sprite size reference
        this._width  = LORN_FRAME_W;
        this._height = LORN_FRAME_H;

        this.regY = this._height * 0.5;
        this.regX = this._width * 0.5;

        // SpriteSheet setup
        this.data = {
            images: [queue.getResult("lorn")],
            
            frames: { 
                width: this._width, 
                height: this._height, 
                regX: this.regX, 
                regY: this.regY 
            },
            
            animations: {
                idle: { frames: [0,0], next: "walk"},
                jump: { frames: [4,5], next: "walk"},
                walk: [0, 8],
                walkOnFire: [9, 17],
                jumpOnFire: { frames: [13,14], next: "walkOnFire"},
                idleOnFire: { frames: [9,9], next: "walkOnFire"},
            }
        };

        this.spriteSheet = new createjs.SpriteSheet(this.data);
        this.animation = new createjs.Sprite(this.spriteSheet, "walk");

        // setup animation position (incording to parameters)
        this.animation.x = x;
        // Y is smaller for the avatar start above the floor level
        this.animation.y = y - this.regY * 4;
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
    		log("jump started");
    		this.velocityY = -13.0;
    		this.jumping = true;
    	}
    }

    // set end of jumping move
    Lorn.prototype.endJump = function () {
		
		log("jump ended");
    	
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


    // if lorn wasStricken, check lives and set stricken delay
    Lorn.prototype.wasStricken = function (state){
        if(this.lives-- > 0){

            this.stricken = true;
            
            var _this = this;
            
            blinkingEffect(_this);
        }
    }

    // makes Lorn animation blink during the RECOVERING_TIME
    function blinkingEffect(_this){
        
        var b = setInterval(function(){
            _this.animation.alpha = (_this.animation.alpha == 1.0) ? 0.5 : 1.0;
        } , 175);

        setTimeout( function(){
                clearInterval(b);
                _this.animation.alpha = 1.0;
                _this.stricken = false;
                log("back to the game with " + _this.lives + " lives.")
            }, RECOVERING_TIME);
    }

    // check if lorn is not momving
    Lorn.prototype.isIdle = function (){

        return (!this.movingLeft && !this.movingRight && !this.jumping);
    }

    // colects diamonds 
    Lorn.prototype.colectDiamond = function (){
        
        this.diamonds++;
        // and attributes fireballs
        this.fireballs += 10;
    }

    // return Lorn's total score
    Lorn.prototype.getTotalScore = function (){
        var total = this.coveredDistance * 0.1 + this.score 
        // if total is smaller than zero, return 0
        return (total >=0) ? total : 0;
    }

    Lorn.prototype.update = function (groundLevel) {
    	
        // apply GRAVITY to vertical velocity
    	this.velocityY +=GRAVITY;
    	// set lorn vertical position based on velocity
    	this.animation.y += this.velocityY;
        if(this.animation.y < 24) this.animation.y = 24;

    	// check if lorn is back to the ground and ends jump arch
    	if(this.animation.y > groundLevel - this.regY){
    		this.animation.y = groundLevel - this.regY;
    		this.velocityY = 0.0;
    		this.jumping = false;
    	}

        var onFire = "";
        // if player has powerUps
        if(this.isOnFire())
            // set OnFire String to proper define animation
            onFire = "OnFire";

        // set animation when jumping
    	if(this.jumping)
    		this.animation.gotoAndPlay("jump" + onFire);

        // set animation when idling
    	if(this.isIdle())
    		this.animation.gotoAndPlay("idle" + onFire);

        // verify and calculate horizontal moves
        if(this.movingLeft)
            this.coveredDistance -= DISTANCE_PER_MOVE;
        if(this.movingRight)
            this.coveredDistance += DISTANCE_PER_MOVE;

    }

    // boolean: return true if Lorn has fireballs
    Lorn.prototype.isOnFire = function (){
        return (this.fireballs > 0)
    }

    return Lorn;
})();
