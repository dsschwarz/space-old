
var gamejs = require('gamejs');

var BaseSprite = function (rect) {
	this.center = [0,0]
   this._x = 0;
   this._y = 0;
	this.getSize = function() {
		return this.originalImage.getSize();
	}
}

// inherit (actually: set prototype)
gamejs.utils.objects.extend(BaseSprite, gamejs.sprite.Sprite);


exports.BaseSprite = BaseSprite;