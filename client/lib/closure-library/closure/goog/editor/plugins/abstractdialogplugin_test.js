// Copyright 2008 The Closure Library Authors. All Rights Reserved.
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

goog.provide('goog.editor.plugins.AbstractDialogPluginTest');
goog.setTestOnly('goog.editor.plugins.AbstractDialogPluginTest');

goog.require('goog.dom.SavedRange');
goog.require('goog.editor.Field');
goog.require('goog.editor.plugins.AbstractDialogPlugin');
goog.require('goog.events.Event');
goog.require('goog.events.EventHandler');
goog.require('goog.functions');
goog.require('goog.testing.MockClock');
goog.require('goog.testing.MockControl');
goog.require('goog.testing.PropertyReplacer');
goog.require('goog.testing.editor.FieldMock');
goog.require('goog.testing.editor.TestHelper');
goog.require('goog.testing.events');
goog.require('goog.testing.jsunit');
goog.require('goog.testing.mockmatchers.ArgumentMatcher');
goog.require('goog.ui.editor.AbstractDialog');
goog.require('goog.userAgent');

var plugin;
var mockCtrl;
var mockField;
var mockSavedRange;
var mockOpenedHandler;
var mockClosedHandler;

var COMMAND = 'myCommand';
var stubs = new goog.testing.PropertyReplacer();

var mockClock;
var fieldObj;
var fieldElem;
var mockHandler;

function setUp() {
  mockCtrl = new goog.testing.MockControl();
  mockOpenedHandler = mockCtrl.createLooseMock(goog.events.EventHandler);
  mockClosedHandler = mockCtrl.createLooseMock(goog.events.EventHandler);

  mockField = new goog.testing.editor.FieldMock(undefined, undefined, {});
  mockCtrl.addMock(mockField);
  mockField.focus();

  plugin = createDialogPlugin();
}

function setUpMockRange() {
  mockSavedRange = mockCtrl.createLooseMock(goog.dom.SavedRange);
  mockSavedRange.restore();

  stubs.setPath('goog.editor.range.saveUsingNormalizedCarets',
      goog.functions.constant(mockSavedRange));
}

function tearDown() {
  stubs.reset();
  tearDownRealEditableField();
  if (mockClock) {
    // Crucial to letting time operations work normally in the rest of tests.
    mockClock.dispose();
  }
  if (plugin) {
    mockField.$setIgnoreUnexpectedCalls(true);
    plugin.dispose();
  }
}


***REMOVED***
***REMOVED*** Creates a concrete instance of goog.ui.editor.AbstractDialog by adding
***REMOVED*** a plain implementation of createDialogControl().
***REMOVED*** @param {goog.dom.DomHelper} dialogDomHelper The dom helper to be used to
***REMOVED***     create the dialog.
***REMOVED*** @return {goog.ui.editor.AbstractDialog} The created dialog.
***REMOVED***
function createDialog(domHelper) {
  var dialog = new goog.ui.editor.AbstractDialog(domHelper);
  dialog.createDialogControl = function() {
    return new goog.ui.editor.AbstractDialog.Builder(dialog).build();
 ***REMOVED*****REMOVED***
  return dialog;
}


***REMOVED***
***REMOVED*** Creates a concrete instance of the abstract class
***REMOVED*** goog.editor.plugins.AbstractDialogPlugin
***REMOVED*** and registers it with the mock editable field being used.
***REMOVED*** @return {goog.editor.plugins.AbstractDialogPlugin} The created plugin.
***REMOVED***
function createDialogPlugin() {
  var plugin = new goog.editor.plugins.AbstractDialogPlugin(COMMAND);
  plugin.createDialog = createDialog;
  plugin.returnControlToEditableField = plugin.restoreOriginalSelection;
  plugin.registerFieldObject(mockField);
  plugin.addEventListener(
      goog.editor.plugins.AbstractDialogPlugin.EventType.OPENED,
      mockOpenedHandler);
  plugin.addEventListener(
      goog.editor.plugins.AbstractDialogPlugin.EventType.CLOSED,
      mockClosedHandler);
  return plugin;
}


***REMOVED***
***REMOVED*** Sets up the mock event handler to expect an OPENED event.
***REMOVED***
function expectOpened(opt_times) {
  mockOpenedHandler.handleEvent(new goog.testing.mockmatchers.ArgumentMatcher(
      function(arg) {
        return arg.type ==
               goog.editor.plugins.AbstractDialogPlugin.EventType.OPENED;
      }));
  mockField.dispatchSelectionChangeEvent();
  if (opt_times) {
    mockOpenedHandler.$times(opt_times);
    mockField.$times(opt_times);
  }
}


***REMOVED***
***REMOVED*** Sets up the mock event handler to expect a CLOSED event.
***REMOVED***
function expectClosed(opt_times) {
  mockClosedHandler.handleEvent(new goog.testing.mockmatchers.ArgumentMatcher(
      function(arg) {
        return arg.type ==
               goog.editor.plugins.AbstractDialogPlugin.EventType.CLOSED;
      }));
  mockField.dispatchSelectionChangeEvent();
  if (opt_times) {
    mockClosedHandler.$times(opt_times);
    mockField.$times(opt_times);
  }
}


***REMOVED***
***REMOVED*** Tests the simple flow of calling execCommand (which opens the
***REMOVED*** dialog) and immediately disposing of the plugin (which closes the dialog).
***REMOVED*** @param {boolean=} opt_reuse Whether to set the plugin to reuse its dialog.
***REMOVED***
function testExecAndDispose(opt_reuse) {
  setUpMockRange();
  expectOpened();
  expectClosed();
  mockField.debounceEvent(goog.editor.Field.EventType.SELECTIONCHANGE);
  mockCtrl.$replayAll();
  if (opt_reuse) {
    plugin.setReuseDialog(true);
  }
  assertFalse('Dialog should not be open yet',
              !!plugin.getDialog() && plugin.getDialog().isOpen());

  plugin.execCommand(COMMAND);
  assertTrue('Dialog should be open now',
             !!plugin.getDialog() && plugin.getDialog().isOpen());

  var tempDialog = plugin.getDialog();
  plugin.dispose();
  assertFalse('Dialog should not still be open after disposal',
              tempDialog.isOpen());
  mockCtrl.$verifyAll();
}


***REMOVED***
***REMOVED*** Tests execCommand and dispose while reusing the dialog.
***REMOVED***
function testExecAndDisposeReuse() {
  testExecAndDispose(true);
}


***REMOVED***
***REMOVED*** Tests the flow of calling execCommand (which opens the dialog) and
***REMOVED*** then hiding it (simulating that a user did somthing to cause the dialog to
***REMOVED*** close).
***REMOVED*** @param {boolean} reuse Whether to set the plugin to reuse its dialog.
***REMOVED***
function testExecAndHide(opt_reuse) {
  setUpMockRange();
  expectOpened();
  expectClosed();
  mockField.debounceEvent(goog.editor.Field.EventType.SELECTIONCHANGE);
  mockCtrl.$replayAll();
  if (opt_reuse) {
    plugin.setReuseDialog(true);
  }
  assertFalse('Dialog should not be open yet',
              !!plugin.getDialog() && plugin.getDialog().isOpen());

  plugin.execCommand(COMMAND);
  assertTrue('Dialog should be open now',
             !!plugin.getDialog() && plugin.getDialog().isOpen());

  var tempDialog = plugin.getDialog();
  plugin.getDialog().hide();
  assertFalse('Dialog should not still be open after hiding',
              tempDialog.isOpen());
  if (opt_reuse) {
    assertFalse('Dialog should not be disposed after hiding (will be reused)',
                tempDialog.isDisposed());
  } else {
    assertTrue('Dialog should be disposed after hiding',
               tempDialog.isDisposed());
  }
  plugin.dispose();
  mockCtrl.$verifyAll();
}


***REMOVED***
***REMOVED*** Tests execCommand and hide while reusing the dialog.
***REMOVED***
function testExecAndHideReuse() {
  testExecAndHide(true);
}


***REMOVED***
***REMOVED*** Tests the flow of calling execCommand (which opens a dialog) and
***REMOVED*** then calling it again before the first dialog is closed. This is not
***REMOVED*** something anyone should be doing since dialogs are (usually?) modal so the
***REMOVED*** user can't do another execCommand before closing the first dialog. But
***REMOVED*** since the API makes it possible, I thought it would be good to guard
***REMOVED*** against and unit test.
***REMOVED*** @param {boolean} reuse Whether to set the plugin to reuse its dialog.
***REMOVED***
function testExecTwice(opt_reuse) {
  setUpMockRange();
  if (opt_reuse) {
    expectOpened(2); // The second exec should cause a second OPENED event.
    // But the dialog was not closed between exec calls, so only one CLOSED is
    // expected.
    expectClosed();
    plugin.setReuseDialog(true);
    mockField.debounceEvent(goog.editor.Field.EventType.SELECTIONCHANGE);
  } else {
    expectOpened(2); // The second exec should cause a second OPENED event.
    // The first dialog will be disposed so there should be two CLOSED events.
    expectClosed(2);
    mockSavedRange.restore(); // Expected 2x, once already recorded in setup.
    mockField.focus(); // Expected 2x, once already recorded in setup.
    mockField.debounceEvent(goog.editor.Field.EventType.SELECTIONCHANGE);
    mockField.$times(2);
  }
  mockCtrl.$replayAll();

  assertFalse('Dialog should not be open yet',
              !!plugin.getDialog() && plugin.getDialog().isOpen());

  plugin.execCommand(COMMAND);
  assertTrue('Dialog should be open now',
             !!plugin.getDialog() && plugin.getDialog().isOpen());

  var tempDialog = plugin.getDialog();
  plugin.execCommand(COMMAND);
  if (opt_reuse) {
    assertTrue('Reused dialog should still be open after second exec',
               tempDialog.isOpen());
    assertFalse('Reused dialog should not be disposed after second exec',
        tempDialog.isDisposed());
  } else {
    assertFalse('First dialog should not still be open after opening second',
                tempDialog.isOpen());
    assertTrue('First dialog should be disposed after opening second',
               tempDialog.isDisposed());
  }
  plugin.dispose();
  mockCtrl.$verifyAll();
}


***REMOVED***
***REMOVED*** Tests execCommand twice while reusing the dialog.
***REMOVED***
function testExecTwiceReuse() {
  // Test is failing with an out-of-memory error in IE7.
  if (goog.userAgent.IE && !goog.userAgent.isVersionOrHigher('8')) {
    return;
  }

  testExecTwice(true);
}


***REMOVED***
***REMOVED*** Tests that the selection is cleared when the dialog opens and is
***REMOVED*** correctly restored after it closes.
***REMOVED***
function testRestoreSelection() {
  setUpRealEditableField();

  fieldObj.setHtml(false, '12345');
  var elem = fieldObj.getElement();
  var helper = new goog.testing.editor.TestHelper(elem);
  helper.select('12345', 1, '12345', 4); // Selects '234'.

  assertEquals('Incorrect text selected before dialog is opened',
               '234',
               fieldObj.getRange().getText());
  plugin.execCommand(COMMAND);
  if (!goog.userAgent.IE && !goog.userAgent.OPERA) {
    // IE returns some bogus range when field doesn't have selection.
    // Opera can't remove the selection from a whitebox field.
    assertNull('There should be no selection while dialog is open',
               fieldObj.getRange());
  }
  plugin.getDialog().hide();
  assertEquals('Incorrect text selected after dialog is closed',
               '234',
               fieldObj.getRange().getText());
}


***REMOVED***
***REMOVED*** Setup a real editable field (instead of a mock) and register the plugin to
***REMOVED*** it.
***REMOVED***
function setUpRealEditableField() {
  fieldElem = document.createElement('div');
  fieldElem.id = 'myField';
  document.body.appendChild(fieldElem);
  fieldObj = new goog.editor.Field('myField', document);
  fieldObj.makeEditable();
  // Register the plugin to that field.
  plugin.getTrogClassId = goog.functions.constant('myClassId');
  fieldObj.registerPlugin(plugin);
}


***REMOVED***
***REMOVED*** Tear down the real editable field.
***REMOVED***
function tearDownRealEditableField() {
  if (fieldObj) {
    fieldObj.makeUneditable();
    fieldObj.dispose();
    fieldObj = null;
  }
  if (fieldElem && fieldElem.parentNode == document.body) {
    document.body.removeChild(fieldElem);
  }
}


***REMOVED***
***REMOVED*** Tests that after the dialog is hidden via a keystroke, the editable field
***REMOVED*** doesn't fire an extra SELECTIONCHANGE event due to the keyup from that
***REMOVED*** keystroke.
***REMOVED*** There is also a robot test in dialog_robot.html to test debouncing the
***REMOVED*** SELECTIONCHANGE event when the dialog closes.
***REMOVED***
function testDebounceSelectionChange() {
  mockClock = new goog.testing.MockClock(true);
  // Initial time is 0 which evaluates to false in debouncing implementation.
  mockClock.tick(1);

  setUpRealEditableField();

  // Set up a mock event handler to make sure selection change isn't fired
  // more than once on close and a second time on close.
  var count = 0;
  fieldObj.addEventListener(goog.editor.Field.EventType.SELECTIONCHANGE,
                            function(e) {
                              count++;
                            });

  assertEquals(0, count);
  plugin.execCommand(COMMAND);
  assertEquals(1, count);
  plugin.getDialog().hide();
  assertEquals(2, count);

  // Fake the keyup event firing on the field after the dialog closes.
  var e = new goog.events.Event('keyup', plugin.fieldObject.getElement());
  e.keyCode = 13;
  goog.testing.events.fireBrowserEvent(e);

  // Tick the mock clock so that selection change tries to fire.
  mockClock.tick(goog.editor.Field.SELECTION_CHANGE_FREQUENCY_ + 1);

  // Ensure the handler did not fire again.
  assertEquals(2, count);
}
