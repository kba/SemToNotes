// Copyright 2009 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Utilties to handle focusing related to rich text editing.
***REMOVED***
***REMOVED***

goog.provide('goog.editor.focus');

goog.require('goog.dom.selection');


***REMOVED***
***REMOVED*** Change focus to the given input field and set cursor to end of current text.
***REMOVED*** @param {Element} inputElem Input DOM element.
***REMOVED***
goog.editor.focus.focusInputField = function(inputElem) {
  inputElem.focus();
  goog.dom.selection.setCursorPosition(inputElem, inputElem.value.length);
***REMOVED***
