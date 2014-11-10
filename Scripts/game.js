// © 

var stage;
var queue;
var canvas;

// ENUM for keys
Key = {
    UP : 38,
    LEFT : 37,
    RIGHT : 39,
    SPACE : 32,
    P: 80,
    I: 73,
    O:79,
    M: 77
}
// ENUM GAME STATE
Game = {
    HOME : 0,
    PLAYING : 1,
    OVER : 2
}

// Game state
var state;

//controls
var controls

// reference for Instructions
var dejavu = false;

// gameOver obj
var endMessage

// soundtrack
var soundtrack;

// Game Objects
var display;
var lorn;
var diamond;


// FireBall Array
var fireballs = [];
// Tree Array
var trees = [];
// Cats Array
var cats = [];


// Game Constants
var TREE_NUM = 11;
var CAT_NUM = 4;

var GROUND_LEVEL = Math.max( window.innerHeight, document.body.clientHeight) - 35;
var PARALLAX = 8;
var LORN_REG_Y = 24;
var CAT_REG_Y = 16;
var TREE_REG_Y = 124;
var GAME_FONT = "VT323";
var FONT_SIZE = 22;
var FONT_COLOUR = "white";

function preload() {
    queue = new createjs.LoadQueue();
    queue.installPlugin(createjs.Sound);
    queue.addEventListener("loadstart", loading);
    queue.addEventListener("complete", init);
    queue.loadManifest([
        { id: "diamond-song", src: "sounds/Lorn-Diamond.ogg" },
        { id: "thunder", src: "sounds/thunder.ogg" },
        { id: "engine", src: "sounds/engine.ogg" },
        { id: "lorn", src: "images/lorn.png" },
        { id: "fireball", src: "images/fireball.png" },
        { id: "cat", src: "images/cat.png"},
        { id: "tree", src: "images/tree.png"},
        { id: "diamond", src: "images/diamond.png"},
        { id: "brand", src: "images/gamebrand.png"},
        { id: "controls", src: "images/controls.png"}
    ]);
}

function loading(){
    stage = new createjs.Stage(document.getElementById("canvas"));
    canvas = document.getElementById("canvas");

    canvas.width = document.body.clientWidth; //document.width is obsolete
    canvas.height = GROUND_LEVEL; //document.height is obsolete
    canvasW = canvas.width;
    canvasH = canvas.height;
    stage.addChild(new Display(". . .", 90, GAME_FONT, FONT_COLOUR, canvasW * 0.45, canvasH * 0.5));
}

function init() {
    stage.removeAllChildren();
    // game soundtrack
    soundtrack = createjs.Sound.play("diamond-song"); 
    soundtrack.stop();
    soundtrack.addEventListener("complete", createjs.proxy(this.handleComplete, this));
    soundtrack.volume = 0.1;

    // handlers for keyboard inputs
    window.addEventListener( "keydown", handleKeyDown, false );
    window.addEventListener( "keyup", handleKeyUp, false );
    
    //stage.enableMouseOver(20);
    createjs.Ticker.setFPS(40);
    createjs.Ticker.addEventListener("tick", gameLoop);

    //gameStart();
    state = Game.HOME;
    
}


// Game Loop
function gameLoop(event) {

    // switches between game states
    switch(state){

        case Game.HOME:
            homeScreen();
            break;
     
        case Game.PLAYING:
            playing();
            break;

        case Game.OVER:
            gameover();
            break;
    }

    stage.update();
}

function getCentralizedBitmap(idOrUrl){
    var bit = new createjs.Bitmap(queue.getResult(idOrUrl));
    bit.regX = bit.getBounds().width * 0.5;
    bit.regY = bit.getBounds().height * 0.5;
    bit.x = canvasW * 0.5;
    bit.y = canvasH * 0.5;
    return bit;
}

function homeScreen () {
    stage.clear();
    var brand = getCentralizedBitmap("brand");
    stage.addChild(brand);
}

function presentControls(){
    
    if(!this.dejavu){

        controls = getCentralizedBitmap("controls");
        controls.y = canvasW * 0.10;
        stage.addChild(controls);

        setTimeout(function(){
            stage.removeChild(controls);
            this.dejavu = true;
        }, 5000);
    }
}

function playing(){

    
    if(lorn.lives <= 0)
        state = Game.OVER;

    if(!lorn.hitten)
        for (var count = 0; count < CAT_NUM; count++) {
            if(rectCollisionDetection(lorn, cats[count])){
                lorn.wasHitten();
                console.log("Lorn lives: " + lorn.lives);
            }
        }

    updateTrees();
    lorn.update();
    updateFireBalls();

    diamond.update(lorn.getSense(true), PARALLAX);
    
    if(rectCollisionDetection(lorn, diamond)){
        lorn.colectDiamond();
        diamond.redefinePosition();
    }

    for (var count = 0; count < CAT_NUM; count++) {
        cats[count].update(lorn.getSense(true));
    }

    // get player status and update display screen
    display.update(lorn.toString());
}

function gameover() {
    // gameover
    lastStatus = lorn.getTotalScore();
    lastStatus = (lastStatus > 0) ? lastStatus : 0;

    stage.clear();

    stage.removeAllChildren();
    soundtrack.stop();
    fireballs = [];
    trees = [];
    cats = [];

    var gameoverMsg = new Display("GAME OVER", 90, "VT323", "white", canvasW * 0.5, canvasH *0.2);
    var scores = new Display("YOU SCORED "+ lastStatus, 85, "VT323", "white", canvasW * 0.5, canvasH *0.5);
    var reminder = endMessage = new Display("press space to restart", 50, "VT323", "white", canvasW * 0.5, canvasH *0.8);
    
}
function updateTrees(){
    
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
}

function updateFireBalls(){
    // update each fireball on stage and remove from stage the ones that are out of view.
    for (i = 0; i < fireballs.length; i++) {
        if(fireballs[i] !== undefined){
            fireballs[i].update(lorn.getSense());

            var dismissable = false;
            
            if(fireballs[i].animation.x > canvasW || fireballs[i].animation.x < 0){
                dismiss(fireballs[i], fireballs, i);
                dismissable = true;
            }

            // check colision between fireballs and cats
            for (var count = 0; count < CAT_NUM; count++) {
                var cat = cats[count];
                if(rectCollisionDetection(fireballs[i], cat)){
                    cat.randomizeCatDrop();
                    dismissable = true;
                    lorn.hitCat();
                    console.log("fireball has hitten a poor cat");
                }
            }
            if(dismissable)
                dismiss(fireballs[i], fireballs, i);
        }
    }
}

// Keyboard handlers

function handleKeyDown(event){

    if(state == Game.PLAYING)
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

            case Key.I:
                // volume down
                soundtrack.volume -= 0.05;
                break;

            case Key.O:
                // volume up
                soundtrack.volume += 0.05;
                break;

            case Key.M:
                soundtrack.setMute(!soundtrack.getMute());
                break;

            case Key.P:

                break;
    	}
}

function handleKeyUp(event){

    if(state == Game.HOME){
    
        state = Game.PLAYING;
        gameStart();
    
    }else{

    	switch(event.keyCode){
    		
    		case Key.UP:
    			console.log("Key.UP released");
    			lorn.endJump();
    			break;

    		case Key.SPACE:

                // RESTART GAME if state is Game.OVER
                if(state == Game.OVER){
                    state = Game.PLAYING;
                    gameStart();
                    //init();
                }

    			console.log("Key.SPACE released");
    			x = lorn.animation.x;
    			y = lorn.animation.y;

                if(lorn.hasFireBalls()){
                    console.log("lorn's shooted");
    			     fireballs.push(new FireBall(x, y, lorn.getSense(false)));
                     lorn.shoot();
    			     stage.addChild(fireballs[fireballs.length - 1].animation);
                }
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
}

// auxiliar function for removing object from list and animation from stage
function dismiss(obj, list, index){
    stage.removeChild(obj.animation);
    list.splice(index,1);
}

// Class for holding corner references of Animation objects
var AnimationBorder = (function(){
    function AnimationBorder(obj){

        // used to reduced the final area (in pixels)
        var CORRECTION = 3;

        var objW = obj._width;
        var objH = obj._height;
        
        this.leftBound      = (obj.animation.x - (objW * 0.5))      + CORRECTION;
        this.rightBound     = (this.leftBound + objW)               - CORRECTION;
        this.topBound       = (obj.animation.y - (objH * 0.5))      + CORRECTION;
        this.bottomBound    = (this.topBound + objH)                - CORRECTION;
        
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


// Main Game Function
function gameStart() {
    

    stage.clear();
    stage.removeAllChildren();
    soundtrack.play();
    presentControls();

    var zOrder = [];
    // randomize values for parallax effect
    for (var count = 0; count < TREE_NUM; count++) {

        zOrder.push((Math.random() - 0.4)+0.7);
    }
        // sort results for setting up trees order
        zOrder.sort();


    // add trees at the stage based on zOrder list (in ascending order)
    for (var count = 0; count < TREE_NUM; count++) {

        console.log("parallax: " + zOrder[count]);
        trees[count] = new Tree(Math.random()* canvasW * 1.25, GROUND_LEVEL, zOrder[count]);
    }

    lorn = new Lorn(canvasW * 0.5, GROUND_LEVEL - LORN_REG_Y);

    diamond = new Diamond(canvasW + 30, GROUND_LEVEL - LORN_REG_Y);

    for (var count = 0; count < CAT_NUM; count++) {

        cats.push(new Cat());
    }

    display = new Display(".", FONT_SIZE, GAME_FONT, FONT_COLOUR, 15, 0);
}
