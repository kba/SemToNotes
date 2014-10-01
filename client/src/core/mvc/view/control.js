***REMOVED***
***REMOVED*** @fileoverview Abstract class which represents a
***REMOVED*** control of the model-view-controller.
***REMOVED***

goog.provide('xrx.control');



goog.require('goog.dom');
goog.require('xrx.component');
goog.require('xrx.node.ElementS');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.control = function(element) {
***REMOVED***
***REMOVED***
goog.inherits(xrx.control, xrx.component);



xrx.control.prototype.getRepeat = function() {
  var element = goog.dom.getAncestorByClass(this.element_, 'xrx-repeat');
  var id = element.getAttribute('id');

  return xrx.view.getComponent(id);
***REMOVED***



xrx.control.prototype.getRepeatIndex = function() {
  var repeatItem = goog.dom.getAncestorByClass(this.element_,
      'xrx-repeat-item');

  if (goog.dom.classes.has(this.element_, 'xrx-repeat-item')) {

    return this.element_.getAttribute('data-xrx-repeat-index');

  } else if (repeatItem) {

    return repeatItem.getAttribute('data-xrx-repeat-index');

  } else {

    throw Error('Repeat item could not be found.');
  }
***REMOVED***



xrx.control.prototype.getNodeBind = function(num) {
  return this.getBind().node_[num];
***REMOVED***



xrx.control.prototype.getNodeRef = function() {
  var context = this.getRepeat().getNode(this.getRepeatIndex());
  // TODO: Node conversion function
  var nodeS = new xrx.node.ElementS(context.getInstance(), context.getToken());
  var result = xrx.xpath.evaluate(this.getRefExpression(), nodeS, null,
      xrx.xpath.XPathResultType.ANY_TYPE);

  return context.isSameAs(nodeS) ? context : result.iterateNext();
***REMOVED***



***REMOVED***
***REMOVED*** Gets the node referenced by the control.
***REMOVED*** @return {xrx.node} The node.
***REMOVED***
xrx.control.prototype.getNode = function(num) {
  var n = num || 0;

  if (this.getBind()) {

    return this.getNodeBind(n);

  } else if (this.getRefExpression()) {

    return this.getNodeRef(n);

  } else {
    throw Error('A control must define a data-xrx-bind or a data-xrx-ref ' +
        'attribute.');
  }
***REMOVED***