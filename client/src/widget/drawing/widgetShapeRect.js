***REMOVED***
***REMOVED*** @fileoverview 
***REMOVED***

goog.provide('xrx.widget.ShapeRect');
goog.provide('xrx.widget.ShapeRectGeometry');
goog.provide('xrx.widget.ShapeRectX');
goog.provide('xrx.widget.ShapeRectY');
goog.provide('xrx.widget.ShapeRectWidth');
goog.provide('xrx.widget.ShapeRectHeight');
goog.provide('xrx.widget.ShapeRectLeft');
goog.provide('xrx.widget.ShapeRectTop');
goog.provide('xrx.widget.ShapeRectRight');
goog.provide('xrx.widget.ShapeRectBottom');



goog.require('goog.dom.dataset');
goog.require('xrx.mvc.ComponentView');
goog.require('xrx.shape.Rect');
goog.require('xrx.widget.Shape');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapeRect = function(element, drawing) {

  goog.base(this, element, drawing);

  this.shape_;

  this.rectX_;

  this.rectY_;

  this.rectWidth_;

  this.rectHeight_;

  this.rectLeft_;

  this.rectTop_;

  this.rectRight_;

  this.rectBottom_;
***REMOVED***
goog.inherits(xrx.widget.ShapeRect, xrx.widget.Shape);



xrx.widget.ShapeRect.prototype.getX = function() {
  return this.shape_.getCoords()[0][0];
***REMOVED***



xrx.widget.ShapeRect.prototype.setX = function(coord) {
  var coords = this.shape_.getCoords();
  coords[0][0] = coord;
  this.shape_.setCoords(coords);
  this.shape_.setAffineCoords(0);
***REMOVED***



xrx.widget.ShapeRect.prototype.getLeft = function() {
  return this.getX();
***REMOVED***



xrx.widget.ShapeRect.prototype.setLeft = function(coord) {
  return this.setX(coord);
***REMOVED***



xrx.widget.ShapeRect.prototype.getY = function() {
  return this.shape_.getCoords()[0][1];
***REMOVED***



xrx.widget.ShapeRect.prototype.setY = function(coord) {
  var coords = this.shape_.getCoords();
  coords[0][1] = coord;
  this.shape_.setCoords(coords);
  this.shape_.setAffineCoords(0);
***REMOVED***



xrx.widget.ShapeRect.prototype.getTop = function() {
  return this.getY();
***REMOVED***



xrx.widget.ShapeRect.prototype.setTop = function(coord) {
  return this.setY(coord);
***REMOVED***



xrx.widget.ShapeRect.prototype.getWidth = function() {
  var coords = this.shape_.getCoords();
  return coords[1][0] - coords[0][0];
***REMOVED***



xrx.widget.ShapeRect.prototype.setWidth = function(width) {
  var coords = this.shape_.getCoords();
  coords[1][0] = coords[0][0] + width;
  this.shape_.setCoords(coords);
  this.shape_.setAffineCoords(1);
***REMOVED***



xrx.widget.ShapeRect.prototype.getRight = function() {
  return this.shape_.getCoords()[1][0];
***REMOVED***



xrx.widget.ShapeRect.prototype.setRight = function(coord) {
  var coords = this.shape_.getCoords();
  coords[1][0] = coord;
  this.shape_.setCoords(coords);
  this.shape_.setAffineCoords(1);
***REMOVED***



xrx.widget.ShapeRect.prototype.getHeight = function() {
  var coords = this.shape_.getCoords();
  return coords[3][1] - coords[0][1];
***REMOVED***



xrx.widget.ShapeRect.prototype.setHeight = function(height) {
  var coords = this.shape_.getCoords();
  coords[3][1] = coords[0][1] + height;
  this.shape_.setCoords(coords);
  this.shape_.setAffineCoords(3);
***REMOVED***



xrx.widget.ShapeRect.prototype.getBottom = function() {
  return this.shape_.getCoords()[3][1];
***REMOVED***



xrx.widget.ShapeRect.prototype.setBottom = function(coord) {
  var coords = this.shape_.getCoords();
  coords[3][1] = coord;
  this.shape_.setCoords(coords);
  this.shape_.setAffineCoords(3);
***REMOVED***



xrx.widget.ShapeRect.prototype.createDom = function() {
***REMOVED***
  this.shape_ = xrx.shape.Rect.create(this.drawing_);
  // get datasets
  var x      = goog.dom.dataset.get(this.element_, 'xrxRefX');
  var y      = goog.dom.dataset.get(this.element_, 'xrxRefY');
  var width  = goog.dom.dataset.get(this.element_, 'xrxRefWidth');
  var height = goog.dom.dataset.get(this.element_, 'xrxRefHeight');
  var left   = goog.dom.dataset.get(this.element_, 'xrxRefLeft');
  var top    = goog.dom.dataset.get(this.element_, 'xrxRefTop');
  var right  = goog.dom.dataset.get(this.element_, 'xrxRefRight');
  var bottom = goog.dom.dataset.get(this.element_, 'xrxRefBottom');
  // initialize coordinate components
  if (x)      this.rectX_      = new xrx.widget.ShapeRectX(
      this.element_, this, x);
  if (y)      this.rectY_      = new xrx.widget.ShapeRectY(
      this.element_, this, y);
  if (width)  this.rectWidth_  = new xrx.widget.ShapeRectWidth(
      this.element_, this, width);
  if (height) this.rectHeight_ = new xrx.widget.ShapeRectHeight(
      this.element_, this, height);
  if (left)   this.rectLeft_   = new xrx.widget.ShapeRectLeft(
      this.element_, this, left);
  if (top)    this.rectTop_    = new xrx.widget.ShapeRectTop(
      this.element_, this, top);
  if (right)  this.rectRight_  = new xrx.widget.ShapeRectRight(
      this.element_, this, right);
  if (bottom) this.rectBottom_ = new xrx.widget.ShapeRectBottom(
      this.element_, this, bottom);
  // handle value changes
  this.shape_.handleValueChanged = function() {
    if (self.rectX_)      self.rectX_.mvcEventValueChanged();
    if (self.rectY_)      self.rectY_.mvcEventValueChanged();
    if (self.rectWidth_)  self.rectWidth_.mvcEventValueChanged();
    if (self.rectHeight_) self.rectHeight_.mvcEventValueChanged();
    if (self.rectLeft_)   self.rectLeft_.mvcEventValueChanged();
    if (self.rectTop_)    self.rectTop_.mvcEventValueChanged();
    if (self.rectRight_)  self.rectRight_.mvcEventValueChanged();
    if (self.rectBottom_) self.rectBottom_.mvcEventValueChanged();
  }
***REMOVED***



xrx.widget.ShapeRect.prototype.refresh = function() {
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapeRectGeometry = function(element, rect, dataset) {

  this.rect_ = rect;

  this.dataset_ = dataset;

***REMOVED***
***REMOVED***
goog.inherits(xrx.widget.ShapeRectGeometry, xrx.mvc.ComponentView);



***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.widget.ShapeRectGeometry.prototype.getRefExpression = function() {
  return this.dataset_;
***REMOVED***



xrx.widget.ShapeRectGeometry.prototype.createDom = function() {
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapeRectX = function(element, rect, dataset) {

  goog.base(this, element, rect, dataset);
***REMOVED***
goog.inherits(xrx.widget.ShapeRectX, xrx.widget.ShapeRectGeometry);



xrx.widget.ShapeRectX.prototype.refresh = function() {
  var str = this.getNode().getStringValue();
  var point = parseFloat(str);
  this.rect_.setX(point);
  this.rect_.getDrawing().draw();
***REMOVED***



xrx.widget.ShapeRectX.prototype.mvcEventValueChanged = function() {
  var x = this.rect_.getX();
  xrx.mvc.Controller.updateValueLike(this, x.toString());
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapeRectY = function(element, rect, dataset) {

  goog.base(this, element, rect, dataset);
***REMOVED***
goog.inherits(xrx.widget.ShapeRectY, xrx.widget.ShapeRectGeometry);



xrx.widget.ShapeRectY.prototype.refresh = function() {
  var str = this.getNode().getStringValue();
  var point = parseFloat(str);
  this.rect_.setY(point);
  this.rect_.getDrawing().draw();
***REMOVED***



xrx.widget.ShapeRectY.prototype.mvcEventValueChanged = function() {
  var y = this.rect_.getY();
  xrx.mvc.Controller.updateValueLike(this, y.toString());
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapeRectWidth = function(element, rect, dataset) {

  goog.base(this, element, rect, dataset);
***REMOVED***
goog.inherits(xrx.widget.ShapeRectWidth, xrx.widget.ShapeRectGeometry);



xrx.widget.ShapeRectWidth.prototype.refresh = function() {
  var str = this.getNode().getStringValue();
  var point = parseFloat(str);
  this.rect_.setWidth(point);
  this.rect_.getDrawing().draw();
***REMOVED***



xrx.widget.ShapeRectWidth.prototype.mvcEventValueChanged = function() {
  var width = this.rect_.getWidth();
  xrx.mvc.Controller.updateValueLike(this, width.toString());
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapeRectHeight = function(element, rect, dataset) {

  goog.base(this, element, rect, dataset);
***REMOVED***
goog.inherits(xrx.widget.ShapeRectHeight, xrx.widget.ShapeRectGeometry);



xrx.widget.ShapeRectHeight.prototype.refresh = function() {
  var str = this.getNode().getStringValue();
  var point = parseFloat(str);
  this.rect_.setHeight(point);
  this.rect_.getDrawing().draw();
***REMOVED***



xrx.widget.ShapeRectHeight.prototype.mvcEventValueChanged = function() {
  var height = this.rect_.getHeight();
  xrx.mvc.Controller.updateValueLike(this, height.toString());
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapeRectLeft = function(element, rect, dataset) {

  goog.base(this, element, rect, dataset);
***REMOVED***
goog.inherits(xrx.widget.ShapeRectLeft, xrx.widget.ShapeRectGeometry);



xrx.widget.ShapeRectLeft.prototype.refresh = function() {
  var str = this.getNode().getStringValue();
  var point = parseFloat(str);
  this.rect_.setLeft(point);
  this.rect_.getDrawing().draw();
***REMOVED***



xrx.widget.ShapeRectLeft.prototype.mvcEventValueChanged = function() {
  var left = this.rect_.getLeft();
  xrx.mvc.Controller.updateValueLike(this, left.toString());
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapeRectTop = function(element, rect, dataset) {

  goog.base(this, element, rect, dataset);
***REMOVED***
goog.inherits(xrx.widget.ShapeRectTop, xrx.widget.ShapeRectGeometry);



xrx.widget.ShapeRectTop.prototype.refresh = function() {
  var str = this.getNode().getStringValue();
  var point = parseFloat(str);
  this.rect_.setTop(point);
  this.rect_.getDrawing().draw();
***REMOVED***



xrx.widget.ShapeRectTop.prototype.mvcEventValueChanged = function() {
  var top = this.rect_.getTop();
  xrx.mvc.Controller.updateValueLike(this, top.toString());
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapeRectRight = function(element, rect, dataset) {

  goog.base(this, element, rect, dataset);
***REMOVED***
goog.inherits(xrx.widget.ShapeRectRight, xrx.widget.ShapeRectGeometry);



xrx.widget.ShapeRectRight.prototype.refresh = function() {
  var str = this.getNode().getStringValue();
  var point = parseFloat(str);
  this.rect_.setRight(point);
  this.rect_.getDrawing().draw();
***REMOVED***



xrx.widget.ShapeRectRight.prototype.mvcEventValueChanged = function() {
  var right = this.rect_.getRight();
  xrx.mvc.Controller.updateValueLike(this, right.toString());
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapeRectBottom = function(element, rect, dataset) {

  goog.base(this, element, rect, dataset);
***REMOVED***
goog.inherits(xrx.widget.ShapeRectBottom, xrx.widget.ShapeRectGeometry);



xrx.widget.ShapeRectBottom.prototype.refresh = function() {
  var str = this.getNode().getStringValue();
  var point = parseFloat(str);
  this.rect_.setBottom(point);
  this.rect_.getDrawing().draw();
***REMOVED***



xrx.widget.ShapeRectBottom.prototype.mvcEventValueChanged = function() {
  var bottom = this.rect_.getBottom();
  xrx.mvc.Controller.updateValueLike(this, bottom.toString());
***REMOVED***