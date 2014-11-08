﻿var stage;
var queue;
var canvas;

// Game Objects
var plane;
var island;
var ocean;
var scoreboard;
var lorn;

// ENUM for keys
Key = {
	UP : 38,
	LEFT : 37,
	RIGHT : 39,
	SPACE : 32
}

// Cloud Array
var clouds = [];
// FireBall Array
var fireballs = [];


// Game Constants
var CLOUD_NUM = 3;
var GAME_FONT = "40px Consolas";
var FONT_COLOUR = "#FFFF00";
var PLAYER_LIVES = 3;
var GRAVITY  = 0.6;
var GROUND_LEVEL = 455;
var FIREBALL_SPEED = 8;
var LORN_MOVE = 6;

function preload() {
    queue = new createjs.LoadQueue();
    queue.installPlugin(createjs.Sound);
    queue.addEventListener("complete", init);
    queue.loadManifest([
        { id: "yay", src: "sounds/yay.ogg" },
        { id: "thunder", src: "sounds/thunder.ogg" },
        { id: "engine", src: "sounds/engine.ogg" },
        { id: "lorn", src: "images/lorn.png" },
        { id: "fireball", src: "images/fireball.png" }
    ]);
}

function init() {
    stage = new createjs.Stage(document.getElementById("canvas"));
    canvas = document.getElementById("canvas")
    // handlers for keyboard inputs
    canvas.addEventListener( "keydown", handleKeyDown, false );
    canvas.addEventListener( "keyup", handleKeyUp, false );
    
    //stage.enableMouseOver(20);
    createjs.Ticker.setFPS(40);
    createjs.Ticker.addEventListener("tick", gameLoop);
    gameStart();
}

// Keyboard handlers

function handleKeyDown(event){

	switch(event.keyCode){
		
		case Key.UP:
			console.log("Key.UP pressed");
			lorn.startJump();
			break;

		case Key.LEFT:
			console.log("Key.LEFT pressed");
			lorn.moveLeft();
			break;

		case Key.RIGHT:
			console.log("Key.RIGHT pressed");
			lorn.moveRight();
			break;
	}
}

function handleKeyUp(event){

	switch(event.keyCode){
		
		case Key.UP:
			console.log("Key.UP released");
			lorn.endJump();
			break;

		case Key.SPACE:
			console.log("Key.SPACE released");
			x = lorn.animation.x;
			y = lorn.animation.y;

			fireballs.push(new FireBall(x, y));
			stage.addChild(fireballs[fireballs.length - 1].animation);
			break;

		case Key.LEFT:
			console.log("Key.LEFT released");
			lorn.stopMovingLeft();
			break;

		case Key.RIGHT:
			console.log("Key.RIGHT released");
			lorn.stopMovingRight();
			break;
	}
}

// Game Loop
function gameLoop(event) {

	// update each fireball on stage and remove from stage the ones that are out of view.
    for (i = 0; i < fireballs.length; i++) {
    	if(fireballs[i] !== undefined){
    		fireballs[i].update();
	    	
	    	if(fireballs[i].animation.x > stage.canvas.width){
	    		stage.removeChild(fireballs[i].animation);
	    		fireballs.splice(i,1);
	    		console.log("fireball removed")
	    	}
    	}
	}

    lorn.update();
    stage.update();
}

// lorn Character
var Lorn = (function () {

    function Lorn(x, y) {
    	
    	this.jumping , this.movingLeft , this.movingRight = false;
        this.velocityY = 0.0;

        this.data = {
            images: [queue.getResult("lorn")],
            frames: { width: 28, height: 48, regX: 14, regY: 24 },
            animations: {
                stay: 0,
                jump: 5,
                walk: [0, 8]
            }
        };
        this.spriteSheet = new createjs.SpriteSheet(this.data);
    	
    	this.walkSprite = new createjs.Sprite(this.spriteSheet, "walk");
        
        this.animation = this.walkSprite;

        this.animation.x = x;
        this.animation.y = y;

        stage.addChild(this.animation);

    }
    Lorn.prototype.startJump = function () {
    	if(!this.jumping){
    		console.log("jump started");
    		this.velocityY = -13.0;
    		this.jumping = true;
    	}
    }

    Lorn.prototype.endJump = function () {
		console.log("jump ended");
    	if(this.velocityY < -5.0){
    		this.velocityY = -5.0;
    	}
    }

    Lorn.prototype.moveLeft = function (){
    	this.movingLeft = true;
    }

    Lorn.prototype.moveRight = function (){
    	this.movingRight += true;
    }

    Lorn.prototype.stopMovingRight = function () {
    	this.movingRight = false;
    }
    Lorn.prototype.stopMovingLeft = function () {
    	this.movingLeft = false;
    }


    Lorn.prototype.update = function () {
    	// apply GRAVITY to vertical velocity
    	this.velocityY +=GRAVITY;
    	// set lorn vertical position based on velocity
    	this.animation.y += this.velocityY;

    	// check if lorn is back to the ground and ends jump arch
    	if(this.animation.y > GROUND_LEVEL){
    		this.animation.y = GROUND_LEVEL;
    		this.velocityY = 0.0;
    		this.jumping = false;
    	}

    	if(this.movingLeft)
    		this.animation.x -= LORN_MOVE;
    	if(this.movingRight)
    		this.animation.x += LORN_MOVE;
    }

    return Lorn;
})();

// FireBall Class

var FireBall = (function () {
	// constructor
	function FireBall (x, y) {
		// spriteSheet setup
		this.data = {
            images: [queue.getResult("fireball")],
            frames: { width: 16, height: 12, regX: 10, regY: 6 },
            animations: {
                burn: [0, 5]
            }
        };

        this.spriteSheet = new createjs.SpriteSheet(this.data);
    	this.burnSprite = new createjs.Sprite(this.spriteSheet, "burn");
        this.animation = this.burnSprite;

		// x and y params used for seting the object in stage
        this.animation.x = x;
        this.animation.y = y;

	}

	FireBall.prototype.update = function () {
		this.animation.x += FIREBALL_SPEED;
	}


	return FireBall;
})();

// Plane Class
var Plane = (function () {
    function Plane() {
        this.image = new createjs.Bitmap(queue.getResult("plane"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.image.regX = this.width * 0.5;
        this.image.regY = this.height * 0.5;
        this.image.y = 430;

        stage.addChild(this.image);

        // Play engine sound forever
        createjs.Sound.play("engine", 0, 0, 0, -1, 1, 0);
    }
    Plane.prototype.update = function () {
        this.image.x = stage.mouseX;
    };
    return Plane;
})();

// Island Class
var Island = (function () {
    function Island() {
        this.image = new createjs.Bitmap(queue.getResult("island"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.image.regX = this.width * 0.5;
        this.image.regY = this.height * 0.5;
        this.dy = 5;
        stage.addChild(this.image);
        this.reset();
    }
    Island.prototype.reset = function () {
        this.image.y = -this.height;
        this.image.x = Math.floor(Math.random() * stage.canvas.width);
    };

    Island.prototype.update = function () {
        this.image.y += this.dy;
        if (this.image.y >= (this.height + stage.canvas.height)) {
            this.reset();
        }
    };
    return Island;
})();

// Cloud Class
var Cloud = (function () {
    function Cloud() {
        this.image = new createjs.Bitmap(queue.getResult("cloud"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.image.regX = this.width * 0.5;
        this.image.regY = this.height * 0.5;
        stage.addChild(this.image);
        this.reset();
    }
    Cloud.prototype.reset = function () {
        this.image.y = -this.height;
        this.image.x = Math.floor(Math.random() * stage.canvas.width);
        this.dy = Math.floor(Math.random() * 5 + 5);
        this.dx = Math.floor(Math.random() * 4 - 2);
    };

    Cloud.prototype.update = function () {
        this.image.y += this.dy;
        this.image.x += this.dx;
        if (this.image.y >= (this.height + stage.canvas.height)) {
            this.reset();
        }
    };
    return Cloud;
})();

// Ocean Class
var Ocean = (function () {
    function Ocean() {
        this.image = new createjs.Bitmap(queue.getResult("ocean"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.dy = 5;
        stage.addChild(this.image);
        this.reset();
    }
    Ocean.prototype.reset = function () {
        this.image.y = -960;
    };

    Ocean.prototype.update = function () {
        this.image.y += this.dy;
        if (this.image.y >= 0) {
            this.reset();
        }
    };
    return Ocean;
})();

// The Distance Utility Function
function distance(p1, p2) {
    var firstPoint;
    var secondPoint;
    var theXs;
    var theYs;
    var result;

    firstPoint = new createjs.Point();
    secondPoint = new createjs.Point();

    firstPoint.x = p1.x;
    firstPoint.y = p1.y;

    secondPoint.x = p2.x;
    secondPoint.y = p2.y;

    theXs = secondPoint.x - firstPoint.x;
    theYs = secondPoint.y - firstPoint.y;

    theXs = theXs * theXs;
    theYs = theYs * theYs;

    result = Math.sqrt(theXs + theYs);

    return result;
}

// Check Collision between Plane and Island
function planeAndIsland() {
    var point1 = new createjs.Point();
    var point2 = new createjs.Point();

    point1.x = plane.image.x;
    point1.y = plane.image.y;
    point2.x = island.image.x;
    point2.y = island.image.y;
    if (distance(point1, point2) < ((plane.height * 0.5) + (island.height * 0.5))) {
        createjs.Sound.play("yay");
        scoreboard.score += 100;
        island.reset();
    }
}

// Check Collision between Plane and Cloud
function planeAndCloud(theCloud) {
    var point1 = new createjs.Point();
    var point2 = new createjs.Point();
    var cloud = new Cloud();

    cloud = theCloud;

    point1.x = plane.image.x;
    point1.y = plane.image.y;
    point2.x = cloud.image.x;
    point2.y = cloud.image.y;
    if (distance(point1, point2) < ((plane.height * 0.5) + (cloud.height * 0.5))) {
        createjs.Sound.play("thunder");
        scoreboard.lives -= 1;
        cloud.reset();
    }
}

// Collision Check Utility Function
function collisionCheck() {
    planeAndIsland();

    for (var count = 0; count < CLOUD_NUM; count++) {
        planeAndCloud(clouds[count]);
    }
}

var Scoreboard = (function () {
    function Scoreboard() {
        this.labelString = "";
        this.lives = PLAYER_LIVES;
        this.score = 0;
        this.label = new createjs.Text(this.labelString, GAME_FONT, FONT_COLOUR);
        this.update();
        this.width = this.label.getBounds().width;
        this.height = this.label.getBounds().height;

        stage.addChild(this.label);
    }
    Scoreboard.prototype.update = function () {
        this.labelString = "Lives: " + this.lives.toString() + " Score: " + this.score.toString();
        this.label.text = this.labelString;
    };
    return Scoreboard;
})();

// Main Game Function
function gameStart() {
    //var point1 = new createjs.Point();
    //var point2 = new createjs.Point();

    // ocean = new Ocean();
    //island = new Island();
    //plane = new Plane();
    lorn = new Lorn(200, GROUND_LEVEL);
    //fireballs = new createjs.Container();



    // for (var count = 0; count < CLOUD_NUM; count++) {
    //     //    clouds[count] = new Cloud();
    // }
    //scoreboard = new Scoreboard();
}
