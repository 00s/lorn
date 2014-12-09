/*
    {
        name:  "Death.js",
        author: "Adolfo Farias",
        description: "Class for Death character. Enemy."
    }
*/

var Death = (function () {

    
    // constructor
    function Death(x, y) {

        this._width  = 72;
        this._height = 60;

        // spriteSheet setup
        this.data = {
            images: [queue.getResult("death")],
            frames: { width: this._width, height: this._height, regX: 36, regY: 30},
            animations: {
                fly: [0, 11, "fly", 0.25]
            }
        };

        this.spriteSheet = new createjs.SpriteSheet(this.data);
        this.animation = new createjs.Sprite(this.spriteSheet, "fly");

        // x and y params used for seting the object in stage
        this.animation.x = x;
        this.animation.y = y;
        
        log("Death added at " + x +", "+ y);
    }


    Death.prototype.update = function () {

        this.wiggle();
    }

    // move the object randomically
    Death.prototype.wiggle = function () {

        this.animation.y += Math.sin(pvtToRad(pvtIncrementDegrees())) * Math.random() * 4;
        this.animation.x += Math.cos(pvtToRad(pvtIncrementDegrees())) * Math.random() * 4;
    }

    Death.prototype.redefinePosition = function (canvasW) {
        
        this.animation.x = canvasW * NEXT_POS_FACTOR;
    }

    // CONSTANTS

    var NEXT_POS_FACTOR = 5;

    // PRIVATE VARIABLES

    var degrees = 0;

    // PRIVATE FUNCTIONS (all functions started with 'pvt' (not prototyped))

    // randomically increment and return 'degrees' value (up to 360)
    function pvtIncrementDegrees(){

        degrees = (degrees + (Math.random() * 4) ) % 360;
        return degrees;
    }

    // auxiliar function to convert degrees in radians
    function pvtToRad(degress){

        return Math.PI / 180 * degress;
    }

	return Death;
})();
