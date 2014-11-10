var GAME_FONT = "22px VT323";
var FONT_COLOUR = "#fff";
// Scoreboard Class

var Scoreboard = (function () {
    function Scoreboard() {
        this.labelString = "";
        this.label = new createjs.Text(this.labelString, GAME_FONT, FONT_COLOUR);
        this.update(".");

        this.label.x = 15;
        stage.addChild(this.label);
    }
    Scoreboard.prototype.update = function (text) {
        
        this.labelString = text;
        this.label.text = this.labelString;
    };
    return Scoreboard;
})();