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

goog.provide('goog.async.run');

goog.require('goog.async.nextTick');
goog.require('goog.async.throwException');
goog.require('goog.testing.watchers');


***REMOVED***
***REMOVED*** Fires the provided callback just before the current callstack unwinds, or as
***REMOVED*** soon as possible after the current JS execution context.
***REMOVED*** @param {function(this:THIS)} callback
***REMOVED*** @param {THIS=} opt_context Object to use as the "this value" when calling
***REMOVED***     the provided function.
***REMOVED*** @template THIS
***REMOVED***
goog.async.run = function(callback, opt_context) {
  if (!goog.async.run.workQueueScheduled_) {
    // Nothing is currently scheduled, schedule it now.
    goog.async.nextTick(goog.async.run.processWorkQueue);
    goog.async.run.workQueueScheduled_ = true;
  }

  goog.async.run.workQueue_.push(
      new goog.async.run.WorkItem_(callback, opt_context));
***REMOVED***


***REMOVED*** @private {boolean}***REMOVED***
goog.async.run.workQueueScheduled_ = false;


***REMOVED*** @private {!Array.<!goog.async.run.WorkItem_>}***REMOVED***
goog.async.run.workQueue_ = [];


if (goog.DEBUG) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Reset the event queue.
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.async.run.resetQueue_ = function() {
    goog.async.run.workQueueScheduled_ = false;
    goog.async.run.workQueue_ = [];
 ***REMOVED*****REMOVED***

  // If there is a clock implemenation in use for testing
  // and it is reset, reset the queue.
  goog.testing.watchers.watchClockReset(goog.async.run.resetQueue_);
}


***REMOVED***
***REMOVED*** Run any pending goog.async.run work items. This function is not intended
***REMOVED*** for general use, but for use by entry point handlers to run items ahead of
***REMOVED*** goog.async.nextTick.
***REMOVED***
goog.async.run.processWorkQueue = function() {
  // NOTE: additional work queue items may be pushed while processing.
  while (goog.async.run.workQueue_.length) {
    // Don't let the work queue grow indefinitely.
    var workItems = goog.async.run.workQueue_;
    goog.async.run.workQueue_ = [];
    for (var i = 0; i < workItems.length; i++) {
      var workItem = workItems[i];
      try {
        workItem.fn.call(workItem.scope);
      } catch (e) {
        goog.async.throwException(e);
      }
    }
  }

  // There are no more work items, reset the work queue.
  goog.async.run.workQueueScheduled_ = false;
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED*** @final
***REMOVED*** @struct
***REMOVED*** @private
***REMOVED***
***REMOVED*** @param {function()} fn
***REMOVED*** @param {Object|null|undefined} scope
***REMOVED***
goog.async.run.WorkItem_ = function(fn, scope) {
 ***REMOVED*****REMOVED*** @const***REMOVED*** this.fn = fn;
 ***REMOVED*****REMOVED*** @const***REMOVED*** this.scope = scope;
***REMOVED***
