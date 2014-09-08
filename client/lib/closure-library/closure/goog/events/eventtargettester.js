// Copyright 2012 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview goog.events.EventTarget tester.
***REMOVED***

goog.provide('goog.events.eventTargetTester');
goog.setTestOnly('goog.events.eventTargetTester');
goog.provide('goog.events.eventTargetTester.KeyType');
goog.setTestOnly('goog.events.eventTargetTester.KeyType');
goog.provide('goog.events.eventTargetTester.UnlistenReturnType');
goog.setTestOnly('goog.events.eventTargetTester.UnlistenReturnType');

goog.require('goog.array');
***REMOVED***
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.testing.asserts');
goog.require('goog.testing.recordFunction');


***REMOVED***
***REMOVED*** Setup step for the test functions. This needs to be called from the
***REMOVED*** test setUp.
***REMOVED*** @param {function():!goog.events.Listenable} listenableFactoryFn Function
***REMOVED***     that will return a new Listenable instance each time it is called.
***REMOVED*** @param {Function} listenFn Function that, given the same signature
***REMOVED***     as goog.events.listen, will add listener to the given event
***REMOVED***     target.
***REMOVED*** @param {Function} unlistenFn Function that, given the same
***REMOVED***     signature as goog.events.unlisten, will remove listener from
***REMOVED***     the given event target.
***REMOVED*** @param {Function} unlistenByKeyFn Function that, given 2
***REMOVED***     parameters: src and key, will remove the corresponding
***REMOVED***     listener.
***REMOVED*** @param {Function} listenOnceFn Function that, given the same
***REMOVED***     signature as goog.events.listenOnce, will add a one-time
***REMOVED***     listener to the given event target.
***REMOVED*** @param {Function} dispatchEventFn Function that, given the same
***REMOVED***     signature as goog.events.dispatchEvent, will dispatch the event
***REMOVED***     on the given event target.
***REMOVED*** @param {Function} removeAllFn Function that, given the same
***REMOVED***     signature as goog.events.removeAll, will remove all listeners
***REMOVED***     according to the contract of goog.events.removeAll.
***REMOVED*** @param {Function} getListenersFn Function that, given the same
***REMOVED***     signature as goog.events.getListeners, will retrieve listeners.
***REMOVED*** @param {Function} getListenerFn Function that, given the same
***REMOVED***     signature as goog.events.getListener, will retrieve the
***REMOVED***     listener object.
***REMOVED*** @param {Function} hasListenerFn Function that, given the same
***REMOVED***     signature as goog.events.hasListener, will determine whether
***REMOVED***     listeners exist.
***REMOVED*** @param {goog.events.eventTargetTester.KeyType} listenKeyType The
***REMOVED***     key type returned by listen call.
***REMOVED*** @param {goog.events.eventTargetTester.UnlistenReturnType}
***REMOVED***     unlistenFnReturnType
***REMOVED***     Whether we should check return value from
***REMOVED***     unlisten call. If unlisten does not return a value, this should
***REMOVED***     be set to false.
***REMOVED*** @param {boolean} objectListenerSupported Whether listener of type
***REMOVED***     Object is supported.
***REMOVED***
goog.events.eventTargetTester.setUp = function(
    listenableFactoryFn,
    listenFn, unlistenFn, unlistenByKeyFn, listenOnceFn,
    dispatchEventFn, removeAllFn,
    getListenersFn, getListenerFn, hasListenerFn,
    listenKeyType, unlistenFnReturnType, objectListenerSupported) {
  listenableFactory = listenableFactoryFn;
  listen = listenFn;
  unlisten = unlistenFn;
  unlistenByKey = unlistenByKeyFn;
  listenOnce = listenOnceFn;
  dispatchEvent = dispatchEventFn;
  removeAll = removeAllFn;
  getListeners = getListenersFn;
  getListener = getListenerFn;
  hasListener = hasListenerFn;
  keyType = listenKeyType;
  unlistenReturnType = unlistenFnReturnType;
  objectTypeListenerSupported = objectListenerSupported;

  listeners = [];
  for (var i = 0; i < goog.events.eventTargetTester.MAX_; i++) {
    listeners[i] = createListener();
  }

  eventTargets = [];
  for (i = 0; i < goog.events.eventTargetTester.MAX_; i++) {
    eventTargets[i] = listenableFactory();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Teardown step for the test functions. This needs to be called from
***REMOVED*** test teardown.
***REMOVED***
goog.events.eventTargetTester.tearDown = function() {
  for (var i = 0; i < goog.events.eventTargetTester.MAX_; i++) {
    goog.dispose(eventTargets[i]);
  }
***REMOVED***


***REMOVED***
***REMOVED*** The type of key returned by key-returning functions (listen).
***REMOVED*** @enum {number}
***REMOVED***
goog.events.eventTargetTester.KeyType = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Returns number for key.
 ***REMOVED*****REMOVED***
  NUMBER: 0,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Returns undefined (no return value).
 ***REMOVED*****REMOVED***
  UNDEFINED: 1
***REMOVED***


***REMOVED***
***REMOVED*** The type of unlisten function's return value.
***REMOVED***
goog.events.eventTargetTester.UnlistenReturnType = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Returns boolean indicating whether unlisten is successful.
 ***REMOVED*****REMOVED***
  BOOLEAN: 0,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Returns undefind (no return value).
 ***REMOVED*****REMOVED***
  UNDEFINED: 1
***REMOVED***


***REMOVED***
***REMOVED*** Expando property used on "listener" function to determine if a
***REMOVED*** listener has already been checked. This is what allows us to
***REMOVED*** implement assertNoOtherListenerIsCalled.
***REMOVED*** @type {string}
***REMOVED***
goog.events.eventTargetTester.ALREADY_CHECKED_PROP = '__alreadyChecked';


***REMOVED***
***REMOVED*** Expando property used on "listener" function to record the number
***REMOVED*** of times it has been called the last time assertListenerIsCalled is
***REMOVED*** done. This allows us to verify that it has not been called more
***REMOVED*** times in assertNoOtherListenerIsCalled.
***REMOVED***
goog.events.eventTargetTester.NUM_CALLED_PROP = '__numCalled';


***REMOVED***
***REMOVED*** The maximum number of initialized event targets (in eventTargets
***REMOVED*** array) and listeners (in listeners array).
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.events.eventTargetTester.MAX_ = 10;


***REMOVED***
***REMOVED*** Contains test event types.
***REMOVED*** @enum {string}
***REMOVED***
var EventType = {
  A: goog.events.getUniqueId('a'),
  B: goog.events.getUniqueId('b'),
  C: goog.events.getUniqueId('c')
***REMOVED***


var listen, unlisten, unlistenByKey, listenOnce, dispatchEvent;
var removeAll, getListeners, getListener, hasListener;
var keyType, unlistenReturnType, objectTypeListenerSupported;
var eventTargets, listeners;



***REMOVED***
***REMOVED*** Custom event object for testing.
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED*** @final
***REMOVED***
var TestEvent = function() {
  goog.base(this, EventType.A);
***REMOVED***
goog.inherits(TestEvent, goog.events.Event);


***REMOVED***
***REMOVED*** Creates a listener that executes the given function (optional).
***REMOVED*** @param {!Function=} opt_listenerFn The optional function to execute.
***REMOVED*** @return {!Function} The listener function.
***REMOVED***
function createListener(opt_listenerFn) {
  return goog.testing.recordFunction(opt_listenerFn);
}


***REMOVED***
***REMOVED*** Asserts that the given listener is called numCount number of times.
***REMOVED*** @param {!Function} listener The listener to check.
***REMOVED*** @param {number} numCount The number of times. See also the times()
***REMOVED***     function below.
***REMOVED***
function assertListenerIsCalled(listener, numCount) {
  assertEquals('Listeners is not called the correct number of times.',
               numCount, listener.getCallCount());
  listener[goog.events.eventTargetTester.ALREADY_CHECKED_PROP] = true;
  listener[goog.events.eventTargetTester.NUM_CALLED_PROP] = numCount;
}


***REMOVED***
***REMOVED*** Asserts that no other listeners, other than those verified via
***REMOVED*** assertListenerIsCalled, have been called since the last
***REMOVED*** resetListeners().
***REMOVED***
function assertNoOtherListenerIsCalled() {
  goog.array.forEach(listeners, function(l, index) {
    if (!l[goog.events.eventTargetTester.ALREADY_CHECKED_PROP]) {
      assertEquals(
          'Listeners ' + index + ' is unexpectedly called.',
          0, l.getCallCount());
    } else {
      assertEquals(
          'Listeners ' + index + ' is unexpectedly called.',
          l[goog.events.eventTargetTester.NUM_CALLED_PROP], l.getCallCount());
    }
  });
}


***REMOVED***
***REMOVED*** Resets all listeners call count to 0.
***REMOVED***
function resetListeners() {
  goog.array.forEach(listeners, function(l) {
    l.reset();
    l[goog.events.eventTargetTester.ALREADY_CHECKED_PROP] = false;
  });
}


***REMOVED***
***REMOVED*** The number of times a listener should have been executed. This
***REMOVED*** exists to make assertListenerIsCalled more readable.  This is used
***REMOVED*** like so: assertListenerIsCalled(listener, times(2));
***REMOVED*** @param {number} n The number of times a listener should have been
***REMOVED***     executed.
***REMOVED*** @return {number} The number n.
***REMOVED***
function times(n) {
  return n;
}


function testNoListener() {
  dispatchEvent(eventTargets[0], EventType.A);
  assertNoOtherListenerIsCalled();
}


function testOneListener() {
  listen(eventTargets[0], EventType.A, listeners[0]);
  dispatchEvent(eventTargets[0], EventType.A);
  assertListenerIsCalled(listeners[0], times(1));
  assertNoOtherListenerIsCalled();

  resetListeners();

  dispatchEvent(eventTargets[0], EventType.B);
  dispatchEvent(eventTargets[0], EventType.C);
  assertNoOtherListenerIsCalled();
}


function testTwoListenersOfSameType() {
  var key1 = listen(eventTargets[0], EventType.A, listeners[0]);
  var key2 = listen(eventTargets[0], EventType.A, listeners[1]);

  if (keyType == goog.events.eventTargetTester.KeyType.NUMBER) {
    assertNotEquals(key1, key2);
  } else {
    assertUndefined(key1);
    assertUndefined(key2);
  }

  dispatchEvent(eventTargets[0], EventType.A);
  assertListenerIsCalled(listeners[0], times(1));
  assertListenerIsCalled(listeners[1], times(1));
  assertNoOtherListenerIsCalled();
}


function testInstallingSameListeners() {
  var key1 = listen(eventTargets[0], EventType.A, listeners[0]);
  var key2 = listen(eventTargets[0], EventType.A, listeners[0]);
  var key3 = listen(eventTargets[0], EventType.B, listeners[0]);

  if (keyType == goog.events.eventTargetTester.KeyType.NUMBER) {
    assertEquals(key1, key2);
    assertNotEquals(key1, key3);
  } else {
    assertUndefined(key1);
    assertUndefined(key2);
    assertUndefined(key3);
  }

  dispatchEvent(eventTargets[0], EventType.A);
  assertListenerIsCalled(listeners[0], times(1));

  dispatchEvent(eventTargets[0], EventType.B);
  assertListenerIsCalled(listeners[0], times(2));

  assertNoOtherListenerIsCalled();
}


function testScope() {
  listeners[0] = createListener(function(e) {
    assertEquals('Wrong scope with undefined scope', eventTargets[0], this);
  });
  listeners[1] = createListener(function(e) {
    assertEquals('Wrong scope with null scope', eventTargets[0], this);
  });
  var scope = {***REMOVED***
  listeners[2] = createListener(function(e) {
    assertEquals('Wrong scope with specific scope object', scope, this);
  });
  listen(eventTargets[0], EventType.A, listeners[0]);
  listen(eventTargets[0], EventType.A, listeners[1], false, null);
  listen(eventTargets[0], EventType.A, listeners[2], false, scope);

  dispatchEvent(eventTargets[0], EventType.A);
  assertListenerIsCalled(listeners[0], times(1));
  assertListenerIsCalled(listeners[1], times(1));
  assertListenerIsCalled(listeners[2], times(1));
}


function testDispatchEventDoesNotThrowWithDisposedEventTarget() {
  goog.dispose(eventTargets[0]);
  assertTrue(dispatchEvent(eventTargets[0], EventType.A));
}


function testDispatchEventWithObjectLiteral() {
  listen(eventTargets[0], EventType.A, listeners[0]);

  assertTrue(dispatchEvent(eventTargets[0], {type: EventType.A}));
  assertListenerIsCalled(listeners[0], times(1));
  assertNoOtherListenerIsCalled();
}


function testDispatchEventWithCustomEventObject() {
  listen(eventTargets[0], EventType.A, listeners[0]);

  var e = new TestEvent();
  assertTrue(dispatchEvent(eventTargets[0], e));
  assertListenerIsCalled(listeners[0], times(1));
  assertNoOtherListenerIsCalled();

  var actualEvent = listeners[0].getLastCall().getArgument(0);

  assertEquals(e, actualEvent);
  assertEquals(eventTargets[0], actualEvent.target);
}


function testDisposingEventTargetRemovesListeners() {
  if (!(listenableFactory() instanceof goog.events.EventTarget)) {
    return;
  }
  listen(eventTargets[0], EventType.A, listeners[0]);
  goog.dispose(eventTargets[0]);
  dispatchEvent(eventTargets[0], EventType.A);

  assertNoOtherListenerIsCalled();
}


***REMOVED***
***REMOVED*** Unlisten/unlistenByKey should still work after disposal. There are
***REMOVED*** many circumstances when this is actually necessary. For example, a
***REMOVED*** user may have listened to an event target and stored the key
***REMOVED*** (e.g. in a goog.events.EventHandler) and only unlisten after the
***REMOVED*** target has been disposed.
***REMOVED***
function testUnlistenWorksAfterDisposal() {
  var key = listen(eventTargets[0], EventType.A, listeners[0]);
  goog.dispose(eventTargets[0]);
  unlisten(eventTargets[0], EventType.A, listeners[1]);
  if (unlistenByKey) {
    unlistenByKey(eventTargets[0], key);
  }
}


function testRemovingListener() {
  var ret1 = unlisten(eventTargets[0], EventType.A, listeners[0]);
  listen(eventTargets[0], EventType.A, listeners[0]);
  var ret2 = unlisten(eventTargets[0], EventType.A, listeners[1]);
  var ret3 = unlisten(eventTargets[0], EventType.B, listeners[0]);
  var ret4 = unlisten(eventTargets[1], EventType.A, listeners[0]);

  dispatchEvent(eventTargets[0], EventType.A);
  assertListenerIsCalled(listeners[0], times(1));

  var ret5 = unlisten(eventTargets[0], EventType.A, listeners[0]);
  var ret6 = unlisten(eventTargets[0], EventType.A, listeners[0]);

  dispatchEvent(eventTargets[0], EventType.A);
  assertListenerIsCalled(listeners[0], times(1));

  assertNoOtherListenerIsCalled();

  if (unlistenReturnType ==
      goog.events.eventTargetTester.UnlistenReturnType.BOOLEAN) {
    assertFalse(ret1);
    assertFalse(ret2);
    assertFalse(ret3);
    assertFalse(ret4);
    assertTrue(ret5);
    assertFalse(ret6);
  } else {
    assertUndefined(ret1);
    assertUndefined(ret2);
    assertUndefined(ret3);
    assertUndefined(ret4);
    assertUndefined(ret5);
    assertUndefined(ret6);
  }
}


function testCapture() {
  eventTargets[0].setParentEventTarget(eventTargets[1]);
  eventTargets[1].setParentEventTarget(eventTargets[2]);

  eventTargets[9].setParentEventTarget(eventTargets[0]);

  var ordering = 0;
  listeners[0] = createListener(
      function(e) {
        assertEquals(eventTargets[2], e.currentTarget);
        assertEquals(eventTargets[0], e.target);
        assertEquals('First capture listener is not called first', 0, ordering);
        ordering++;
      });
  listeners[1] = createListener(
      function(e) {
        assertEquals(eventTargets[1], e.currentTarget);
        assertEquals(eventTargets[0], e.target);
        assertEquals('2nd capture listener is not called 2nd', 1, ordering);
        ordering++;
      });
  listeners[2] = createListener(
      function(e) {
        assertEquals(eventTargets[0], e.currentTarget);
        assertEquals(eventTargets[0], e.target);
        assertEquals('3rd capture listener is not called 3rd', 2, ordering);
        ordering++;
      });

  listen(eventTargets[2], EventType.A, listeners[0], true);
  listen(eventTargets[1], EventType.A, listeners[1], true);
  listen(eventTargets[0], EventType.A, listeners[2], true);

  // These should not be called.
  listen(eventTargets[3], EventType.A, listeners[3], true);

  listen(eventTargets[0], EventType.B, listeners[4], true);
  listen(eventTargets[0], EventType.C, listeners[5], true);
  listen(eventTargets[1], EventType.B, listeners[6], true);
  listen(eventTargets[1], EventType.C, listeners[7], true);
  listen(eventTargets[2], EventType.B, listeners[8], true);
  listen(eventTargets[2], EventType.C, listeners[9], true);

  dispatchEvent(eventTargets[0], EventType.A);
  assertListenerIsCalled(listeners[0], times(1));
  assertListenerIsCalled(listeners[1], times(1));
  assertListenerIsCalled(listeners[2], times(1));
  assertNoOtherListenerIsCalled();
}


function testBubble() {
  eventTargets[0].setParentEventTarget(eventTargets[1]);
  eventTargets[1].setParentEventTarget(eventTargets[2]);

  eventTargets[9].setParentEventTarget(eventTargets[0]);

  var ordering = 0;
  listeners[0] = createListener(
      function(e) {
        assertEquals(eventTargets[0], e.currentTarget);
        assertEquals(eventTargets[0], e.target);
        assertEquals('First bubble listener is not called first', 0, ordering);
        ordering++;
      });
  listeners[1] = createListener(
      function(e) {
        assertEquals(eventTargets[1], e.currentTarget);
        assertEquals(eventTargets[0], e.target);
        assertEquals('2nd bubble listener is not called 2nd', 1, ordering);
        ordering++;
      });
  listeners[2] = createListener(
      function(e) {
        assertEquals(eventTargets[2], e.currentTarget);
        assertEquals(eventTargets[0], e.target);
        assertEquals('3rd bubble listener is not called 3rd', 2, ordering);
        ordering++;
      });

  listen(eventTargets[0], EventType.A, listeners[0]);
  listen(eventTargets[1], EventType.A, listeners[1]);
  listen(eventTargets[2], EventType.A, listeners[2]);

  // These should not be called.
  listen(eventTargets[3], EventType.A, listeners[3]);

  listen(eventTargets[0], EventType.B, listeners[4]);
  listen(eventTargets[0], EventType.C, listeners[5]);
  listen(eventTargets[1], EventType.B, listeners[6]);
  listen(eventTargets[1], EventType.C, listeners[7]);
  listen(eventTargets[2], EventType.B, listeners[8]);
  listen(eventTargets[2], EventType.C, listeners[9]);

  dispatchEvent(eventTargets[0], EventType.A);
  assertListenerIsCalled(listeners[0], times(1));
  assertListenerIsCalled(listeners[1], times(1));
  assertListenerIsCalled(listeners[2], times(1));
  assertNoOtherListenerIsCalled();
}


function testCaptureAndBubble() {
  eventTargets[0].setParentEventTarget(eventTargets[1]);
  eventTargets[1].setParentEventTarget(eventTargets[2]);

  listen(eventTargets[0], EventType.A, listeners[0], true);
  listen(eventTargets[1], EventType.A, listeners[1], true);
  listen(eventTargets[2], EventType.A, listeners[2], true);

  listen(eventTargets[0], EventType.A, listeners[3]);
  listen(eventTargets[1], EventType.A, listeners[4]);
  listen(eventTargets[2], EventType.A, listeners[5]);

  dispatchEvent(eventTargets[0], EventType.A);
  assertListenerIsCalled(listeners[0], times(1));
  assertListenerIsCalled(listeners[1], times(1));
  assertListenerIsCalled(listeners[2], times(1));
  assertListenerIsCalled(listeners[3], times(1));
  assertListenerIsCalled(listeners[4], times(1));
  assertListenerIsCalled(listeners[5], times(1));
  assertNoOtherListenerIsCalled();
}


function testPreventDefaultByReturningFalse() {
  listeners[0] = createListener(function(e) { return false; });
  listeners[1] = createListener(function(e) { return true; });
  listen(eventTargets[0], EventType.A, listeners[0]);
  listen(eventTargets[0], EventType.A, listeners[1]);

  var result = dispatchEvent(eventTargets[0], EventType.A);
  assertFalse(result);
}


function testPreventDefault() {
  listeners[0] = createListener(function(e) { e.preventDefault(); });
  listeners[1] = createListener(function(e) { return true; });
  listen(eventTargets[0], EventType.A, listeners[0]);
  listen(eventTargets[0], EventType.A, listeners[1]);

  var result = dispatchEvent(eventTargets[0], EventType.A);
  assertFalse(result);
}


function testPreventDefaultAtCapture() {
  listeners[0] = createListener(function(e) { e.preventDefault(); });
  listeners[1] = createListener(function(e) { return true; });
  listen(eventTargets[0], EventType.A, listeners[0], true);
  listen(eventTargets[0], EventType.A, listeners[1], true);

  var result = dispatchEvent(eventTargets[0], EventType.A);
  assertFalse(result);
}


function testStopPropagation() {
  eventTargets[0].setParentEventTarget(eventTargets[1]);
  eventTargets[1].setParentEventTarget(eventTargets[2]);

  listeners[0] = createListener(function(e) { e.stopPropagation(); });
  listen(eventTargets[0], EventType.A, listeners[0]);
  listen(eventTargets[0], EventType.A, listeners[1]);
  listen(eventTargets[1], EventType.A, listeners[2]);
  listen(eventTargets[2], EventType.A, listeners[3]);

  dispatchEvent(eventTargets[0], EventType.A);

  assertListenerIsCalled(listeners[0], times(1));
  assertListenerIsCalled(listeners[1], times(1));
  assertNoOtherListenerIsCalled();
}


function testStopPropagation2() {
  eventTargets[0].setParentEventTarget(eventTargets[1]);
  eventTargets[1].setParentEventTarget(eventTargets[2]);

  listeners[1] = createListener(function(e) { e.stopPropagation(); });
  listen(eventTargets[0], EventType.A, listeners[0]);
  listen(eventTargets[0], EventType.A, listeners[1]);
  listen(eventTargets[1], EventType.A, listeners[2]);
  listen(eventTargets[2], EventType.A, listeners[3]);

  dispatchEvent(eventTargets[0], EventType.A);

  assertListenerIsCalled(listeners[0], times(1));
  assertListenerIsCalled(listeners[1], times(1));
  assertNoOtherListenerIsCalled();
}


function testStopPropagation3() {
  eventTargets[0].setParentEventTarget(eventTargets[1]);
  eventTargets[1].setParentEventTarget(eventTargets[2]);

  listeners[2] = createListener(function(e) { e.stopPropagation(); });
  listen(eventTargets[0], EventType.A, listeners[0]);
  listen(eventTargets[0], EventType.A, listeners[1]);
  listen(eventTargets[1], EventType.A, listeners[2]);
  listen(eventTargets[2], EventType.A, listeners[3]);

  dispatchEvent(eventTargets[0], EventType.A);

  assertListenerIsCalled(listeners[0], times(1));
  assertListenerIsCalled(listeners[1], times(1));
  assertListenerIsCalled(listeners[2], times(1));
  assertNoOtherListenerIsCalled();
}


function testStopPropagationAtCapture() {
  eventTargets[0].setParentEventTarget(eventTargets[1]);
  eventTargets[1].setParentEventTarget(eventTargets[2]);

  listeners[0] = createListener(function(e) { e.stopPropagation(); });
  listen(eventTargets[2], EventType.A, listeners[0], true);
  listen(eventTargets[1], EventType.A, listeners[1], true);
  listen(eventTargets[0], EventType.A, listeners[2], true);
  listen(eventTargets[0], EventType.A, listeners[3]);
  listen(eventTargets[1], EventType.A, listeners[4]);
  listen(eventTargets[2], EventType.A, listeners[5]);

  dispatchEvent(eventTargets[0], EventType.A);

  assertListenerIsCalled(listeners[0], times(1));
  assertNoOtherListenerIsCalled();
}


function testHandleEvent() {
  if (!objectTypeListenerSupported) {
    return;
  }

  var obj = {***REMOVED***
  obj.handleEvent = goog.testing.recordFunction();

  listen(eventTargets[0], EventType.A, obj);
  dispatchEvent(eventTargets[0], EventType.A);

  assertEquals(1, obj.handleEvent.getCallCount());
}


function testListenOnce() {
  if (!listenOnce) {
    return;
  }

  listenOnce(eventTargets[0], EventType.A, listeners[0], true);
  listenOnce(eventTargets[0], EventType.A, listeners[1]);
  listenOnce(eventTargets[0], EventType.B, listeners[2]);

  dispatchEvent(eventTargets[0], EventType.A);

  assertListenerIsCalled(listeners[0], times(1));
  assertListenerIsCalled(listeners[1], times(1));
  assertListenerIsCalled(listeners[2], times(0));
  assertNoOtherListenerIsCalled();
  resetListeners();

  dispatchEvent(eventTargets[0], EventType.A);

  assertListenerIsCalled(listeners[0], times(0));
  assertListenerIsCalled(listeners[1], times(0));
  assertListenerIsCalled(listeners[2], times(0));

  dispatchEvent(eventTargets[0], EventType.B);
  assertListenerIsCalled(listeners[2], times(1));
  assertNoOtherListenerIsCalled();
}


function testUnlistenInListen() {
  listeners[1] = createListener(
      function(e) {
        unlisten(eventTargets[0], EventType.A, listeners[1]);
        unlisten(eventTargets[0], EventType.A, listeners[2]);
      });
  listen(eventTargets[0], EventType.A, listeners[0]);
  listen(eventTargets[0], EventType.A, listeners[1]);
  listen(eventTargets[0], EventType.A, listeners[2]);
  listen(eventTargets[0], EventType.A, listeners[3]);

  dispatchEvent(eventTargets[0], EventType.A);

  assertListenerIsCalled(listeners[0], times(1));
  assertListenerIsCalled(listeners[1], times(1));
  assertListenerIsCalled(listeners[2], times(0));
  assertListenerIsCalled(listeners[3], times(1));
  assertNoOtherListenerIsCalled();
  resetListeners();

  dispatchEvent(eventTargets[0], EventType.A);
  assertListenerIsCalled(listeners[0], times(1));
  assertListenerIsCalled(listeners[1], times(0));
  assertListenerIsCalled(listeners[2], times(0));
  assertListenerIsCalled(listeners[3], times(1));
  assertNoOtherListenerIsCalled();
}


function testUnlistenByKeyInListen() {
  if (!unlistenByKey) {
    return;
  }

  var key1, key2;
  listeners[1] = createListener(
      function(e) {
        unlistenByKey(eventTargets[0], key1);
        unlistenByKey(eventTargets[0], key2);
      });
  listen(eventTargets[0], EventType.A, listeners[0]);
  key1 = listen(eventTargets[0], EventType.A, listeners[1]);
  key2 = listen(eventTargets[0], EventType.A, listeners[2]);
  listen(eventTargets[0], EventType.A, listeners[3]);

  dispatchEvent(eventTargets[0], EventType.A);

  assertListenerIsCalled(listeners[0], times(1));
  assertListenerIsCalled(listeners[1], times(1));
  assertListenerIsCalled(listeners[2], times(0));
  assertListenerIsCalled(listeners[3], times(1));
  assertNoOtherListenerIsCalled();
  resetListeners();

  dispatchEvent(eventTargets[0], EventType.A);
  assertListenerIsCalled(listeners[0], times(1));
  assertListenerIsCalled(listeners[1], times(0));
  assertListenerIsCalled(listeners[2], times(0));
  assertListenerIsCalled(listeners[3], times(1));
  assertNoOtherListenerIsCalled();
}


function testSetParentEventTarget() {
  assertNull(eventTargets[0].getParentEventTarget());

  eventTargets[0].setParentEventTarget(eventTargets[1]);
  assertEquals(eventTargets[1], eventTargets[0].getParentEventTarget());
  assertNull(eventTargets[1].getParentEventTarget());

  eventTargets[0].setParentEventTarget(null);
  assertNull(eventTargets[0].getParentEventTarget());
}


function testListenOnceAfterListenDoesNotChangeExistingListener() {
  if (!listenOnce) {
    return;
  }

  listen(eventTargets[0], EventType.A, listeners[0]);
  listenOnce(eventTargets[0], EventType.A, listeners[0]);

  dispatchEvent(eventTargets[0], EventType.A);
  dispatchEvent(eventTargets[0], EventType.A);
  dispatchEvent(eventTargets[0], EventType.A);

  assertListenerIsCalled(listeners[0], times(3));
  assertNoOtherListenerIsCalled();
}


function testListenOnceAfterListenOnceDoesNotChangeExistingListener() {
  if (!listenOnce) {
    return;
  }

  listenOnce(eventTargets[0], EventType.A, listeners[0]);
  listenOnce(eventTargets[0], EventType.A, listeners[0]);

  dispatchEvent(eventTargets[0], EventType.A);
  dispatchEvent(eventTargets[0], EventType.A);
  dispatchEvent(eventTargets[0], EventType.A);

  assertListenerIsCalled(listeners[0], times(1));
  assertNoOtherListenerIsCalled();
}


function testListenAfterListenOnceRemoveOnceness() {
  if (!listenOnce) {
    return;
  }

  listenOnce(eventTargets[0], EventType.A, listeners[0]);
  listen(eventTargets[0], EventType.A, listeners[0]);

  dispatchEvent(eventTargets[0], EventType.A);
  dispatchEvent(eventTargets[0], EventType.A);
  dispatchEvent(eventTargets[0], EventType.A);

  assertListenerIsCalled(listeners[0], times(3));
  assertNoOtherListenerIsCalled();
}


function testUnlistenAfterListenOnce() {
  if (!listenOnce) {
    return;
  }

  listenOnce(eventTargets[0], EventType.A, listeners[0]);
  unlisten(eventTargets[0], EventType.A, listeners[0]);
  dispatchEvent(eventTargets[0], EventType.A);

  listen(eventTargets[0], EventType.A, listeners[0]);
  listenOnce(eventTargets[0], EventType.A, listeners[0]);
  unlisten(eventTargets[0], EventType.A, listeners[0]);
  dispatchEvent(eventTargets[0], EventType.A);

  listenOnce(eventTargets[0], EventType.A, listeners[0]);
  listen(eventTargets[0], EventType.A, listeners[0]);
  unlisten(eventTargets[0], EventType.A, listeners[0]);
  dispatchEvent(eventTargets[0], EventType.A);

  listenOnce(eventTargets[0], EventType.A, listeners[0]);
  listenOnce(eventTargets[0], EventType.A, listeners[0]);
  unlisten(eventTargets[0], EventType.A, listeners[0]);
  dispatchEvent(eventTargets[0], EventType.A);

  assertNoOtherListenerIsCalled();
}


function testRemoveAllWithType() {
  if (!removeAll) {
    return;
  }

  listen(eventTargets[0], EventType.A, listeners[0], true);
  listen(eventTargets[0], EventType.A, listeners[1]);
  listen(eventTargets[0], EventType.C, listeners[2], true);
  listen(eventTargets[0], EventType.C, listeners[3]);
  listen(eventTargets[0], EventType.B, listeners[4], true);
  listen(eventTargets[0], EventType.B, listeners[5], true);
  listen(eventTargets[0], EventType.B, listeners[6]);
  listen(eventTargets[0], EventType.B, listeners[7]);

  assertEquals(4, removeAll(eventTargets[0], EventType.B));

  dispatchEvent(eventTargets[0], EventType.A);
  dispatchEvent(eventTargets[0], EventType.B);
  dispatchEvent(eventTargets[0], EventType.C);

  assertListenerIsCalled(listeners[0], times(1));
  assertListenerIsCalled(listeners[1], times(1));
  assertListenerIsCalled(listeners[2], times(1));
  assertListenerIsCalled(listeners[3], times(1));
  assertNoOtherListenerIsCalled();
}


function testRemoveAll() {
  if (!removeAll) {
    return;
  }

  listen(eventTargets[0], EventType.A, listeners[0], true);
  listen(eventTargets[0], EventType.A, listeners[1]);
  listen(eventTargets[0], EventType.C, listeners[2], true);
  listen(eventTargets[0], EventType.C, listeners[3]);
  listen(eventTargets[0], EventType.B, listeners[4], true);
  listen(eventTargets[0], EventType.B, listeners[5], true);
  listen(eventTargets[0], EventType.B, listeners[6]);
  listen(eventTargets[0], EventType.B, listeners[7]);

  assertEquals(8, removeAll(eventTargets[0]));

  dispatchEvent(eventTargets[0], EventType.A);
  dispatchEvent(eventTargets[0], EventType.B);
  dispatchEvent(eventTargets[0], EventType.C);

  assertNoOtherListenerIsCalled();
}


function testRemoveAllCallsMarkAsRemoved() {
  if (!removeAll) {
    return;
  }

  var key0 = listen(eventTargets[0], EventType.A, listeners[0]);
  var key1 = listen(eventTargets[1], EventType.A, listeners[1]);

  assertNotNullNorUndefined(key0.listener);
  assertFalse(key0.removed);
  assertNotNullNorUndefined(key1.listener);
  assertFalse(key1.removed);

  assertEquals(1, removeAll(eventTargets[0]));
  assertNull(key0.listener);
  assertTrue(key0.removed);
  assertNotNullNorUndefined(key1.listener);
  assertFalse(key1.removed);

  assertEquals(1, removeAll(eventTargets[1]));
  assertNull(key1.listener);
  assertTrue(key1.removed);
}


function testGetListeners() {
  if (!getListeners) {
    return;
  }

  listen(eventTargets[0], EventType.A, listeners[0], true);
  listen(eventTargets[0], EventType.A, listeners[1], true);
  listen(eventTargets[0], EventType.A, listeners[2]);
  listen(eventTargets[0], EventType.A, listeners[3]);

  var l = getListeners(eventTargets[0], EventType.A, true);
  assertEquals(2, l.length);
  assertEquals(listeners[0], l[0].listener);
  assertEquals(listeners[1], l[1].listener);

  l = getListeners(eventTargets[0], EventType.A, false);
  assertEquals(2, l.length);
  assertEquals(listeners[2], l[0].listener);
  assertEquals(listeners[3], l[1].listener);

  l = getListeners(eventTargets[0], EventType.B, true);
  assertEquals(0, l.length);
}


function testGetListener() {
  if (!getListener) {
    return;
  }

  listen(eventTargets[0], EventType.A, listeners[0], true);

  assertNotNull(getListener(eventTargets[0], EventType.A, listeners[0], true));
  assertNull(
      getListener(eventTargets[0], EventType.A, listeners[0], true, {}));
  assertNull(getListener(eventTargets[1], EventType.A, listeners[0], true));
  assertNull(getListener(eventTargets[0], EventType.B, listeners[0], true));
  assertNull(getListener(eventTargets[0], EventType.A, listeners[1], true));
}


function testHasListener() {
  if (!hasListener) {
    return;
  }

  assertFalse(hasListener(eventTargets[0]));

  listen(eventTargets[0], EventType.A, listeners[0], true);

  assertTrue(hasListener(eventTargets[0]));
  assertTrue(hasListener(eventTargets[0], EventType.A));
  assertTrue(hasListener(eventTargets[0], EventType.A, true));
  assertTrue(hasListener(eventTargets[0], undefined, true));
  assertFalse(hasListener(eventTargets[0], EventType.A, false));
  assertFalse(hasListener(eventTargets[0], undefined, false));
  assertFalse(hasListener(eventTargets[0], EventType.B));
  assertFalse(hasListener(eventTargets[0], EventType.B, true));
  assertFalse(hasListener(eventTargets[1]));
}


function testFiringEventBeforeDisposeInternalWorks() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @extends {goog.events.EventTarget}
 ***REMOVED*****REMOVED***
  ***REMOVED*** @final
 ***REMOVED*****REMOVED***
  var MockTarget = function() {
    goog.base(this);
 ***REMOVED*****REMOVED***
  goog.inherits(MockTarget, goog.events.EventTarget);

  MockTarget.prototype.disposeInternal = function() {
    dispatchEvent(this, EventType.A);
    goog.base(this, 'disposeInternal');
 ***REMOVED*****REMOVED***

  var t = new MockTarget();
  try {
    listen(t, EventType.A, listeners[0]);
    t.dispose();
    assertListenerIsCalled(listeners[0], times(1));
  } catch (e) {
    goog.dispose(t);
  }
}


function testLoopDetection() {
  var target = listenableFactory();
  target.setParentEventTarget(target);

  try {
    target.dispatchEvent('string');
    fail('expected error');
  } catch (e) {
    assertContains('infinite', e.message);
  }
}
