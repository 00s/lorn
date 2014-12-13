/*
	Helper functions :
		must be required before Classes and game.js
*/

// DEBUG LOG
var DEBUG = false;

// log into console if DEBUG is 'true' 
function log(msg){
    if (DEBUG == true)
        console.log(msg);
}

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

// Helper Class for holding corner references of Animation objects
var AnimationBorder = (function(){
	//constructor (all we need)
    function AnimationBorder(obj){

        // used to reduced the final area (in pixels)
        var CORRECTION = 5;

        // avoids access to unnaccessible object parameter
        if(typeof obj !== 'undefined'){

            var objW = obj._width;
            var objH = obj._height;
            
            this.leftBound      = (obj.animation.x - (objW * 0.5))      + CORRECTION;
            this.rightBound     = (this.leftBound + objW)               - CORRECTION;
            this.topBound       = (obj.animation.y - (objH * 0.5))      + CORRECTION;
            this.bottomBound    = (this.topBound + objH)                - CORRECTION;
        }
    }

    return AnimationBorder;
})();

// Helper Class for static animations used in stage
var Gif = (function (){

    function Gif (idOrUrl, x, y, frameW, frameH){

        this._width  = frameW;
        this._height = frameH;

        // spriteSheet setup
        this.data = {
            images: [queue.getResult(idOrUrl)],
            frames: {   width: this._width, 
                        height: this._height, 
                        regX: frameW * 0.5, 
                        regY: frameH * 0.5
            },

            animations: {
                s: {
                    frames: [0,1,2,3,4,5],
                    next: "s",
                    speed: 0.4
                }
            }

        };

        this.spriteSheet = new createjs.SpriteSheet(this.data);
        this.animation = new createjs.Sprite(this.spriteSheet, "s");

        // x and y params used for seting the object in stage
        this.animation.x = x;
        this.animation.y = y;
    }

    return Gif;
})();

// return a bitmap object with regX and regY defined at the middle of the image
function getCentralizedBitmap(idOrUrl){
    var bit = new createjs.Bitmap(queue.getResult(idOrUrl));
    bit.regX = bit.getBounds().width * 0.5;
    bit.regY = bit.getBounds().height * 0.5;
    bit.x = canvasW * 0.5;
    bit.y = canvasH * 0.5;
    return bit;
}


// auxiliar function for removing object from list and animation from stage
function dismiss(obj, list, index){
    if(typeof obj !== 'undefined'){
        stage.removeChild(obj.animation);
        list.splice(index,1);
    }
}

// auxiliar function for displaying the actual level with preset definitions
function DisplayLevel(levelTxt){

    var disp = new Display(levelTxt, FONT_SIZE, GAME_FONT, FONT_COLOUR, canvasW * 0.5, canvasH * 0.5);
    stage.addChildAt(disp.label);

    log(levelTxt);
    
    var timeout = setTimeout(function(){
        stage.removeChildAt(disp.label);
    }, 2000);

    return timeout;
}



// rectangular collision detection
function rectCollisionDetection(obj, target){
    var frst = new AnimationBorder(obj);
    var scnd = new AnimationBorder(target);
    //log("borders: " + scnd.leftBound + ", "+ scnd.rightBound + ", " + scnd.topBound+ ", " + scnd.bottomBound)

    var collision = true;

    // check if parameters are defined
    if (typeof obj == 'undefined' || typeof target == 'undefined')
    {
        collision = false;
    }
    // and then, if any side from FRST is outside of SCND
    else if( frst.bottomBound <= scnd.topBound 
            || frst.topBound >= scnd.bottomBound 
            || frst.rightBound <= scnd.leftBound
            || frst.leftBound >= scnd.rightBound)
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

function changeCanvasColor(color){
    document.getElementById("canvas").style.backgroundColor = color;
    console.log(" color changed to " + color);
}
