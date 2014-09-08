// Copyright 2014 The Closure Library Authors. All Rights Reserved.
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

goog.provide('goog.style.transformTest');
goog.setTestOnly('goog.style.transformTest');

goog.require('goog.dom');
goog.require('goog.style.transform');
goog.require('goog.testing.jsunit');
goog.require('goog.userAgent');
goog.require('goog.userAgent.product.isVersion');


***REMOVED***
***REMOVED*** Element being transformed.
***REMOVED*** @type {Element}
***REMOVED***
var element;


***REMOVED***
***REMOVED*** Sets a transform translation and asserts the translation was applied.
***REMOVED*** @param {number} x The horizontal translation
***REMOVED*** @param {number} y The vertical translation
***REMOVED***
var setAndAssertTranslation = function(x, y) {
  if (goog.userAgent.GECKO) {
    // Mozilla does not support CSSMatrix.
    return;
  }
  var success = goog.style.transform.setTranslation(element, x, y);
  if (!goog.style.transform.isSupported()) {
    assertFalse(success);
  } else {
    assertTrue(success);
    var translation = goog.style.transform.getTranslation(element);
    assertEquals(x, translation.x);
    assertEquals(y, translation.y);
  }
***REMOVED***

function setUp() {
  element = goog.dom.createElement('div');
  goog.dom.appendChild(goog.dom.getDocument().body, element);
}

function tearDown() {
  goog.dom.removeNode(element);
}


function testIsSupported() {
  if (goog.userAgent.IE && !goog.userAgent.product.isVersion(9)) {
    assertFalse(goog.style.transform.isSupported());
  } else {
    assertTrue(goog.style.transform.isSupported());
  }
}


function testIs3dSupported() {
  if (goog.userAgent.GECKO && !goog.userAgent.product.isVersion(10) ||
      (goog.userAgent.IE && !goog.userAgent.product.isVersion(10))) {
    assertFalse(goog.style.transform.is3dSupported());
  } else {
    assertTrue(goog.style.transform.is3dSupported());
  }
}

function testTranslateX() {
  setAndAssertTranslation(10, 0);
}

function testTranslateY() {
  setAndAssertTranslation(0, 10);
}

function testTranslateXY() {
  setAndAssertTranslation(10, 20);
}
