var Brand = (function  (){
	

	function Brand(idOrUrl, x,y,z){

		this.img = new createjs.Bitmap(queue.getResult(idOrUrl));

	    this.img.regX = this.img.getBounds().width * 0.5;
	    this.img.regY = this.img.getBounds().height * 0.5;
	    this.img.x = x
	    this.img.y = y;
	    this.z = z;
	}

	Brand.prototype.update = function (point, counterPoint){
		this.img.x = counterPoint.x +  (point.x - counterPoint.x) / 30 * this.z;
		this.img.y = counterPoint.y + (point.y - counterPoint.y) / 30 * this.z;
	}

	return Brand;
})();