/**
 * Space shooter. Awesomeness.
 */

var gamejs = require('gamejs');
var $v = require('gamejs/utils/vectors');
var $e = require('gamejs/event');
var globals = require('globals');
var $ship = require('ship');


/**
 * M A I N
 */

function main() {
   // screen setup
   var display = gamejs.display.setMode([globals.width, globals.height]);
   gamejs.display.setCaption("Example Sprites");
   // create ship
   var ship = new $ship.Ship([100, 100]);

   var particleImage = gamejs.image.load('images/particle.png');

   // game loop
   var mainSurface = gamejs.display.getSurface();
   // msDuration = time since last tick() call
   gamejs.onTick(function(msDuration) {
         mainSurface.fill("#000000");
         globals.particles.forEach(function(particle) {
            var r = (msDuration/1000);
            particle.timer -= 1;
            particle.left += particle.deltaX * r;
            particle.top += particle.deltaY * r;

         });


         if (globals.particles.length > 0) {
            globals.particles = globals.particles.filter(function(particle) {
                return particle.timer > 0;
            });
         }
         globals.particles.forEach(function(particle) {
            particleImage.setAlpha(particle.alpha);
            display.blit( particleImage, [particle.left, particle.top]);
         });
         
         // Draw heat
         if (ship.o_timer == 0) {
            gamejs.draw.rect(display, '#ffffff', new gamejs.Rect([globals.width * .05, 10], [globals.width * .9, 20]), 0);
            gamejs.draw.rect(display, '#3333ee', new gamejs.Rect([globals.width * .05, 10], [ship.heat / ship.heat_max * globals.width * .9, 20]), 0);
         } else {
            gamejs.draw.rect(display, '#ee3333', new gamejs.Rect([globals.width * .05, 10], [globals.width * .9, 20]), 0);
         }
         ship.update(msDuration);
         ship.draw(mainSurface);


   });

   gamejs.onEvent(function(event) {
      //Keys that fire ship weapons
      var fire_keys = [$e.K_w, $e.K_q, $e.K_e];
      if (event.type === $e.KEY_UP) {
         if (event.key == $e.K_SPACE) {
            ship.accelerating = false;
         } else if (event.key == $e.K_d) {
            if (ship.rotating == 1) {
               ship.rotating = 0;
            }
         } else if (event.key == $e.K_a) {
            if (ship.rotating == -1) {
               ship.rotating = 0;
            }        
         } else if (event.key == $e.K_s) {
            ship.jump();
         }
      } else if (event.type === $e.KEY_DOWN) {
         if (event.key == $e.K_SPACE) {
            ship.accelerating = true;
         } else if (event.key == $e.K_d) {
            ship.rotating = 1;
         } else if (event.key == $e.K_a) {
            ship.rotating = -1;
         } else if (event.key == $e.K_s) {
            ship.begin_charge();
         } else if (fire_keys.indexOf(event.key) >= 0) {
            ship.fire(event.key);
         }
      } else if (event.type === $e.MOUSE_MOTION) {
         if (display.rect.collidePoint(event.pos)) {
            // ship.point_to(event.pos);
            globals.mouse_pos = event.pos;
         }
      } else if (event.type === $e.MOUSE_DOWN) {
         if (display.rect.collidePoint(event.pos)) {
         }
      } else if (event.type === $e.MOUSE_UP) {
         if (display.rect.collidePoint(event.pos)) {
         }
      };
   });
}


gamejs.preload(['images/ship.png']);
gamejs.preload(['images/ship_charge.gif']);
gamejs.preload(['images/particle.png']);

gamejs.ready(main);
