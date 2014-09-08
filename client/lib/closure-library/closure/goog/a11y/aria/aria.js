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
***REMOVED*** @fileoverview Utilities for adding, removing and setting ARIA roles and
***REMOVED*** states as defined by W3C ARIA standard: http://www.w3.org/TR/wai-aria/
***REMOVED*** All modern browsers have some form of ARIA support, so no browser checks are
***REMOVED*** performed when adding ARIA to components.
***REMOVED***
***REMOVED***

goog.provide('goog.a11y.aria');

goog.require('goog.a11y.aria.Role');
goog.require('goog.a11y.aria.State');
goog.require('goog.a11y.aria.datatables');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.object');


***REMOVED***
***REMOVED*** ARIA states/properties prefix.
***REMOVED*** @private
***REMOVED***
goog.a11y.aria.ARIA_PREFIX_ = 'aria-';


***REMOVED***
***REMOVED*** ARIA role attribute.
***REMOVED*** @private
***REMOVED***
goog.a11y.aria.ROLE_ATTRIBUTE_ = 'role';


***REMOVED***
***REMOVED*** A list of tag names for which we don't need to set ARIA role and states
***REMOVED*** because they have well supported semantics for screen readers or because
***REMOVED*** they don't contain content to be made accessible.
***REMOVED*** @private
***REMOVED***
goog.a11y.aria.TAGS_WITH_ASSUMED_ROLES_ = [
  goog.dom.TagName.A,
  goog.dom.TagName.AREA,
  goog.dom.TagName.BUTTON,
  goog.dom.TagName.HEAD,
  goog.dom.TagName.INPUT,
  goog.dom.TagName.LINK,
  goog.dom.TagName.MENU,
  goog.dom.TagName.META,
  goog.dom.TagName.OPTGROUP,
  goog.dom.TagName.OPTION,
  goog.dom.TagName.PROGRESS,
  goog.dom.TagName.STYLE,
  goog.dom.TagName.SELECT,
  goog.dom.TagName.SOURCE,
  goog.dom.TagName.TEXTAREA,
  goog.dom.TagName.TITLE,
  goog.dom.TagName.TRACK
];


***REMOVED***
***REMOVED*** Sets the role of an element. If the roleName is
***REMOVED*** empty string or null, the role for the element is removed.
***REMOVED*** We encourage clients to call the goog.a11y.aria.removeRole
***REMOVED*** method instead of setting null and empty string values.
***REMOVED*** Special handling for this case is added to ensure
***REMOVED*** backword compatibility with existing code.
***REMOVED***
***REMOVED*** @param {!Element} element DOM node to set role of.
***REMOVED*** @param {!goog.a11y.aria.Role|string} roleName role name(s).
***REMOVED***
goog.a11y.aria.setRole = function(element, roleName) {
  if (!roleName) {
    // Setting the ARIA role to empty string is not allowed
    // by the ARIA standard.
    goog.a11y.aria.removeRole(element);
  } else {
    if (goog.asserts.ENABLE_ASSERTS) {
      goog.asserts.assert(goog.object.containsValue(
          goog.a11y.aria.Role, roleName), 'No such ARIA role ' + roleName);
    }
    element.setAttribute(goog.a11y.aria.ROLE_ATTRIBUTE_, roleName);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets role of an element.
***REMOVED*** @param {!Element} element DOM element to get role of.
***REMOVED*** @return {!goog.a11y.aria.Role} ARIA Role name.
***REMOVED***
goog.a11y.aria.getRole = function(element) {
  var role = element.getAttribute(goog.a11y.aria.ROLE_ATTRIBUTE_);
  return***REMOVED*****REMOVED*** @type {goog.a11y.aria.Role}***REMOVED*** (role) || null;
***REMOVED***


***REMOVED***
***REMOVED*** Removes role of an element.
***REMOVED*** @param {!Element} element DOM element to remove the role from.
***REMOVED***
goog.a11y.aria.removeRole = function(element) {
  element.removeAttribute(goog.a11y.aria.ROLE_ATTRIBUTE_);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the state or property of an element.
***REMOVED*** @param {!Element} element DOM node where we set state.
***REMOVED*** @param {!(goog.a11y.aria.State|string)} stateName State attribute being set.
***REMOVED***     Automatically adds prefix 'aria-' to the state name if the attribute is
***REMOVED***     not an extra attribute.
***REMOVED*** @param {string|boolean|number|!goog.array.ArrayLike.<string>} value Value
***REMOVED*** for the state attribute.
***REMOVED***
goog.a11y.aria.setState = function(element, stateName, value) {
  if (goog.isArrayLike(value)) {
    var array =***REMOVED*****REMOVED*** @type {!goog.array.ArrayLike.<string>}***REMOVED*** (value);
    value = array.join(' ');
  }
  var attrStateName = goog.a11y.aria.getAriaAttributeName_(stateName);
  if (value === '' || value == undefined) {
    var defaultValueMap = goog.a11y.aria.datatables.getDefaultValuesMap();
    // Work around for browsers that don't properly support ARIA.
    // According to the ARIA W3C standard, user agents should allow
    // setting empty value which results in setting the default value
    // for the ARIA state if such exists. The exact text from the ARIA W3C
    // standard (http://www.w3.org/TR/wai-aria/states_and_properties):
    // "When a value is indicated as the default, the user agent
    // MUST follow the behavior prescribed by this value when the state or
    // property is empty or undefined."
    // The defaultValueMap contains the default values for the ARIA states
    // and has as a key the goog.a11y.aria.State constant for the state.
    if (stateName in defaultValueMap) {
      element.setAttribute(attrStateName, defaultValueMap[stateName]);
    } else {
      element.removeAttribute(attrStateName);
    }
  } else {
    element.setAttribute(attrStateName, value);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Remove the state or property for the element.
***REMOVED*** @param {!Element} element DOM node where we set state.
***REMOVED*** @param {!goog.a11y.aria.State} stateName State name.
***REMOVED***
goog.a11y.aria.removeState = function(element, stateName) {
  element.removeAttribute(goog.a11y.aria.getAriaAttributeName_(stateName));
***REMOVED***


***REMOVED***
***REMOVED*** Gets value of specified state or property.
***REMOVED*** @param {!Element} element DOM node to get state from.
***REMOVED*** @param {!goog.a11y.aria.State|string} stateName State name.
***REMOVED*** @return {string} Value of the state attribute.
***REMOVED***
goog.a11y.aria.getState = function(element, stateName) {
  // TODO(user): return properly typed value result --
  // boolean, number, string, null. We should be able to chain
  // getState(...) and setState(...) methods.

  var attr =
     ***REMOVED*****REMOVED*** @type {string|number|boolean}***REMOVED*** (element.getAttribute(
      goog.a11y.aria.getAriaAttributeName_(stateName)));
  var isNullOrUndefined = attr == null || attr == undefined;
  return isNullOrUndefined ? '' : String(attr);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the activedescendant element for the input element by
***REMOVED*** using the activedescendant ARIA property of the given element.
***REMOVED*** @param {!Element} element DOM node to get activedescendant
***REMOVED***     element for.
***REMOVED*** @return {?Element} DOM node of the activedescendant, if found.
***REMOVED***
goog.a11y.aria.getActiveDescendant = function(element) {
  var id = goog.a11y.aria.getState(
      element, goog.a11y.aria.State.ACTIVEDESCENDANT);
  return goog.dom.getOwnerDocument(element).getElementById(id);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the activedescendant ARIA property value for an element.
***REMOVED*** If the activeElement is not null, it should have an id set.
***REMOVED*** @param {!Element} element DOM node to set activedescendant ARIA property to.
***REMOVED*** @param {?Element} activeElement DOM node being set as activedescendant.
***REMOVED***
goog.a11y.aria.setActiveDescendant = function(element, activeElement) {
  var id = '';
  if (activeElement) {
    id = activeElement.id;
    goog.asserts.assert(id, 'The active element should have an id.');
  }

  goog.a11y.aria.setState(element, goog.a11y.aria.State.ACTIVEDESCENDANT, id);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the label of the given element.
***REMOVED*** @param {!Element} element DOM node to get label from.
***REMOVED*** @return {string} label The label.
***REMOVED***
goog.a11y.aria.getLabel = function(element) {
  return goog.a11y.aria.getState(element, goog.a11y.aria.State.LABEL);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the label of the given element.
***REMOVED*** @param {!Element} element DOM node to set label to.
***REMOVED*** @param {string} label The label to set.
***REMOVED***
goog.a11y.aria.setLabel = function(element, label) {
  goog.a11y.aria.setState(element, goog.a11y.aria.State.LABEL, label);
***REMOVED***


***REMOVED***
***REMOVED*** Asserts that the element has a role set if it's not an HTML element whose
***REMOVED*** semantics is well supported by most screen readers.
***REMOVED*** Only to be used internally by the ARIA library in goog.a11y.aria.*.
***REMOVED*** @param {!Element} element The element to assert an ARIA role set.
***REMOVED*** @param {!goog.array.ArrayLike.<string>} allowedRoles The child roles of
***REMOVED*** the roles.
***REMOVED***
goog.a11y.aria.assertRoleIsSetInternalUtil = function(element, allowedRoles) {
  if (goog.array.contains(goog.a11y.aria.TAGS_WITH_ASSUMED_ROLES_,
      element.tagName)) {
    return;
  }
  var elementRole =***REMOVED*****REMOVED*** @type {string}*/ (goog.a11y.aria.getRole(element));
  goog.asserts.assert(elementRole != null,
      'The element ARIA role cannot be null.');

  goog.asserts.assert(goog.array.contains(allowedRoles, elementRole),
      'Non existing or incorrect role set for element.' +
      'The role set is "' + elementRole +
      '". The role should be any of "' + allowedRoles +
      '". Check the ARIA specification for more details ' +
      'http://www.w3.org/TR/wai-aria/roles.');
***REMOVED***


***REMOVED***
***REMOVED*** Gets the boolean value of an ARIA state/property.
***REMOVED*** @param {!Element} element The element to get the ARIA state for.
***REMOVED*** @param {!goog.a11y.aria.State|string} stateName the ARIA state name.
***REMOVED*** @return {?boolean} Boolean value for the ARIA state value or null if
***REMOVED***     the state value is not 'true', not 'false', or not set.
***REMOVED***
goog.a11y.aria.getStateBoolean = function(element, stateName) {
  var attr =
     ***REMOVED*****REMOVED*** @type {string|boolean}***REMOVED*** (element.getAttribute(
          goog.a11y.aria.getAriaAttributeName_(stateName)));
  goog.asserts.assert(
      goog.isBoolean(attr) || attr == null || attr == 'true' ||
          attr == 'false');
  if (attr == null) {
    return attr;
  }
  return goog.isBoolean(attr) ? attr : attr == 'true';
***REMOVED***


***REMOVED***
***REMOVED*** Gets the number value of an ARIA state/property.
***REMOVED*** @param {!Element} element The element to get the ARIA state for.
***REMOVED*** @param {!goog.a11y.aria.State|string} stateName the ARIA state name.
***REMOVED*** @return {?number} Number value for the ARIA state value or null if
***REMOVED***     the state value is not a number or not set.
***REMOVED***
goog.a11y.aria.getStateNumber = function(element, stateName) {
  var attr =
     ***REMOVED*****REMOVED*** @type {string|number}***REMOVED*** (element.getAttribute(
          goog.a11y.aria.getAriaAttributeName_(stateName)));
  goog.asserts.assert((attr == null || !isNaN(Number(attr))) &&
      !goog.isBoolean(attr));
  return attr == null ? null : Number(attr);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the string value of an ARIA state/property.
***REMOVED*** @param {!Element} element The element to get the ARIA state for.
***REMOVED*** @param {!goog.a11y.aria.State|string} stateName the ARIA state name.
***REMOVED*** @return {?string} String value for the ARIA state value or null if
***REMOVED***     the state value is empty string or not set.
***REMOVED***
goog.a11y.aria.getStateString = function(element, stateName) {
  var attr = element.getAttribute(
      goog.a11y.aria.getAriaAttributeName_(stateName));
  goog.asserts.assert((attr == null || goog.isString(attr)) &&
      isNaN(Number(attr)) && attr != 'true' && attr != 'false');
  return attr == null ? null : attr;
***REMOVED***


***REMOVED***
***REMOVED*** Gets array of strings value of the specified state or
***REMOVED*** property for the element.
***REMOVED*** Only to be used internally by the ARIA library in goog.a11y.aria.*.
***REMOVED*** @param {!Element} element DOM node to get state from.
***REMOVED*** @param {!goog.a11y.aria.State} stateName State name.
***REMOVED*** @return {!goog.array.ArrayLike.<string>} string Array
***REMOVED***     value of the state attribute.
***REMOVED***
goog.a11y.aria.getStringArrayStateInternalUtil = function(element, stateName) {
  var attrValue = element.getAttribute(
      goog.a11y.aria.getAriaAttributeName_(stateName));
  return goog.a11y.aria.splitStringOnWhitespace_(attrValue);
***REMOVED***


***REMOVED***
***REMOVED*** Splits the input stringValue on whitespace.
***REMOVED*** @param {string} stringValue The value of the string to split.
***REMOVED*** @return {!goog.array.ArrayLike.<string>} string Array
***REMOVED***     value as result of the split.
***REMOVED*** @private
***REMOVED***
goog.a11y.aria.splitStringOnWhitespace_ = function(stringValue) {
  return stringValue ? stringValue.split(/\s+/) : [];
***REMOVED***


***REMOVED***
***REMOVED*** Adds the 'aria-' prefix to ariaName.
***REMOVED*** @param {string} ariaName ARIA state/property name.
***REMOVED*** @private
***REMOVED*** @return {string} The ARIA attribute name with added 'aria-' prefix.
***REMOVED*** @throws {Error} If no such attribute exists.
***REMOVED***
goog.a11y.aria.getAriaAttributeName_ = function(ariaName) {
  if (goog.asserts.ENABLE_ASSERTS) {
    goog.asserts.assert(ariaName, 'ARIA attribute cannot be empty.');
    goog.asserts.assert(goog.object.containsValue(
        goog.a11y.aria.State, ariaName),
        'No such ARIA attribute ' + ariaName);
  }
  return goog.a11y.aria.ARIA_PREFIX_ + ariaName;
***REMOVED***
