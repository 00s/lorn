// GLOBAL VARIABLES

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

// ENUM LEVELS
Level =  {
    FIRST: 1,
    SECOND: 2,
    THIRD: 3,
    NONE: 4
}
// Level ref
var actualLevel;

// Game state
var state;

// Reminder on Home Screen
var remind;

// Loading Message
var loadingMSG;

// controls (bitmap img)
var controls;
// display level
var dispLevel;
// flickr setinterval
var flickr;

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
var death = null;

// GAME LISTS
// for FireBalls
var fireballs = [];
// for Trees
var trees = [];
// for Cats
var cats = [];
// bestScores
var bestScores = [];
// deathballs
var deathballs = [];

// Game Constants
var GROUND_LEVEL = Math.max( window.innerHeight, document.body.clientHeight);
var CANVAS_WIDTH = Math.max( window.innerWidth, document.body.clientWidth);