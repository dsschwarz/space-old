/**
 * The ship is the player. Has x and y speed, acclr and declr rates.
 * Able to fire and 'jump'
 * Functions:
 * update(msDuration) - Executes every tick. Moves ship, adjusts cooldowns
 * fire(key) - fires the weapon mapped to that key
 * jump() - moves the ship towards the mouse, equal to jump_charge value
 * acclr() - accelerates the ship.
 */

var gamejs = require('gamejs');
var $v = require('gamejs/utils/vectors');
var $e = require('gamejs/event');
var globals = require('globals');
var base = require('base')

var max_jump_charge = 800;
var min_jump_charge = 100;

var Ship = function(rect) {
   // call superconstructor
   Ship.superConstructor.apply(this, arguments);

   // Physics Properties
   this.xspeed = 0;
   this.yspeed = 0;
   this.accleration = 60; // How fast ship accelerates (constant)
   this.deceleration = .52; // Percentage ship slows per second
   this.angular_v = 0; // Angular velocity (how fast it's rotating; deg/s)
   this.angular_a = 10; // How fast ship turns (constant)
   this.angular_d = .97; // Percentage angular velocity slows per second

   // Special Properties
   this.jump_charge = 0;
   this.charge_rate = 100;
   this.reload_time = [3,1,2];
   this.heat = 0;
   this.heat_max = 100;
   this.cool_rate = 10;
   this.overheat = 10;

   // Flags
   this.charging = false;
   this.accelerating = false;
   // 1 if rotating right, -1 if left, else 0.
   this.rotating = 0;
   this.weapon_ready = [false, false, false];
   // If overheated, != 0, counts down per second
   this.o_timer = 0;

   // Display Properties
   this.originalImage = gamejs.image.load("images/ship.png");
   this.chargeImage = gamejs.image.load("images/ship_charge.gif");
   var dims = this.originalImage.getSize();
   // rotation is clockwise from positive x-axis (gamejs thing)
   this.rotation = 0;
   this.image = gamejs.transform.rotate(this.originalImage, this.rotation);
   this.center = [.33, .5] // Percentage width/height from left/top
   this.rect = new gamejs.Rect(rect);
   return this;
};
// inherit (actually: set prototype)
gamejs.utils.objects.extend(Ship, base.BaseSprite);


Ship.prototype.update = function(msDuration) {
   this.rotate(msDuration);
   this.move(msDuration);
   this.check_heat(msDuration);
   // Jump charge
   if (this.charging) {
      if (this.o_timer > 0) {
         this.charging = false;
         this.jump_charge = 0;
      } else {
         this.image = gamejs.transform.rotate(this.chargeImage, this.rotation);
         if (this.jump_charge < max_jump_charge) {
            this.jump_charge += this.charge_rate * (msDuration/1000);
            this.heat += .3 * this.charge_rate * (msDuration/1000);
         }
      }
   } else {
      this.image = gamejs.transform.rotate(this.originalImage, this.rotation);
   }
   var position = globals.get_position([this._x, this._y], this.center, this.getSize(), -this.rotation);
   this.rect.left = position[0];
   this.rect.top = position[1];
};
Ship.prototype.move = function(msDuration) {
   // Call this from update. Otherwise, acclr depends on comp specs
   if (this.accelerating && (this.o_timer == 0)) {
      this.xspeed += Math.cos(this.rotation/180*Math.PI)*this.accleration*(msDuration/1000);
      this.yspeed += Math.sin(this.rotation/180*Math.PI)*this.accleration*(msDuration/1000);
   };
   this.yspeed *= 1-(this.deceleration * (msDuration/1000));
   this.xspeed *= 1-(this.deceleration * (msDuration/1000));
   this._x += this.xspeed * (msDuration/1000);
   this._y += this.yspeed * (msDuration/1000);
   this.check_in_bounds();
};
Ship.prototype.rotate = function(msDuration) {
   if (this.o_timer == 0) {
      this.angular_v += this.rotating * this.angular_a * (msDuration/1000);
   }
   this.angular_v *= 1-(this.angular_d * (msDuration/1000));
   this.rotation += this.angular_v;
   if (this.rotation > 360) {
      this.rotation = this.rotation%360;
      console.log("Decrementing Rotation by 360: " + this.rotation)
   }
   while (this.rotation < 0) {
      this.rotation += 360;
      console.log("Increasing rotation: " + this.rotation)
   }
}
Ship.prototype.fire = function(key) {
   switch(key) 
   {
   case $e.K_w:
      console.log("1: " + key)
      break;
   case $e.K_q:
      console.log("2: "+ key)
      break;
   case $e.K_e:
      console.log("3 " + key)
      break;
   default:
      console.log("invalid key")
      break;
   }
};
Ship.prototype.jump = function() {
   if (this.jump_charge > min_jump_charge) {
      this.jump_charge -= min_jump_charge;
      this._x += this.jump_charge*Math.cos(this.rotation/180*Math.PI)
      this._y += this.jump_charge*Math.sin(this.rotation/180*Math.PI);
   }
   this.check_in_bounds();
   this.jump_charge = 0;
   this.charging = 0;
};
Ship.prototype.check_heat = function(msDuration) {
   if ((this.heat > this.heat_max) && (this.o_timer == 0)) {
      this.o_timer = this.overheat;
      this.heat = this.heat_max * .95
   } else if (this.o_timer > 0) {
      console.log("Counting down")
      console.log(this.o_timer)
      this.o_timer -= this.cool_rate * (msDuration/1000);
      if (this.o_timer < 0) {
         this.o_timer = 0;
      }
   } else if(this.heat > 0) {
      this.heat -= this.cool_rate * (msDuration/1000);
      if (this.heat < 0) {
         this.heat = 0;
      }
   }
}

// Utilities
Ship.prototype.begin_charge = function() {
   if (this.o_timer == 0) {
      this.charging = true;
   }
}
Ship.prototype.point_to = function(coords) {
   var diff = $v.subtract(coords, [this._x, this._y]);
   console.log(diff)
   // this.rotation = Math.atan2(diff[1], diff[0]) * 180 / Math.PI
   // this.image = gamejs.transform.rotate(this.originalImage, this.rotation);
};
Ship.prototype.check_in_bounds = function() {
   if (this._y > globals.height) {
      this._y = 0;
   } else if (this._y < 0 ) {
      this._y = globals.height;
   }
   if (this._x > globals.width) {
      this._x = 0;
   } else if (this._x < 0 ) {
      this._x = globals.width;
   }
};

exports.Ship = Ship;