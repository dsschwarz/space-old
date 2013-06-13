var gamejs = require('gamejs');
var $v = require('gamejs/utils/vectors');
var $e = require('gamejs/event');
var globals = require('globals');
var base = require('base')


/**
 * Projectile is the base class for all weapons.
 * 
 */
var Projectile = function(rect) {
   Projectile.superConstructor.apply(this, arguments);
   this.rect = new gamejs.Rect(rect);
   this._x = Math.random() * globals.width;
   this._y = Math.random() * globals.height;
   this.xspeed = Math.random()*2 - 1;
   this.yspeed = Math.random()*2 - 1;
   this.originalImage = gamejs.image.load("images/wiki.png");
   this.image = gamejs.transform.scale(this.originalImage, [20, 20]); 
   this.rect = new gamejs.Rect([this._x, this._y]);
   return this;
}
gamejs.utils.objects.extend(Projectile, base.BaseSprite);
Projectile.prototype.update = function(msDuration) {
	var _s = msDuration/1000;
	// call superconstructor
	this._x += this.xspeed * _s;
	this._y += this.yspeed * _s;
	var pos = globals.get_position([this._x, this._y], [.5, .5], this.getSize(), 0);
	console.log(globals.offset)
	this.rect.left = pos[0];
	this.rect.top = pos[1];
}

exports.Projectile = Projectile;