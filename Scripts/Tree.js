var BLUR_AMOUNT = 20;
var BLUR_RADIUS = 1;

var Tree = (function () {
	function Tree (x, y, parallax) {

		this.PARALLAX_FACTOR = 8;
		this.parallax = parallax;

        this.image = new createjs.Bitmap(queue.getResult("tree"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;

        var blur = new createjs.BlurFilter((1.2 - parallax) *BLUR_AMOUNT,(1.2 - parallax) *BLUR_AMOUNT,BLUR_RADIUS);
        this.image.filters = [blur];

        this.image.cache(0,0,this.width, this.height);

        this.image.regX = this.width * 0.5;
        this.image.regY = this.height;

        this.image.scaleX *= parallax;
        this.image.scaleY *= parallax;
        this.image.x = x;
        this.image.y = y;

        stage.addChild(this.image);

	}

	Tree.prototype.move = function (sense) {
		this.image.x -= sense*(this.parallax * this.PARALLAX_FACTOR);
	}

	return Tree;
})();