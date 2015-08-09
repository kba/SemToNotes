/**
 * @fileoverview
 */

goog.provide('xrx.geometry.Path');



goog.require('xrx.geometry');



/**
 * @constructor
 */
xrx.geometry.Path = function(opt_length) {

  this.coords = opt_length === undefined ? [] : new Array(opt_length);

  if (opt_length !== undefined) {
    for (var i = 0; i < opt_length; i++) {
      this.coords[i] = new Array(2);
    }
  };
};



xrx.geometry.Path.prototype.containsPoint = function(point) {
  var x = point[0], y = point[1];
  var coords = this.coords;
  var xi;
  var xj;
  var intersect;

  var inside = false;
  for (var i = 0, j = coords.length - 1; i < coords.length; j = i++) {
    xi = coords[i][0], yi = coords[i][1];
    xj = coords[j][0], yj = coords[j][1];

    intersect = ((yi > y) != (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
};
