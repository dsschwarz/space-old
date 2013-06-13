/**
 * Space shooter. Awesomeness.
 */

var gamejs = require('gamejs');
var $v = require('gamejs/utils/vectors');
var $e = require('gamejs/event');
var globals = require('globals');

var $ship = require('ship');
console.log($ship)




function main() {
   // screen setup
   var display = gamejs.display.setMode([globals.width, globals.height]);
   gamejs.display.setCaption("Example Sprites");
   // create ship
   var ship = new $ship.Ship([100, 100]);

   // game loop
   var mainSurface = gamejs.display.getSurface();
   // msDuration = time since last tick() call
   gamejs.onTick(function(msDuration) {
         mainSurface.fill("#000000");
         // update and draw the ships
         
         // Draw heat
         gamejs.draw.rect(display, '#ffffff', new gamejs.Rect([10, 10], [ship.heat_max, 20]), 0);
         if (ship.o_timer == 0) {
            gamejs.draw.rect(display, '#ee3333', new gamejs.Rect([10, 10], [ship.heat, 20]), 0);
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
            ship.point_to(event.pos);
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

/**
 * M A I N
 */
gamejs.preload(['images/ship.png']);
gamejs.preload(['images/ship_charge.gif']);
gamejs.ready(main);
