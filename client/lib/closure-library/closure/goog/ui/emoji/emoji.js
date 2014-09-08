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
***REMOVED*** @fileoverview Emoji implementation.
***REMOVED***
***REMOVED***

goog.provide('goog.ui.emoji.Emoji');



***REMOVED***
***REMOVED*** Creates an emoji.
***REMOVED***
***REMOVED*** A simple wrapper for an emoji.
***REMOVED***
***REMOVED*** @param {string} url URL pointing to the source image for the emoji.
***REMOVED*** @param {string} id The id of the emoji, e.g., 'std.1'.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.ui.emoji.Emoji = function(url, id) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The URL pointing to the source image for the emoji
  ***REMOVED***
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.url_ = url;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The id of the emoji
  ***REMOVED***
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.id_ = id;
***REMOVED***


***REMOVED***
***REMOVED*** The name of the goomoji attribute, used for emoji image elements.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.emoji.Emoji.ATTRIBUTE = 'goomoji';


***REMOVED***
***REMOVED*** @return {string} The URL for this emoji.
***REMOVED***
goog.ui.emoji.Emoji.prototype.getUrl = function() {
  return this.url_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The id of this emoji.
***REMOVED***
goog.ui.emoji.Emoji.prototype.getId = function() {
  return this.id_;
***REMOVED***
