// Copyright 2013 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Provides a function to schedule running a function as soon
***REMOVED*** as possible after the current JS execution stops and yields to the event
***REMOVED*** loop.
***REMOVED***
***REMOVED***

goog.provide('goog.async.nextTick');
goog.provide('goog.async.throwException');

goog.require('goog.debug.entryPointRegistry');
goog.require('goog.functions');


***REMOVED***
***REMOVED*** Throw an item without interrupting the current execution context.  For
***REMOVED*** example, if processing a group of items in a loop, sometimes it is useful
***REMOVED*** to report an error while still allowing the rest of the batch to be
***REMOVED*** processed.
***REMOVED*** @param {*} exception
***REMOVED***
goog.async.throwException = function(exception) {
  // Each throw needs to be in its own context.
  goog.global.setTimeout(function() { throw exception; }, 0);
***REMOVED***


***REMOVED***
***REMOVED*** Fires the provided callbacks as soon as possible after the current JS
***REMOVED*** execution context. setTimeout(…, 0) always takes at least 5ms for legacy
***REMOVED*** reasons.
***REMOVED*** @param {function(this:SCOPE)} callback Callback function to fire as soon as
***REMOVED***     possible.
***REMOVED*** @param {SCOPE=} opt_context Object in whose scope to call the listener.
***REMOVED*** @template SCOPE
***REMOVED***
goog.async.nextTick = function(callback, opt_context) {
  var cb = callback;
  if (opt_context) {
    cb = goog.bind(callback, opt_context);
  }
  cb = goog.async.nextTick.wrapCallback_(cb);
  // Introduced and currently only supported by IE10.
  if (goog.isFunction(goog.global.setImmediate)) {
    goog.global.setImmediate(cb);
    return;
  }
  // Look for and cache the custom fallback version of setImmediate.
  if (!goog.async.nextTick.setImmediate_) {
    goog.async.nextTick.setImmediate_ =
        goog.async.nextTick.getSetImmediateEmulator_();
  }
  goog.async.nextTick.setImmediate_(cb);
***REMOVED***


***REMOVED***
***REMOVED*** Cache for the setImmediate implementation.
***REMOVED*** @type {function(function())}
***REMOVED*** @private
***REMOVED***
goog.async.nextTick.setImmediate_;


***REMOVED***
***REMOVED*** Determines the best possible implementation to run a function as soon as
***REMOVED*** the JS event loop is idle.
***REMOVED*** @return {function(function())} The "setImmediate" implementation.
***REMOVED*** @private
***REMOVED***
goog.async.nextTick.getSetImmediateEmulator_ = function() {
  // If native Promises are available in the browser, just schedule the callback
  // on a fulfilled promise, which is specified to be async, but as fast as
  // possible.
  if (goog.global.Promise && goog.global.Promise.resolve) {
    var promise = goog.global.Promise.resolve();
    return function(cb) {
      promise.then(function() {
        try {
          cb();
        } catch (e) {
          // If there is an error in the callback, make sure it is reported,
          // since there is no chance to attach an error-handler to the
          // promise used here.
          goog.async.throwException(e);
        }
      });
   ***REMOVED*****REMOVED***
  }
  // Create a private message channel and use it to postMessage empty messages
  // to ourselves.
  var Channel = goog.global['MessageChannel'];
  // If MessageChannel is not available and we are in a browser, implement
  // an iframe based polyfill in browsers that have postMessage and
  // document.addEventListener. The latter excludes IE8 because it has a
  // synchronous postMessage implementation.
  if (typeof Channel === 'undefined' && typeof window !== 'undefined' &&
      window.postMessage && window.addEventListener) {
   ***REMOVED*****REMOVED*** @constructor***REMOVED***
    Channel = function() {
      // Make an empty, invisible iframe.
      var iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = '';
      document.documentElement.appendChild(iframe);
      var win = iframe.contentWindow;
      var doc = win.document;
      doc.open();
      doc.write('');
      doc.close();
      var message = 'callImmediate' + Math.random();
      var origin = win.location.protocol + '//' + win.location.host;
      var onmessage = goog.bind(function(e) {
        // Validate origin and message to make sure that this message was
        // intended for us.
        if (e.origin != origin && e.data != message) {
          return;
        }
        this['port1'].onmessage();
      }, this);
      win.addEventListener('message', onmessage, false);
      this['port1'] = {***REMOVED***
      this['port2'] = {
        postMessage: function() {
          win.postMessage(message, origin);
        }
     ***REMOVED*****REMOVED***
   ***REMOVED*****REMOVED***
  }
  if (typeof Channel !== 'undefined') {
    var channel = new Channel();
    // Use a fifo linked list to call callbacks in the right order.
    var head = {***REMOVED***
    var tail = head;
    channel['port1'].onmessage = function() {
      head = head.next;
      var cb = head.cb;
      head.cb = null;
      cb();
   ***REMOVED*****REMOVED***
    return function(cb) {
      tail.next = {
        cb: cb
     ***REMOVED*****REMOVED***
      tail = tail.next;
      channel['port2'].postMessage(0);
   ***REMOVED*****REMOVED***
  }
  // Implementation for IE6-8: Script elements fire an asynchronous
  // onreadystatechange event when inserted into the DOM.
  if (typeof document !== 'undefined' && 'onreadystatechange' in
      document.createElement('script')) {
    return function(cb) {
      var script = document.createElement('script');
      script.onreadystatechange = function() {
        // Clean up and call the callback.
        script.onreadystatechange = null;
        script.parentNode.removeChild(script);
        script = null;
        cb();
        cb = null;
     ***REMOVED*****REMOVED***
      document.documentElement.appendChild(script);
   ***REMOVED*****REMOVED***
  }
  // Fall back to setTimeout with 0. In browsers this creates a delay of 5ms
  // or more.
  return function(cb) {
    goog.global.setTimeout(cb, 0);
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Helper function that is overrided to protect callbacks with entry point
***REMOVED*** monitor if the application monitors entry points.
***REMOVED*** @param {function()} callback Callback function to fire as soon as possible.
***REMOVED*** @return {function()} The wrapped callback.
***REMOVED*** @private
***REMOVED***
goog.async.nextTick.wrapCallback_ = goog.functions.identity;


// Register the callback function as an entry point, so that it can be
// monitored for exception handling, etc. This has to be done in this file
// since it requires special code to handle all browsers.
goog.debug.entryPointRegistry.register(
   ***REMOVED*****REMOVED***
    ***REMOVED*** @param {function(!Function): !Function} transformer The transforming
    ***REMOVED***     function.
   ***REMOVED*****REMOVED***
    function(transformer) {
      goog.async.nextTick.wrapCallback_ = transformer;
    });
