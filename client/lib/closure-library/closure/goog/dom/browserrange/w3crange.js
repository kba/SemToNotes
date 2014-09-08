// Copyright 2007 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

***REMOVED***
***REMOVED*** @fileoverview Definition of the W3C spec following range wrapper.
***REMOVED***
***REMOVED*** DO NOT USE THIS FILE DIRECTLY.  Use goog.dom.Range instead.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED*** @author ojan@google.com (Ojan Vafai)
***REMOVED*** @author jparent@google.com (Julie Parent)
***REMOVED***


goog.provide('goog.dom.browserrange.W3cRange');

goog.require('goog.dom');
goog.require('goog.dom.NodeType');
goog.require('goog.dom.RangeEndpoint');
goog.require('goog.dom.browserrange.AbstractRange');
goog.require('goog.string');



***REMOVED***
***REMOVED*** The constructor for W3C specific browser ranges.
***REMOVED*** @param {Range} range The range object.
***REMOVED***
***REMOVED*** @extends {goog.dom.browserrange.AbstractRange}
***REMOVED***
goog.dom.browserrange.W3cRange = function(range) {
  this.range_ = range;
***REMOVED***
goog.inherits(goog.dom.browserrange.W3cRange,
              goog.dom.browserrange.AbstractRange);


***REMOVED***
***REMOVED*** Returns a browser range spanning the given node's contents.
***REMOVED*** @param {Node} node The node to select.
***REMOVED*** @return {!Range} A browser range spanning the node's contents.
***REMOVED*** @protected
***REMOVED***
goog.dom.browserrange.W3cRange.getBrowserRangeForNode = function(node) {
  var nodeRange = goog.dom.getOwnerDocument(node).createRange();

  if (node.nodeType == goog.dom.NodeType.TEXT) {
    nodeRange.setStart(node, 0);
    nodeRange.setEnd(node, node.length);
  } else {
    if (!goog.dom.browserrange.canContainRangeEndpoint(node)) {
      var rangeParent = node.parentNode;
      var rangeStartOffset = goog.array.indexOf(rangeParent.childNodes, node);
      nodeRange.setStart(rangeParent, rangeStartOffset);
      nodeRange.setEnd(rangeParent, rangeStartOffset + 1);
    } else {
      var tempNode, leaf = node;
      while ((tempNode = leaf.firstChild) &&
          goog.dom.browserrange.canContainRangeEndpoint(tempNode)) {
        leaf = tempNode;
      }
      nodeRange.setStart(leaf, 0);

      leaf = node;
      while ((tempNode = leaf.lastChild) &&
          goog.dom.browserrange.canContainRangeEndpoint(tempNode)) {
        leaf = tempNode;
      }
      nodeRange.setEnd(leaf, leaf.nodeType == goog.dom.NodeType.ELEMENT ?
          leaf.childNodes.length : leaf.length);
    }
  }

  return nodeRange;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a browser range spanning the given nodes.
***REMOVED*** @param {Node} startNode The node to start with - should not be a BR.
***REMOVED*** @param {number} startOffset The offset within the start node.
***REMOVED*** @param {Node} endNode The node to end with - should not be a BR.
***REMOVED*** @param {number} endOffset The offset within the end node.
***REMOVED*** @return {!Range} A browser range spanning the node's contents.
***REMOVED*** @protected
***REMOVED***
goog.dom.browserrange.W3cRange.getBrowserRangeForNodes = function(startNode,
    startOffset, endNode, endOffset) {
  // Create and return the range.
  var nodeRange = goog.dom.getOwnerDocument(startNode).createRange();
  nodeRange.setStart(startNode, startOffset);
  nodeRange.setEnd(endNode, endOffset);
  return nodeRange;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a range object that selects the given node's text.
***REMOVED*** @param {Node} node The node to select.
***REMOVED*** @return {!goog.dom.browserrange.W3cRange} A Gecko range wrapper object.
***REMOVED***
goog.dom.browserrange.W3cRange.createFromNodeContents = function(node) {
  return new goog.dom.browserrange.W3cRange(
      goog.dom.browserrange.W3cRange.getBrowserRangeForNode(node));
***REMOVED***


***REMOVED***
***REMOVED*** Creates a range object that selects between the given nodes.
***REMOVED*** @param {Node} startNode The node to start with.
***REMOVED*** @param {number} startOffset The offset within the start node.
***REMOVED*** @param {Node} endNode The node to end with.
***REMOVED*** @param {number} endOffset The offset within the end node.
***REMOVED*** @return {!goog.dom.browserrange.W3cRange} A wrapper object.
***REMOVED***
goog.dom.browserrange.W3cRange.createFromNodes = function(startNode,
    startOffset, endNode, endOffset) {
  return new goog.dom.browserrange.W3cRange(
      goog.dom.browserrange.W3cRange.getBrowserRangeForNodes(startNode,
          startOffset, endNode, endOffset));
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.dom.browserrange.W3cRange} A clone of this range.
***REMOVED*** @override
***REMOVED***
goog.dom.browserrange.W3cRange.prototype.clone = function() {
  return new this.constructor(this.range_.cloneRange());
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.browserrange.W3cRange.prototype.getBrowserRange = function() {
  return this.range_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.browserrange.W3cRange.prototype.getContainer = function() {
  return this.range_.commonAncestorContainer;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.browserrange.W3cRange.prototype.getStartNode = function() {
  return this.range_.startContainer;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.browserrange.W3cRange.prototype.getStartOffset = function() {
  return this.range_.startOffset;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.browserrange.W3cRange.prototype.getEndNode = function() {
  return this.range_.endContainer;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.browserrange.W3cRange.prototype.getEndOffset = function() {
  return this.range_.endOffset;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.browserrange.W3cRange.prototype.compareBrowserRangeEndpoints =
    function(range, thisEndpoint, otherEndpoint) {
  return this.range_.compareBoundaryPoints(
      otherEndpoint == goog.dom.RangeEndpoint.START ?
          (thisEndpoint == goog.dom.RangeEndpoint.START ?
              goog.global['Range'].START_TO_START :
              goog.global['Range'].START_TO_END) :
          (thisEndpoint == goog.dom.RangeEndpoint.START ?
              goog.global['Range'].END_TO_START :
              goog.global['Range'].END_TO_END),
     ***REMOVED*****REMOVED*** @type {Range}***REMOVED*** (range));
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.browserrange.W3cRange.prototype.isCollapsed = function() {
  return this.range_.collapsed;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.browserrange.W3cRange.prototype.getText = function() {
  return this.range_.toString();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.browserrange.W3cRange.prototype.getValidHtml = function() {
  var div = goog.dom.getDomHelper(this.range_.startContainer).createDom('div');
  div.appendChild(this.range_.cloneContents());
  var result = div.innerHTML;

  if (goog.string.startsWith(result, '<') ||
      !this.isCollapsed() && !goog.string.contains(result, '<')) {
    // We attempt to mimic IE, which returns no containing element when a
    // only text nodes are selected, does return the containing element when
    // the selection is empty, and does return the element when multiple nodes
    // are selected.
    return result;
  }

  var container = this.getContainer();
  container = container.nodeType == goog.dom.NodeType.ELEMENT ? container :
      container.parentNode;

  var html = goog.dom.getOuterHtml(
     ***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (container.cloneNode(false)));
  return html.replace('>', '>' + result);
***REMOVED***


// SELECTION MODIFICATION


***REMOVED*** @override***REMOVED***
goog.dom.browserrange.W3cRange.prototype.select = function(reverse) {
  var win = goog.dom.getWindow(goog.dom.getOwnerDocument(this.getStartNode()));
  this.selectInternal(win.getSelection(), reverse);
***REMOVED***


***REMOVED***
***REMOVED*** Select this range.
***REMOVED*** @param {Selection} selection Browser selection object.
***REMOVED*** @param {*} reverse Whether to select this range in reverse.
***REMOVED*** @protected
***REMOVED***
goog.dom.browserrange.W3cRange.prototype.selectInternal = function(selection,
                                                                   reverse) {
  // Browser-specific tricks are needed to create reversed selections
  // programatically. For this generic W3C codepath, ignore the reverse
  // parameter.
  selection.removeAllRanges();
  selection.addRange(this.range_);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.browserrange.W3cRange.prototype.removeContents = function() {
  var range = this.range_;
  range.extractContents();

  if (range.startContainer.hasChildNodes()) {
    // Remove any now empty nodes surrounding the extracted contents.
    var rangeStartContainer =
        range.startContainer.childNodes[range.startOffset];
    if (rangeStartContainer) {
      var rangePrevious = rangeStartContainer.previousSibling;

      if (goog.dom.getRawTextContent(rangeStartContainer) == '') {
        goog.dom.removeNode(rangeStartContainer);
      }

      if (rangePrevious && goog.dom.getRawTextContent(rangePrevious) == '') {
        goog.dom.removeNode(rangePrevious);
      }
    }
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.browserrange.W3cRange.prototype.surroundContents = function(element) {
  this.range_.surroundContents(element);
  return element;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.browserrange.W3cRange.prototype.insertNode = function(node, before) {
  var range = this.range_.cloneRange();
  range.collapse(before);
  range.insertNode(node);
  range.detach();

  return node;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.browserrange.W3cRange.prototype.surroundWithNodes = function(
    startNode, endNode) {
  var win = goog.dom.getWindow(
      goog.dom.getOwnerDocument(this.getStartNode()));
  var selectionRange = goog.dom.Range.createFromWindow(win);
  if (selectionRange) {
    var sNode = selectionRange.getStartNode();
    var eNode = selectionRange.getEndNode();
    var sOffset = selectionRange.getStartOffset();
    var eOffset = selectionRange.getEndOffset();
  }

  var clone1 = this.range_.cloneRange();
  var clone2 = this.range_.cloneRange();

  clone1.collapse(false);
  clone2.collapse(true);

  clone1.insertNode(endNode);
  clone2.insertNode(startNode);

  clone1.detach();
  clone2.detach();

  if (selectionRange) {
    // There are 4 ways that surroundWithNodes can wreck the saved
    // selection object. All of them happen when an inserted node splits
    // a text node, and one of the end points of the selection was in the
    // latter half of that text node.
    //
    // Clients of this library should use saveUsingCarets to avoid this
    // problem. Unfortunately, saveUsingCarets uses this method, so that's
    // not really an option for us. :( We just recompute the offsets.
    var isInsertedNode = function(n) {
      return n == startNode || n == endNode;
   ***REMOVED*****REMOVED***
    if (sNode.nodeType == goog.dom.NodeType.TEXT) {
      while (sOffset > sNode.length) {
        sOffset -= sNode.length;
        do {
          sNode = sNode.nextSibling;
        } while (isInsertedNode(sNode));
      }
    }

    if (eNode.nodeType == goog.dom.NodeType.TEXT) {
      while (eOffset > eNode.length) {
        eOffset -= eNode.length;
        do {
          eNode = eNode.nextSibling;
        } while (isInsertedNode(eNode));
      }
    }

    goog.dom.Range.createFromNodes(
        sNode,***REMOVED*****REMOVED*** @type {number}***REMOVED*** (sOffset),
        eNode,***REMOVED*****REMOVED*** @type {number}***REMOVED*** (eOffset)).select();
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.browserrange.W3cRange.prototype.collapse = function(toStart) {
  this.range_.collapse(toStart);
***REMOVED***
