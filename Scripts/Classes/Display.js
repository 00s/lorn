// Display Class

var Display = (function () {

    // constructor
    function Display(initialText, size, font, color, x, y) {
        this.labelString = initialText;
        this.label = new createjs.Text(this.labelString, size +"px "+ font, color);
        this.update(this.labelString);

        this.label.x = x;
        this.label.y = y

        this.label.regX = this.label.getBounds().width * 0.5;
        this.label.regY = this.label.getBounds().height * 0.5;

        stage.addChild(this.label);
    }

    // updates the text displayed
    Display.prototype.update = function (text) {
        
        this.labelString = text;
        this.label.text = this.labelString;
    };
    return Display;
})();