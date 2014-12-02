// html element ref
var canvas;
// createjs stage
var stage;
// Preload queue
var queue;
// ENUM for keys
Key = {
    UP : 38,
    LEFT : 37,
    RIGHT : 39,
    SPACE : 32,
    R: 82,
    P: 80,
    I: 73,
    O:79,
    M: 77
}
// ENUM GAME STATE
Game = {
    HOME : 0,
    INSTRUCTIONS: 1,
    PLAYING : 2,
    OVER : 3
}
// Game state
var state;

// Loading Message
var loadingMSG;

// controls (bitmap img)
var controls

// reference for Instructions
var dejavuControls = false;

// game soundtrack
var soundtrack;

// brand layers for homeScreen
var redBrand, blackBrand, blueBrand;

// homescreen references
var brandContainer;
var middle;
var isAtHome = false;

// GAME OBJECTS
var display;
var lorn;
var diamond;

// GAME LISTS
// for FireBalls
var fireballs = [];
// for Trees
var trees = [];
// for Cats
var cats = [];
// bestScores
var bestScores = [];

// Game Constants
var GROUND_LEVEL = Math.max( window.innerHeight, document.body.clientHeight);
var CANVAS_WIDTH = Math.max( window.innerWidth, document.body.clientWidth);

function calculateMaxAspectRatio(){

    // 16:9 aspect ratio
    var minHeight = 90;
    var minWidth = 160;
    var finalHeight = minHeight * 3; // starts with 180
    var finalWidth = minWidth * 3; // per 320

    while (finalHeight+minHeight <= GROUND_LEVEL * 0.95 && finalWidth+minWidth <= CANVAS_WIDTH){
        finalHeight += minHeight;
        finalWidth += minWidth;
    }

    GROUND_LEVEL = finalHeight;
    CANVAS_WIDTH = finalWidth;
    
}    

var TREE_NUM = 11;
var CAT_NUM = 1;

var PARALLAX = 8;

var GAME_FONT = "VT323";
var FONT_SIZE = 22;
var FONT_COLOUR = "white";

function preload() {
    queue = new createjs.LoadQueue();
    queue.installPlugin(createjs.Sound);
    queue.addEventListener("loadstart", loading);
    
    queue.addEventListener("complete", init);
    queue.loadManifest([

        { id: "diamond-song",   src: "assets/sounds/Lorn-Diamond.mp3" },
        
        { id: "red-brand",      src: "assets/images/red-thin-brand.png"},
        { id: "black-brand",    src: "assets/images/black-thin-brand.png"},
        { id: "blue-brand",     src: "assets/images/blue-thin-brand.png"},

        { id: "lorn",           src: "assets/images/lorn-on-fire.png" },
        { id: "fireball",       src: "assets/images/fireball.png" },
        { id: "cat",            src: "assets/images/cat.png"},
        { id: "tree",           src: "assets/images/tree.png"},
        { id: "diamond",        src: "assets/images/diamond.png"},
        { id: "brand",          src: "assets/images/gamebrand.png"},

        { id: "controls",       src: "assets/images/controls.png"}
    ]);
}


function loading(){
    stage = new createjs.Stage(document.getElementById("canvas"));
    canvas = document.getElementById("canvas");

    log("BEFORE\nheight: " + GROUND_LEVEL + "\nwidth: " + CANVAS_WIDTH);

    calculateMaxAspectRatio();

    log("AFTER\nheight: " + GROUND_LEVEL + "\nwidth: " + CANVAS_WIDTH);

    canvas.width = CANVAS_WIDTH;
    canvas.height = GROUND_LEVEL; 
    canvasW = canvas.width;
    canvasH = canvas.height;

    var text = " . . . ";
    loadingMSG = new Display(text, 40, GAME_FONT, FONT_COLOUR, canvasW * 0.5, canvasH * 0.5);
    stage.addChild(loadingMSG.label);

    stage.update();

    // add progress listener to queue
    queue.addEventListener("progress", logProgress);

}

// log preload progress and updates loading msg at UI
function logProgress(event){

    var progress = event.progress;

    log("progress: " + progress);

    loadingMSG.update( parseInt(progress * 100) + "%");

    stage.update();
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
     
        case Game.INSTRUCTIONS:
            // instructions();
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

// Functions for each game state:


function setupHomeScreen(){

    if(!isAtHome){

        stage.clear();
        middle = new createjs.Point(canvasW * 0.5, canvasH * 0.5);
       
        redBrand = new Brand("red-brand", middle.x + 2, middle.y -2, -2);
        blackBrand = new Brand("black-brand", middle.x, middle.y, 0.3);
        blueBrand = new Brand("blue-brand", middle.x - 2, middle.y + 2, 2);

        brandContainer = new createjs.Container();

        brandContainer.addChild(redBrand.img);
        brandContainer.addChild(blueBrand.img);
        //black on top
        brandContainer.addChild(blackBrand.img);

        stage.addChild(brandContainer);

        stage.enableMouseOver(10);

        stage.on("stagemousemove", handleMouseOver);

        isAtHome = true;
    }
}

// makes the brand move accordingly to cursor movement
function handleMouseOver(evt){
    log("handling cursor over at " + createjs.Ticker.getMeasuredFPS() + " fps.");

    //read cursor coordinates
    var cursorX = evt.stageX;
    var cursorY = evt.stageY;

    // create Point whit cursor 
    var cursor = new createjs.Point(cursorX, cursorY);

    // apply movement to the brands in stage
    redBrand.update(cursor, middle);
    blackBrand.update(cursor, middle);
    blueBrand.update(cursor, middle);

    stage.update();

}


function homeScreen () {
    
    setupHomeScreen();

}

function playing(){

    // check if lorn is still alive
    if(lorn.lives <= 0){
        // capture lorn final scores
        lastStatus = lorn.getTotalScore();
        arrangeBestScores(lastStatus);
        state = Game.OVER;
    }

    // if he was not Strick
    if(!lorn.stricken)
        // for each cat in stage
        for (var count = 0; count < CAT_NUM; count++)
            // check colision with him
            if(rectCollisionDetection(lorn, cats[count])){
                // colision has happened
                lorn.wasStricken();
                log("Lorn lives: " + lorn.lives);
            }

    // check if lorn captures a diamond
    if(rectCollisionDetection(lorn, diamond)){
        
        lorn.colectDiamond();
        diamond.redefinePosition();
    }
    
    // update all the elements in stage
    updateTrees();
    updateFireBalls();
    updateCats();
    lorn.update(GROUND_LEVEL);
    diamond.update(lorn.getSense(true), PARALLAX);

    // get player status and update display screen
    display.update(lorn.toString());
}

function gameover() {
    stage.clear();

    stage.removeAllChildren();
    soundtrack.stop();
    fireballs = [];
    trees = [];
    cats = [];

    var gameoverMsg = new Display("GAME OVER", 50, "VT323", "white", canvasW * 0.5, canvasH *0.2);
    var scores = new Display("YOU SCORED "+ lastStatus, 85, "VT323", "white", canvasW * 0.5, canvasH *0.4);
    var theBest = new Display("BEST SCORES: "+ bestScores, 35, "VT323", "white", canvasW * 0.5, canvasH *0.6);
    var reminder = endMessage = new Display("press R to restart", 50, "VT323", "white", canvasW * 0.5, canvasH *0.8);
    
    stage.addChild(gameoverMsg.label);
    stage.addChild(scores.label);
    stage.addChild(theBest.label);
    stage.addChild(reminder.label);
    
}

function displayControls(){
    
    // if first time playing (function has not been called yet)
    if(!this.dejavuControls){

        // create bitmap ref for 'controls' id
        controls = getCentralizedBitmap("controls");
        controls.y = canvasW * 0.10;

        stage.addChild(controls);

        // hide controls after 5 seconds
        setTimeout(function(){
            stage.removeChild(controls);
            //and prevents function to be called again
            this.dejavuControls = true;
        }, 5000);
    }
}

//updates all trees in stage
function updateTrees(){
    
    for(var count = 0 ; count < TREE_NUM ; count++){
        var tree = trees[count];
        tree.update(lorn.getSense(true), PARALLAX);
        
        // reuse trees when they are out of the bounds
        if(tree.image.x < -(canvasW * 0.5)){
            tree.image.x = canvasW + canvasW * 0.25;
        }
        if(tree.image.x > canvasW + canvasW * 0.5){
            tree.image.x = -(canvasW * 0.25)
        }
    }
}

// update each fireball on stage and remove from stage the ones that are out of view.
function updateFireBalls(){
    
    for (i = 0; i < fireballs.length; i++) {

        var fb = fireballs[i];
        if(typeof fb !== 'undefined'){
            
            fb.update(lorn.getSense(true));

            var dismissable = false;
            
            if(fb.animation.x > canvasW + 15 || fb.animation.x < -15){
                dismissable = true;
            }

            // check colision between fireballs and cats
            for (var count = 0; count < CAT_NUM; count++) {
                var cat = cats[count];
                if(!dismissable && rectCollisionDetection(fb, cat)){
                    cat.randomizeCatDrop();
                    dismissable = true;
                    lorn.hitCat();
                    log("fireball has hitten a poor cat");
                }
            }
            
            if(dismissable)
                dismiss(fb, fireballs, i);
        }
    }
}

function updateCats(){
    for (var count = 0; count < CAT_NUM; count++) {
        
        cats[count].update(lorn.getSense(true));
    }
}

// Keyboard handlers

function handleKeyDown(event){

    if(state == Game.PLAYING)
    	switch(event.keyCode){
    		
    		case Key.UP:
    			log("Key.UP pressed");
    			lorn.startJump();
    			break;

    		case Key.LEFT:
    			log("Key.LEFT pressed");
    			lorn.moveLeft();
    			break;

    		case Key.RIGHT:
    			log("Key.RIGHT pressed");
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
    
        // should stop mouse tracking (not working properly)
        stage.enableMouseOver(0);
        state = Game.PLAYING;
        gameStart();
    
    }else{

    	switch(event.keyCode){
    		
    		case Key.UP:
    			log("Key.UP released");
    			lorn.endJump();
    			break;

    		case Key.SPACE:

    			log("Key.SPACE released");
    			x = lorn.animation.x;
    			y = lorn.animation.y;

                if(lorn.hasFireBalls()){
                    log("lorn's shooted");
    			     fireballs.push(new FireBall(x, y, lorn.getSense(false)));
                     lorn.shoot();
    			     stage.addChild(fireballs[fireballs.length - 1].animation);
                }
    			break;

    		case Key.LEFT:
    			log("Key.LEFT released");
    			lorn.stopMovingLeft();
    			break;

    		case Key.RIGHT:
    			log("Key.RIGHT released");
    			lorn.stopMovingRight();
    			break;

            // RESTART GAME if state is Game.OVER
            case Key.R:
                if(state == Game.OVER){
                    state = Game.PLAYING;
                    gameStart();
                }
                break;
    	}

    }
}

// auxiliar function for removing object from list and animation from stage
function dismiss(obj, list, index){
    if(typeof obj !== 'undefined'){
        stage.removeChild(obj.animation);
        list.splice(index,1);
    }
}

function rectCollisionDetection(obj, target){
    var frst = new AnimationBorder(obj);
    var scnd = new AnimationBorder(target);
    //log("borders: " + scnd.leftBound + ", "+ scnd.rightBound + ", " + scnd.topBound+ ", " + scnd.bottomBound)

    var collision = true;

    // If any side from FRST is outside of SCND
    if( frst.bottomBound <= scnd.topBound || frst.topBound >= scnd.bottomBound || frst.rightBound <= scnd.leftBound|| frst.leftBound >= scnd.rightBound)
    {
        collision = false;
    }

    if(collision)
        log("colision detected.");

    return collision;
}

// arrange  player's best scores in descending order
function arrangeBestScores(actualScore){
    
    if(bestScores.length < 5){
        
        bestScores.push(actualScore);
    }

    else if (bestScores[bestScores.length - 1] < actualScore){
        
        bestScores.pop();
        bestScores.push(actualScore);
    }

    bestScores.sort().reverse();
}

// Main Game Function
function gameStart() {
    
    stage.clear();
    stage.removeAllChildren();
    soundtrack.play();
    displayControls();

    var zOrder = [];
    // randomize values for parallax effect
    // values are used for scaling the trees
    // the smaller, the further
    for (var count = 0; count < TREE_NUM; count++) {

        zOrder.push((Math.random() - 0.4)+0.7);
    }
       
    // sort results for setting up trees order
    // smaller trees are added first in stage
    zOrder.sort();

    // add trees at the stage based on zOrder list (in ascending order)
    for (var count = 0; count < TREE_NUM; count++) {

        log("parallax: " + zOrder[count]);
        var t = new Tree(Math.random()* canvasW * 1.25, GROUND_LEVEL, zOrder[count]);
        stage.addChild(t.image);
        trees.push(t);
    }

    lorn = new Lorn(canvasW * 0.5, GROUND_LEVEL);
    stage.addChild(lorn.animation);

    diamond = new Diamond(canvasW + 30, GROUND_LEVEL - lorn.regY);
    stage.addChild(diamond.animation);

    for (var count = 0; count < CAT_NUM; count++) {

        cats.push(new Cat());
    }

    display = new Display(".", FONT_SIZE, GAME_FONT, FONT_COLOUR, 15, 0);
    stage.addChild(display.label);
}


