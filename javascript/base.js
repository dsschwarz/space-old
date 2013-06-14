
var gamejs = require('gamejs');
var globals = require('globals');

var BaseSprite = function (rect) {
	BaseSprite.superConstructor.apply(this, arguments);
	this.center = [0,0]
	this._x = 100;
	this._y = 100;
	this.xspeed = 0;
	this.yspeed = 0;
	// rotation is clockwise from positive x-axis (gamejs thing)
	this.rotation = 0;
	this.center = [.5, .5];
	this.originalImage = new gamejs.Surface([0, 0])
	this.getSize = function() {
		return this.originalImage.getSize();
	}
	
	return this;
}

// inherit (actually: set prototype)
gamejs.utils.objects.extend(BaseSprite, gamejs.sprite.Sprite);


exports.BaseSprite = BaseSprite;