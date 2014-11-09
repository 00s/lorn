var Tree = (function () {
	function Tree (x, y, parallax) {

		this.PARALLAX_FACTOR = 3;
		this.parallax = parallax;

        this.image = new createjs.Bitmap(queue.getResult("tree"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
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