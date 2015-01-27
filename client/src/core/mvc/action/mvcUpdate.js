/**
 * @fileoverview A class representing an XML set-value action.
 */

goog.provide('xrx.mvc.Update');



goog.require('xrx.mvc.AbstractUpdate');
goog.require('xrx.mvc.Controller');



/**
 * @constructor
 */
xrx.mvc.Update = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.mvc.Update, xrx.mvc.AbstractUpdate);



/**
 * @private
 */
xrx.mvc.Update.prototype.execute_ = function() {
  console.log(this.getOriginAsString());
  xrx.mvc.Controller.updateNode(this, this.getTargetAsNode(),
      this.getOriginAsString());
};
