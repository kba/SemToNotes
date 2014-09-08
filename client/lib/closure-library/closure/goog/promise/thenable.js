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

goog.provide('goog.Thenable');



***REMOVED***
***REMOVED*** Provides a more strict interface for Thenables in terms of
***REMOVED*** http://promisesaplus.com for interop with {@see goog.Promise}.
***REMOVED***
***REMOVED*** @interface
***REMOVED*** @extends {IThenable.<TYPE>}
***REMOVED*** @template TYPE
***REMOVED***
goog.Thenable = function() {***REMOVED***


***REMOVED***
***REMOVED*** Adds callbacks that will operate on the result of the Thenable, returning a
***REMOVED*** new child Promise.
***REMOVED***
***REMOVED*** If the Thenable is fulfilled, the {@code onFulfilled} callback will be
***REMOVED*** invoked with the fulfillment value as argument, and the child Promise will
***REMOVED*** be fulfilled with the return value of the callback. If the callback throws
***REMOVED*** an exception, the child Promise will be rejected with the thrown value
***REMOVED*** instead.
***REMOVED***
***REMOVED*** If the Thenable is rejected, the {@code onRejected} callback will be invoked
***REMOVED*** with the rejection reason as argument, and the child Promise will be rejected
***REMOVED*** with the return value of the callback or thrown value.
***REMOVED***
***REMOVED*** @param {?(function(this:THIS, TYPE):
***REMOVED***             (RESULT|IThenable.<RESULT>|Thenable))=} opt_onFulfilled A
***REMOVED***     function that will be invoked with the fulfillment value if the Promise
***REMOVED***     is fullfilled.
***REMOVED*** @param {?(function(this:THIS,***REMOVED***):***REMOVED***)=} opt_onRejected A function that will
***REMOVED***     be invoked with the rejection reason if the Promise is rejected.
***REMOVED*** @param {THIS=} opt_context An optional context object that will be the
***REMOVED***     execution context for the callbacks. By default, functions are executed
***REMOVED***     with the default this.
***REMOVED*** @return {!goog.Promise.<RESULT>} A new Promise that will receive the result
***REMOVED***     of the fulfillment or rejection callback.
***REMOVED*** @template RESULT,THIS
***REMOVED***
goog.Thenable.prototype.then = function(opt_onFulfilled, opt_onRejected,
    opt_context) {***REMOVED***


***REMOVED***
***REMOVED*** An expando property to indicate that an object implements
***REMOVED*** {@code goog.Thenable}.
***REMOVED***
***REMOVED*** {@see addImplementation}.
***REMOVED***
***REMOVED*** @const
***REMOVED***
goog.Thenable.IMPLEMENTED_BY_PROP = '$goog_Thenable';


***REMOVED***
***REMOVED*** Marks a given class (constructor) as an implementation of Thenable, so
***REMOVED*** that we can query that fact at runtime. The class must have already
***REMOVED*** implemented the interface.
***REMOVED*** Exports a 'then' method on the constructor prototype, so that the objects
***REMOVED*** also implement the extern {@see goog.Thenable} interface for interop with
***REMOVED*** other Promise implementations.
***REMOVED*** @param {function(new:goog.Thenable,...[?])} ctor The class constructor. The
***REMOVED***     corresponding class must have already implemented the interface.
***REMOVED***
goog.Thenable.addImplementation = function(ctor) {
  goog.exportProperty(ctor.prototype, 'then', ctor.prototype.then);
  if (COMPILED) {
    ctor.prototype[goog.Thenable.IMPLEMENTED_BY_PROP] = true;
  } else {
    // Avoids dictionary access in uncompiled mode.
    ctor.prototype.$goog_Thenable = true;
  }
***REMOVED***


***REMOVED***
***REMOVED*** @param {*} object
***REMOVED*** @return {boolean} Whether a given instance implements {@code goog.Thenable}.
***REMOVED***     The class/superclass of the instance must call {@code addImplementation}.
***REMOVED***
goog.Thenable.isImplementedBy = function(object) {
  if (!object) {
    return false;
  }
  try {
    if (COMPILED) {
      return !!object[goog.Thenable.IMPLEMENTED_BY_PROP];
    }
    return !!object.$goog_Thenable;
  } catch (e) {
    // Property access seems to be forbidden.
    return false;
  }
***REMOVED***
