var gamejs = require('gamejs');
var $v = require('gamejs/utils/vectors');
var $e = require('gamejs/event');
var globals = require('globals');

/**
 * Projectile is the base class for all weapons.
 * 
 */
var Projectile = function(rect) {
   this.rect = new gamejs.Rect(rect);
}