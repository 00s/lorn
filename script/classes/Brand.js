var Brand = (function  (){
	
	// the bigger this variable, the less the shift (.update fuction)
	var PARALLAX_VARIATION = 70;

	function Brand(idOrUrl, x,y,z){

		this.img = new createjs.Bitmap(queue.getResult(idOrUrl));

	    this.img.regX = this.img.getBounds().width * 0.5;
	    this.img.regY = this.img.getBounds().height * 0.5;
	    this.img.x = x
	    this.img.y = y;
	    this.z = z;
	}

	// parallax movement based on 2 points
	Brand.prototype.update = function (point, counterPoint){
		this.img.x = counterPoint.x +  (point.x - counterPoint.x) / PARALLAX_VARIATION * this.z;
		this.img.y = counterPoint.y + (point.y - counterPoint.y) / PARALLAX_VARIATION * this.z;
	}

	return Brand;
})();