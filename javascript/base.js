
var gamejs = require('gamejs');
var globals = require('globals');

var BaseSprite = function (rect) {
	var particleImage = gamejs.image.load('images/particle.png');
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
	this.attach_particles = function() {
		var speed = -80 - Math.random() * 40;
		var sidespeed = 60 - Math.random() * 120;
		var pos = globals.get_position([this._x, this._y], [.5, .5], particleImage.getSize(), 0);
		globals.particles.push({
	       left: pos[0],
	       top: pos[1],
	       timer: 18 + Math.random()*4,
	       alpha: Math.random(),
	       deltaX: Math.cos(this.rotation / 180 * Math.PI) * speed + Math.sin(this.rotation / 180 * Math.PI) * sidespeed,
	       deltaY: Math.cos(this.rotation / 180 * Math.PI) * sidespeed + Math.sin(this.rotation / 180 * Math.PI) * speed,
	    });
	}
}

// inherit (actually: set prototype)
gamejs.utils.objects.extend(BaseSprite, gamejs.sprite.Sprite);


exports.BaseSprite = BaseSprite;