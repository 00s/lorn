var stage;
var queue;
var canvas;

// Game Objects
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
// Tree Array
var trees = [];
// Cats Array
var cats = [];

// Game Constants
var TREE_NUM = 11;
var GAME_FONT = "40px Consolas";
var FONT_COLOUR = "#FFFF00";
var PLAYER_LIVES = 3;
var GRAVITY  = 0.6;
var GROUND_LEVEL = Math.max( window.innerHeight, document.body.clientHeight) - 35;
var FIREBALL_SPEED = 9;
var LORN_MOVE = 6;
var LORN_REG_Y = 24;
var CAT_REG_Y = 16;
var CAT_NUM = 4;
var TREE_REG_Y = 124;
var RIGHT = 1;
var LEFT = -1;

function preload() {
    queue = new createjs.LoadQueue();
    queue.installPlugin(createjs.Sound);
    queue.addEventListener("complete", init);
    queue.loadManifest([
        { id: "yay", src: "sounds/yay.ogg" },
        { id: "thunder", src: "sounds/thunder.ogg" },
        { id: "engine", src: "sounds/engine.ogg" },
        { id: "lorn", src: "images/lorn.png" },
        { id: "fireball", src: "images/fireball.png" },
        { id: "cat", src: "images/cat.png"},
        { id: "tree", src: "images/tree.png"}
    ]);
}

function init() {
    stage = new createjs.Stage(document.getElementById("canvas"));
    canvas = document.getElementById("canvas");

    canvas.width = document.body.clientWidth; //document.width is obsolete
    canvas.height = GROUND_LEVEL; //document.height is obsolete
    canvasW = canvas.width;
    canvasH = canvas.height;

    // handlers for keyboard inputs
    window.addEventListener( "keydown", handleKeyDown, false );
    window.addEventListener( "keyup", handleKeyUp, false );
    
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

			fireballs.push(new FireBall(x, y, lorn.getSense(false)));
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

            var dismissable = false;
            
            if(fireballs[i].animation.x > canvasW || fireballs[i].animation.x < 0){
                dismiss(fireballs[i], fireballs, i);
                dismissable = true;
            }

            for (var count = 0; count < CAT_NUM; count++) {
                var cat = cats[count];
                if(rectCollisionDetection(fireballs[i], cat)){
                    cat.randomizeCatDrop();
                    dismissable = true;
                    console.log("fireball on target");
                }
            }
            if(dismissable)
                dismiss(fireballs[i], fireballs, i);
    	}
	}

    if(!lorn.hitten)
        for (var count = 0; count < CAT_NUM; count++) {
            if(rectCollisionDetection(lorn, cats[count])){
                lorn.wasHitten();
                console.log("Lorn lives: " + lorn.lives);
            }
        }

    for(var count = 0 ; count < TREE_NUM ; count++){
        var tree = trees[count];
        tree.move(lorn.getSense(true));
        
        // reuse trees when they are out of the bounds
        if(tree.image.x < -(canvasW * 0.5)){
            tree.image.x = canvasW + canvasW * 0.25;
        }
        if(tree.image.x > canvasW + canvasW * 0.5){
            tree.image.x = -(canvasW * 0.25)
        }

    }

    lorn.update();
    
    for (var count = 0; count < CAT_NUM; count++) {
        cats[count].update(lorn.getSense(true));
    }
    scoreboard.update;
    stage.update();
}

// auxiliar function for removing object from list and animation from stage
function dismiss(obj, list, index){
    stage.removeChild(obj.animation);
    list.splice(index,1);
}

// Class for holding corner references of Animation objects
var AnimationBorder = (function(){
    function AnimationBorder(obj){

        var objW = obj._width;
        var objH = obj._height;
        
        this.leftBound = obj.animation.x - (objW * 0.5);
        this.rightBound = this.leftBound + objW;
        this.topBound = obj.animation.y - (objH * 0.5);
        this.bottomBound = this.topBound + objH;
        
    }

    return AnimationBorder;
})();

function rectCollisionDetection(obj, target){
    var frst = new AnimationBorder(obj);
    var scnd = new AnimationBorder(target);
    //console.log("borders: " + scnd.leftBound + ", "+ scnd.rightBound + ", " + scnd.topBound+ ", " + scnd.bottomBound)

    var collision = true;

    // If any side from FRST is outside of SCND
    if( frst.bottomBound <= scnd.topBound || frst.topBound >= scnd.bottomBound || frst.rightBound <= scnd.leftBound|| frst.leftBound >= scnd.rightBound)
    {
        collision = false;
    }

    if(collision)
        console.log("colision detected.");

    return collision;
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
    //tree = new Tree(canvasW -100, GROUND_LEVEL, 0.5);
    //fireballs = new createjs.Container();


    var zOrder = [];
    // randomize values for parallax effect
    for (var count = 0; count < TREE_NUM; count++) {

        zOrder.push((Math.random() - 0.5)+0.7);
    }
        // sort results for setting up trees order
        zOrder.sort();


    // add trees at the stage based on zOrder list (in ascending order)
    for (var count = 0; count < TREE_NUM; count++) {

        console.log("parallax: " + zOrder[count]);
        trees[count] = new Tree(Math.random()* canvasW * 1.25, GROUND_LEVEL, zOrder[count]);
    }

    lorn = new Lorn(canvasW * 0.5, GROUND_LEVEL - LORN_REG_Y);

    for (var count = 0; count < CAT_NUM; count++) {

        cats.push(new Cat());
    }

    scoreboard = new Scoreboard();
}
