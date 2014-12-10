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