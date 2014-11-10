var GAME_FONT = "25px Consolas";
var FONT_COLOUR = "#fff";
// Scoreboard Class

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
    Scoreboard.prototype.update = function (lives, distance, score) {
        
        this.labelString = "Lives: " + lives + " Distance: "+ distance + " Score: " + score;
        this.label.text = this.labelString;
    };
    return Scoreboard;
})();