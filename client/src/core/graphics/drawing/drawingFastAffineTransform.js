/**
 * @fileoverview A class providing optimizations and extensions for
 * class goog.math.AffineTransform, e.g., to avoid object allocations.
 */

goog.provide('xrx.drawing.FastAffineTransform');



goog.require('goog.math');
goog.require('goog.math.AffineTransform');



/**A class providing optimizations and extensions for class
 * goog.math.AffineTransform
 * @constructor
 */
xrx.drawing.FastAffineTransform = function() {

  goog.base(this);
 
  this.identity_;

  this.inverse_;

  this.clone_;
};
goog.inherits(xrx.drawing.FastAffineTransform, goog.math.AffineTransform);



/**
 * Returns an identity matrix object without allocating a new object.
 * @return {xrx.drawing.FastAffineTransform} The identity matrix.
 */
xrx.drawing.FastAffineTransform.prototype.getIdentity = function() {
  if (!this.identity_) this.identity_ = new xrx.drawing.FastAffineTransform();
  this.identity_.setTransform(1, 0, 0, 1, 0, 0);
  return this.identity_;
};



/**
 * Returns an inverse matrix object without allocating a new object.
 * @return {xrx.drawing.FastAffineTransform} The inverse matrix.
 */
xrx.drawing.FastAffineTransform.prototype.getInverse = function() {
  if (!this.inverse_) this.inverse_ = new xrx.drawing.FastAffineTransform();
  var det = this.getDeterminant();
  this.inverse_.setTransform(
    this.m11_ / det,
    -this.m10_ / det,
    -this.m01_ / det,
    this.m00_ / det,
    (this.m01_ * this.m12_ - this.m11_ * this.m02_) / det,
    (this.m10_ * this.m02_ - this.m00_ * this.m12_) / det
  );
  return this.inverse_;
};



/**
 * Returns a temporary clone of this affine transform without allocating
 * a new object.
 * @return {xrx.drawing.FastAffineTransform} The clone.
 */
xrx.drawing.FastAffineTransform.prototype.getClone = function() {
  if (!this.clone_) this.clone_ = new xrx.drawing.FastAffineTransform();
  return this.clone_.copyFrom(this);
};


/**
 * Transforms a coordinate point according to this transformation matrix.
 * @param {Array<number>} The coordinate point [x, y] to be transformed.
 * @param {Array<number>} The target point to store the result of the
 *   transformation.
 * @return {Array<number>} A coordinate point.
 */
xrx.drawing.FastAffineTransform.prototype.transformPoint = function(point, opt_targetPoint) {
  var p = opt_targetPoint !== undefined ? opt_targetPoint : new Array(2);
  this.createInverse().transform(point, 0, p, 0, 1);
  return p;
};



/**
 * Returns the current scale of this transformation matrix.
 * @return {number} The scale.
 */
xrx.drawing.FastAffineTransform.prototype.getScale = function() {
  var rotation = this.getRotation();
  this.getClone().rotate(goog.math.toRadians(360 - rotation));
  return this.clone_.getScaleX();
};



/**
 * Returns the current rotation of this transformation matrix in
 * a normalized form (either 0, 90, 180, or 270).
 * @return {number} The rotation in degrees.
 */
xrx.drawing.FastAffineTransform.prototype.getRotation = function() {
  var atan = Math.round(Math.atan2(this.getShearY(), this.getScaleY()));
  var toDegree = {
    '0': 0,
    '2': 90,
    '3': 180,
    '-2': 270
  }
  return toDegree[atan]; 
};
