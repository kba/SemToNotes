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

goog.provide('goog.net.xpc.CrossPageChannelTest');
goog.setTestOnly('goog.net.xpc.CrossPageChannelTest');

goog.require('goog.Disposable');
***REMOVED***
goog.require('goog.async.Deferred');
goog.require('goog.dom');
goog.require('goog.log');
goog.require('goog.log.Level');
goog.require('goog.net.xpc');
goog.require('goog.net.xpc.CfgFields');
goog.require('goog.net.xpc.CrossPageChannel');
goog.require('goog.net.xpc.CrossPageChannelRole');
goog.require('goog.net.xpc.TransportTypes');
goog.require('goog.object');
goog.require('goog.testing.AsyncTestCase');
goog.require('goog.testing.PropertyReplacer');
goog.require('goog.testing.jsunit');

// Set this to false when working on this test.  It needs to be true for
// automated testing, as some browsers (eg IE8) choke on the large numbers of
// iframes this test would otherwise leave active.
var CLEAN_UP_IFRAMES = true;

var IFRAME_LOAD_WAIT_MS = 1000;
var stubs = new goog.testing.PropertyReplacer();
var asyncTestCase = goog.testing.AsyncTestCase.createAndInstall(
    document.title);
var uniqueId = 0;
var driver;
var canAccessSameDomainIframe = true;
var accessCheckIframes = [];

function setUpPage() {
  // This test is insanely slow on IE8 for some reason.
  asyncTestCase.stepTimeout = 20***REMOVED*** 1000;

  // Show debug log
  var debugDiv = goog.dom.getElement('debugDiv');
  var logger = goog.log.getLogger('goog.net.xpc');
  logger.setLevel(goog.log.Level.ALL);
  goog.log.addHandler(logger, function(logRecord) {
    var msgElm = goog.dom.createDom('div');
    msgElm.innerHTML = logRecord.getMessage();
    goog.dom.appendChild(debugDiv, msgElm);
  });
  asyncTestCase.waitForAsync('Checking if we can access same domain iframes');
  checkSameDomainIframeAccess();
}


function setUp() {
  driver = new Driver();
}


function tearDown() {
  stubs.reset();
  driver.dispose();
}


function checkSameDomainIframeAccess() {
  accessCheckIframes.push(
      create1x1Iframe('nonexistant', 'testdata/i_am_non_existant.html'));
  window.setTimeout(function() {
    accessCheckIframes.push(
        create1x1Iframe('existant', 'testdata/access_checker.html'));
  }, 10);
}


function create1x1Iframe(iframeId, src) {
  var iframeAccessChecker = goog.dom.createElement('IFRAME');
  iframeAccessChecker.id = iframeAccessChecker.name = iframeId;
  iframeAccessChecker.style.width = iframeAccessChecker.style.height = '1px';
  iframeAccessChecker.src = src;
  document.body.insertBefore(iframeAccessChecker, document.body.firstChild);
  return iframeAccessChecker;
}


function sameDomainIframeAccessComplete(canAccess) {
  canAccessSameDomainIframe = canAccess;
  for (var i = 0; i < accessCheckIframes.length; i++) {
    document.body.removeChild(accessCheckIframes[i]);
  }
  asyncTestCase.continueTesting();
}


function testCreateIframeSpecifyId() {
  driver.createPeerIframe('new_iframe');

  asyncTestCase.waitForAsync('iframe load');
  window.setTimeout(function() {
    driver.checkPeerIframe();
    asyncTestCase.continueTesting();
  }, IFRAME_LOAD_WAIT_MS);
}


function testCreateIframeRandomId() {
  driver.createPeerIframe();

  asyncTestCase.waitForAsync('iframe load');
  window.setTimeout(function() {
    driver.checkPeerIframe();
    asyncTestCase.continueTesting();
  }, IFRAME_LOAD_WAIT_MS);
}


function testGetRole() {
  var cfg = {***REMOVED***
  cfg[goog.net.xpc.CfgFields.ROLE] = goog.net.xpc.CrossPageChannelRole.OUTER;
  var channel = new goog.net.xpc.CrossPageChannel(cfg);
  // If the configured role is ignored, this will cause the dynamicly
  // determined role to become INNER.
  channel.peerWindowObject_ = window.parent;
  assertEquals('Channel should use role from the config.',
      goog.net.xpc.CrossPageChannelRole.OUTER, channel.getRole());
  channel.dispose();
}


// The following batch of tests:
***REMOVED****REMOVED****REMOVED*** Establishes a peer iframe
***REMOVED****REMOVED****REMOVED*** Connects an XPC channel between the frames
***REMOVED****REMOVED****REMOVED*** From the connection callback in each frame, sends an 'echo' request, and
//   expects a 'response' response.
***REMOVED****REMOVED****REMOVED*** Reconnects the inner frame, sends an 'echo', expects a 'response'.
***REMOVED****REMOVED****REMOVED*** Optionally, reconnects the outer frame, sends an 'echo', expects a
//   'response'.
***REMOVED****REMOVED****REMOVED*** Optionally, reconnects the inner frame, but first reconfigures it to the
//   alternate protocol version, simulating an inner frame navigation that
//   picks up a new/old version.
//
// Every valid combination of protocol versions is tested, with both single and
// double ended handshakes.  Two timing scenarios are tested per combination,
// which is what the 'reverse' parameter distinguishes.
//
// Where single sided handshake is in use, reconnection by the outer frame is
// not supported, and therefore is not tested.
//
// The only known issue migrating to V2 is that once two V2 peers have
// connected, replacing either peer with a V1 peer will not work.  Upgrading V1
// peers to v2 is supported, as is replacing the only v2 peer in a connection
// with a v1.


function testLifeCycle_v1_v1() {
  checkLifeCycle(
      false /* oneSidedHandshake***REMOVED***,
      1 /* innerProtocolVersion***REMOVED***,
      1 /* outerProtocolVersion***REMOVED***,
      true /* outerFrameReconnectSupported***REMOVED***,
      true /* innerFrameMigrationSupported***REMOVED***,
      false /* reverse***REMOVED***);
}


function testLifeCycle_v1_v1_rev() {
  checkLifeCycle(
      false /* oneSidedHandshake***REMOVED***,
      1 /* innerProtocolVersion***REMOVED***,
      1 /* outerProtocolVersion***REMOVED***,
      true /* outerFrameReconnectSupported***REMOVED***,
      true /* innerFrameMigrationSupported***REMOVED***,
      true /* reverse***REMOVED***);
}


function testLifeCycle_v1_v1_onesided() {
  checkLifeCycle(
      true /* oneSidedHandshake***REMOVED***,
      1 /* innerProtocolVersion***REMOVED***,
      1 /* outerProtocolVersion***REMOVED***,
      false /* outerFrameReconnectSupported***REMOVED***,
      true /* innerFrameMigrationSupported***REMOVED***,
      false /* reverse***REMOVED***);
}


function testLifeCycle_v1_v1_onesided_rev() {
  checkLifeCycle(
      true /* oneSidedHandshake***REMOVED***,
      1 /* innerProtocolVersion***REMOVED***,
      1 /* outerProtocolVersion***REMOVED***,
      false /* outerFrameReconnectSupported***REMOVED***,
      true /* innerFrameMigrationSupported***REMOVED***,
      true /* reverse***REMOVED***);
}


function testLifeCycle_v1_v2() {
  checkLifeCycle(
      false /* oneSidedHandshake***REMOVED***,
      1 /* innerProtocolVersion***REMOVED***,
      2 /* outerProtocolVersion***REMOVED***,
      true /* outerFrameReconnectSupported***REMOVED***,
      true /* innerFrameMigrationSupported***REMOVED***,
      false /* reverse***REMOVED***);
}


function testLifeCycle_v1_v2_rev() {
  checkLifeCycle(
      false /* oneSidedHandshake***REMOVED***,
      1 /* innerProtocolVersion***REMOVED***,
      2 /* outerProtocolVersion***REMOVED***,
      true /* outerFrameReconnectSupported***REMOVED***,
      true /* innerFrameMigrationSupported***REMOVED***,
      true /* reverse***REMOVED***);
}


function testLifeCycle_v1_v2_onesided() {
  checkLifeCycle(
      true /* oneSidedHandshake***REMOVED***,
      1 /* innerProtocolVersion***REMOVED***,
      2 /* outerProtocolVersion***REMOVED***,
      false /* outerFrameReconnectSupported***REMOVED***,
      true /* innerFrameMigrationSupported***REMOVED***,
      false /* reverse***REMOVED***);
}


function testLifeCycle_v1_v2_onesided_rev() {
  checkLifeCycle(
      true /* oneSidedHandshake***REMOVED***,
      1 /* innerProtocolVersion***REMOVED***,
      2 /* outerProtocolVersion***REMOVED***,
      false /* outerFrameReconnectSupported***REMOVED***,
      true /* innerFrameMigrationSupported***REMOVED***,
      true /* reverse***REMOVED***);
}


function testLifeCycle_v2_v1() {
  checkLifeCycle(
      false /* oneSidedHandshake***REMOVED***,
      2 /* innerProtocolVersion***REMOVED***,
      1 /* outerProtocolVersion***REMOVED***,
      true /* outerFrameReconnectSupported***REMOVED***,
      true /* innerFrameMigrationSupported***REMOVED***,
      false /* reverse***REMOVED***);
}


function testLifeCycle_v2_v1_rev() {
  checkLifeCycle(
      false /* oneSidedHandshake***REMOVED***,
      2 /* innerProtocolVersion***REMOVED***,
      1 /* outerProtocolVersion***REMOVED***,
      true /* outerFrameReconnectSupported***REMOVED***,
      true /* innerFrameMigrationSupported***REMOVED***,
      true /* reverse***REMOVED***);
}


function testLifeCycle_v2_v1_onesided() {
  checkLifeCycle(
      true /* oneSidedHandshake***REMOVED***,
      2 /* innerProtocolVersion***REMOVED***,
      1 /* outerProtocolVersion***REMOVED***,
      false /* outerFrameReconnectSupported***REMOVED***,
      true /* innerFrameMigrationSupported***REMOVED***,
      false /* reverse***REMOVED***);
}


function testLifeCycle_v2_v1_onesided_rev() {
  checkLifeCycle(
      true /* oneSidedHandshake***REMOVED***,
      2 /* innerProtocolVersion***REMOVED***,
      1 /* outerProtocolVersion***REMOVED***,
      false /* outerFrameReconnectSupported***REMOVED***,
      true /* innerFrameMigrationSupported***REMOVED***,
      true /* reverse***REMOVED***);
}


function testLifeCycle_v2_v2() {
  checkLifeCycle(
      false /* oneSidedHandshake***REMOVED***,
      2 /* innerProtocolVersion***REMOVED***,
      2 /* outerProtocolVersion***REMOVED***,
      true /* outerFrameReconnectSupported***REMOVED***,
      false /* innerFrameMigrationSupported***REMOVED***,
      false /* reverse***REMOVED***);
}


function testLifeCycle_v2_v2_rev() {
  checkLifeCycle(
      false /* oneSidedHandshake***REMOVED***,
      2 /* innerProtocolVersion***REMOVED***,
      2 /* outerProtocolVersion***REMOVED***,
      true /* outerFrameReconnectSupported***REMOVED***,
      false /* innerFrameMigrationSupported***REMOVED***,
      true /* reverse***REMOVED***);
}


function testLifeCycle_v2_v2_onesided() {
  checkLifeCycle(
      true /* oneSidedHandshake***REMOVED***,
      2 /* innerProtocolVersion***REMOVED***,
      2 /* outerProtocolVersion***REMOVED***,
      false /* outerFrameReconnectSupported***REMOVED***,
      false /* innerFrameMigrationSupported***REMOVED***,
      false /* reverse***REMOVED***);
}


function testLifeCycle_v2_v2_onesided_rev() {
  checkLifeCycle(
      true /* oneSidedHandshake***REMOVED***,
      2 /* innerProtocolVersion***REMOVED***,
      2 /* outerProtocolVersion***REMOVED***,
      false /* outerFrameReconnectSupported***REMOVED***,
      false /* innerFrameMigrationSupported***REMOVED***,
      true /* reverse***REMOVED***);
}


function checkLifeCycle(oneSidedHandshake, innerProtocolVersion,
    outerProtocolVersion, outerFrameReconnectSupported,
    innerFrameMigrationSupported, reverse) {
  driver.createPeerIframe('new_iframe', oneSidedHandshake,
      innerProtocolVersion, outerProtocolVersion);
  driver.connect(true /* fullLifeCycleTest***REMOVED***, outerFrameReconnectSupported,
      innerFrameMigrationSupported, reverse);
}


function testConnectMismatchedNames_v1_v1() {
  checkConnectMismatchedNames(
      1 /* innerProtocolVersion***REMOVED***,
      1 /* outerProtocolVersion***REMOVED***,
      false /* reverse***REMOVED***);
}


function testConnectMismatchedNames_v1_v1_rev() {
  checkConnectMismatchedNames(
      1 /* innerProtocolVersion***REMOVED***,
      1 /* outerProtocolVersion***REMOVED***,
      true /* reverse***REMOVED***);
}


function testConnectMismatchedNames_v1_v2() {
  checkConnectMismatchedNames(
      1 /* innerProtocolVersion***REMOVED***,
      2 /* outerProtocolVersion***REMOVED***,
      false /* reverse***REMOVED***);
}


function testConnectMismatchedNames_v1_v2_rev() {
  checkConnectMismatchedNames(
      1 /* innerProtocolVersion***REMOVED***,
      2 /* outerProtocolVersion***REMOVED***,
      true /* reverse***REMOVED***);
}


function testConnectMismatchedNames_v2_v1() {
  checkConnectMismatchedNames(
      2 /* innerProtocolVersion***REMOVED***,
      1 /* outerProtocolVersion***REMOVED***,
      false /* reverse***REMOVED***);
}


function testConnectMismatchedNames_v2_v1_rev() {
  checkConnectMismatchedNames(
      2 /* innerProtocolVersion***REMOVED***,
      1 /* outerProtocolVersion***REMOVED***,
      true /* reverse***REMOVED***);
}


function testConnectMismatchedNames_v2_v2() {
  checkConnectMismatchedNames(
      2 /* innerProtocolVersion***REMOVED***,
      2 /* outerProtocolVersion***REMOVED***,
      false /* reverse***REMOVED***);
}


function testConnectMismatchedNames_v2_v2_rev() {
  checkConnectMismatchedNames(
      2 /* innerProtocolVersion***REMOVED***,
      2 /* outerProtocolVersion***REMOVED***,
      true /* reverse***REMOVED***);
}


function checkConnectMismatchedNames(innerProtocolVersion,
    outerProtocolVersion, reverse) {
  driver.createPeerIframe('new_iframe', false /* oneSidedHandshake***REMOVED***,
      innerProtocolVersion,
      outerProtocolVersion, true /* opt_randomChannelNames***REMOVED***);
  driver.connect(false /* fullLifeCycleTest***REMOVED***,
      false /* outerFrameReconnectSupported***REMOVED***,
      false /* innerFrameMigrationSupported***REMOVED***,
      false /* reverse***REMOVED***);
}


function testEscapeServiceName() {
  var escape = goog.net.xpc.CrossPageChannel.prototype.escapeServiceName_;
  assertEquals('Shouldn\'t escape alphanumeric name',
               'fooBar123', escape('fooBar123'));
  assertEquals('Shouldn\'t escape most non-alphanumeric characters',
               '`~!@#$^&*()_-=+ []{}\'";,<.>/?\\',
               escape('`~!@#$^&*()_-=+ []{}\'";,<.>/?\\'));
  assertEquals('Should escape %, |, and :',
               'foo%3ABar%7C123%25', escape('foo:Bar|123%'));
  assertEquals('Should escape tp', '%25tp', escape('tp'));
  assertEquals('Should escape %tp', '%25%25tp', escape('%tp'));
  assertEquals('Should not escape stp', 'stp', escape('stp'));
  assertEquals('Should not escape s%tp', 's%25tp', escape('s%tp'));
}


function testSameDomainCheck_noMessageOrigin() {
  var channel = new goog.net.xpc.CrossPageChannel(goog.object.create(
      goog.net.xpc.CfgFields.PEER_HOSTNAME, 'http://foo.com'));
  assertTrue(channel.isMessageOriginAcceptable_(undefined));
}


function testSameDomainCheck_noPeerHostname() {
  var channel = new goog.net.xpc.CrossPageChannel({});
  assertTrue(channel.isMessageOriginAcceptable_('http://foo.com'));
}


function testSameDomainCheck_unconfigured() {
  var channel = new goog.net.xpc.CrossPageChannel({});
  assertTrue(channel.isMessageOriginAcceptable_(undefined));
}


function testSameDomainCheck_originsMatch() {
  var channel = new goog.net.xpc.CrossPageChannel(goog.object.create(
      goog.net.xpc.CfgFields.PEER_HOSTNAME, 'http://foo.com'));
  assertTrue(channel.isMessageOriginAcceptable_('http://foo.com'));
}


function testSameDomainCheck_originsMismatch() {
  var channel = new goog.net.xpc.CrossPageChannel(goog.object.create(
      goog.net.xpc.CfgFields.PEER_HOSTNAME, 'http://foo.com'));
  assertFalse(channel.isMessageOriginAcceptable_('http://nasty.com'));
}


function testUnescapeServiceName() {
  var unescape = goog.net.xpc.CrossPageChannel.prototype.unescapeServiceName_;
  assertEquals('Shouldn\'t modify alphanumeric name',
               'fooBar123', unescape('fooBar123'));
  assertEquals('Shouldn\'t modify most non-alphanumeric characters',
               '`~!@#$^&*()_-=+ []{}\'";,<.>/?\\',
               unescape('`~!@#$^&*()_-=+ []{}\'";,<.>/?\\'));
  assertEquals('Should unescape URL-escapes',
               'foo:Bar|123%', unescape('foo%3ABar%7C123%25'));
  assertEquals('Should unescape tp', 'tp', unescape('%25tp'));
  assertEquals('Should unescape %tp', '%tp', unescape('%25%25tp'));
  assertEquals('Should not escape stp', 'stp', unescape('stp'));
  assertEquals('Should not escape s%tp', 's%tp', unescape('s%25tp'));
}


***REMOVED***
***REMOVED*** Tests the case where the channel is disposed before it is fully connected.
***REMOVED***
function testDisposeBeforeConnect() {
  asyncTestCase.waitForAsync('Checking disposal before connection.');
  driver.createPeerIframe('new_iframe', false /* oneSidedHandshake***REMOVED***,
      2 /* innerProtocolVersion***REMOVED***, 2 /* outerProtocolVersion***REMOVED***,
      true /* opt_randomChannelNames***REMOVED***);
  driver.connectOuterAndDispose();
}



***REMOVED***
***REMOVED*** Driver for the tests for CrossPageChannel.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
Driver = function() {
  goog.Disposable.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The peer iframe.
  ***REMOVED*** @type {!Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.iframe_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The channel to use.
  ***REMOVED*** @type {goog.net.xpc.CrossPageChannel}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.channel_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Outer frame configuration object.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.outerFrameCfg_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The initial name of the outer channel.
  ***REMOVED*** @type {?string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.initialOuterChannelName_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Inner frame configuration object.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.innerFrameCfg_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The contents of the payload of the 'echo' request sent by the inner frame.
  ***REMOVED*** @type {?string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.innerFrameEchoPayload_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The contents of the payload of the 'echo' request sent by the outer frame.
  ***REMOVED*** @type {?string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.outerFrameEchoPayload_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** A deferred which fires when the inner frame receives its echo response.
  ***REMOVED*** @type {goog.async.Deferred}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.innerFrameResponseReceived_ = new goog.async.Deferred();

 ***REMOVED*****REMOVED***
  ***REMOVED*** A deferred which fires when the outer frame receives its echo response.
  ***REMOVED*** @type {goog.async.Deferred}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.outerFrameResponseReceived_ = new goog.async.Deferred();

***REMOVED***
goog.inherits(Driver, goog.Disposable);


***REMOVED*** @override***REMOVED***
Driver.prototype.disposeInternal = function() {
  // Required to make this test perform acceptably (and pass) on slow browsers,
  // esp IE8.
  if (CLEAN_UP_IFRAMES) {
    goog.dom.removeNode(this.iframe_);
    delete this.iframe_;
  }
  goog.dispose(this.channel_);
  this.innerFrameResponseReceived_.cancel();
  this.innerFrameResponseReceived_ = null;
  this.outerFrameResponseReceived_.cancel();
  this.outerFrameResponseReceived_ = null;
  goog.base(this, 'disposeInternal');
***REMOVED***


***REMOVED***
***REMOVED*** Returns the child peer's window object.
***REMOVED*** @return {Window} Child peer's window.
***REMOVED*** @private
***REMOVED***
Driver.prototype.getInnerPeer_ = function() {
  return this.iframe_.contentWindow;
***REMOVED***


***REMOVED***
***REMOVED*** Sets up the configuration objects for the inner and outer frames.
***REMOVED*** @param {string=} opt_iframeId If present, the ID of the iframe to use,
***REMOVED***     otherwise, tells the channel to generate an iframe ID.
***REMOVED*** @param {boolean=} opt_oneSidedHandshake Whether the one sided handshake
***REMOVED***     config option should be set.
***REMOVED*** @param {string=} opt_channelName The name of the channel to use, or null
***REMOVED***     to generate one.
***REMOVED*** @param {number=} opt_innerProtocolVersion The native transport protocol
***REMOVED***     version used in the inner iframe.
***REMOVED*** @param {number=} opt_outerProtocolVersion The native transport protocol
***REMOVED***     version used in the outer iframe.
***REMOVED*** @param {boolean=} opt_randomChannelNames Whether the different ends of the
***REMOVED***     channel should be allowed to pick differing, random names.
***REMOVED*** @return {string} The name of the created channel.
***REMOVED*** @private
***REMOVED***
Driver.prototype.setConfiguration_ = function(opt_iframeId,
    opt_oneSidedHandshake, opt_channelName, opt_innerProtocolVersion,
    opt_outerProtocolVersion, opt_randomChannelNames) {
  var cfg = {***REMOVED***
  if (opt_iframeId) {
    cfg[goog.net.xpc.CfgFields.IFRAME_ID] = opt_iframeId;
  }
  cfg[goog.net.xpc.CfgFields.PEER_URI] = 'testdata/inner_peer.html';
  if (!opt_randomChannelNames) {
    var channelName = opt_channelName || 'test_channel' + uniqueId++;
    cfg[goog.net.xpc.CfgFields.CHANNEL_NAME] = channelName;
  }
  cfg[goog.net.xpc.CfgFields.LOCAL_POLL_URI] = 'does-not-exist.html';
  cfg[goog.net.xpc.CfgFields.PEER_POLL_URI] = 'does-not-exist.html';
  cfg[goog.net.xpc.CfgFields.ONE_SIDED_HANDSHAKE] = !!opt_oneSidedHandshake;
  cfg[goog.net.xpc.CfgFields.NATIVE_TRANSPORT_PROTOCOL_VERSION] =
      opt_outerProtocolVersion;
  function resolveUri(fieldName) {
    cfg[fieldName] =
        goog.Uri.resolve(window.location.href, cfg[fieldName]).toString();
  }
  resolveUri(goog.net.xpc.CfgFields.PEER_URI);
  resolveUri(goog.net.xpc.CfgFields.LOCAL_POLL_URI);
  resolveUri(goog.net.xpc.CfgFields.PEER_POLL_URI);
  this.outerFrameCfg_ = cfg;
  this.innerFrameCfg_ = goog.object.clone(cfg);
  this.innerFrameCfg_[
      goog.net.xpc.CfgFields.NATIVE_TRANSPORT_PROTOCOL_VERSION] =
      opt_innerProtocolVersion;
***REMOVED***


***REMOVED***
***REMOVED*** Creates an outer frame channel object.
***REMOVED*** @private
***REMOVED***
Driver.prototype.createChannel_ = function() {
  if (this.channel_) {
    this.channel_.dispose();
  }
  this.channel_ = new goog.net.xpc.CrossPageChannel(this.outerFrameCfg_);
  this.channel_.registerService('echo',
      goog.bind(this.echoHandler_, this));
  this.channel_.registerService('response',
      goog.bind(this.responseHandler_, this));

  return this.channel_.name;
***REMOVED***


***REMOVED***
***REMOVED*** Checks the names of the inner and outer frames meet expectations.
***REMOVED*** @private
***REMOVED***
Driver.prototype.checkChannelNames_ = function() {
  var outerName = this.channel_.name;
  var innerName = this.getInnerPeer_().channel.name;
  var configName = this.innerFrameCfg_[goog.net.xpc.CfgFields.CHANNEL_NAME] ||
      null;

  // The outer channel never changes its name.
  assertEquals(this.initialOuterChannelName_, outerName);
  // The name should be as configured, if it was configured.
  if (configName) {
    assertEquals(configName, innerName);
  }
  // The names of both ends of the channel should match.
  assertEquals(innerName, outerName);
  G_testRunner.log('Channel name: ' + innerName);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the configuration of the xpc.
***REMOVED*** @return {?Object} The configuration of the xpc.
***REMOVED***
Driver.prototype.getInnerFrameConfiguration = function() {
  return this.innerFrameCfg_;
***REMOVED***


***REMOVED***
***REMOVED*** Creates the peer iframe.
***REMOVED*** @param {string=} opt_iframeId If present, the ID of the iframe to create,
***REMOVED***     otherwise, generates an iframe ID.
***REMOVED*** @param {boolean=} opt_oneSidedHandshake Whether a one sided handshake is
***REMOVED***     specified.
***REMOVED*** @param {number=} opt_innerProtocolVersion The native transport protocol
***REMOVED***     version used in the inner iframe.
***REMOVED*** @param {number=} opt_outerProtocolVersion The native transport protocol
***REMOVED***     version used in the outer iframe.
***REMOVED*** @param {boolean=} opt_randomChannelNames Whether the ends of the channel
***REMOVED***     should be allowed to pick differing, random names.
***REMOVED*** @return {!Array.<string>} The id of the created iframe and the name of the
***REMOVED***     created channel.
***REMOVED***
Driver.prototype.createPeerIframe = function(opt_iframeId,
    opt_oneSidedHandshake, opt_innerProtocolVersion, opt_outerProtocolVersion,
    opt_randomChannelNames) {
  var expectedIframeId;

  if (opt_iframeId) {
    expectedIframeId = opt_iframeId = opt_iframeId + uniqueId++;
  } else {
    // Have createPeerIframe() generate an ID
    stubs.set(goog.net.xpc, 'getRandomString', function(length) {
      return '' + length;
    });
    expectedIframeId = 'xpcpeer4';
  }
  assertNull('element[id=' + expectedIframeId + '] exists',
      goog.dom.getElement(expectedIframeId));

  this.setConfiguration_(opt_iframeId, opt_oneSidedHandshake,
      undefined /* opt_channelName***REMOVED***, opt_innerProtocolVersion,
      opt_outerProtocolVersion, opt_randomChannelNames);
  var channelName = this.createChannel_();
  this.initialOuterChannelName_ = channelName;
  this.iframe_ = this.channel_.createPeerIframe(document.body);

  assertEquals(expectedIframeId, this.iframe_.id);
***REMOVED***


***REMOVED***
***REMOVED*** Checks if the peer iframe has been created.
***REMOVED***
Driver.prototype.checkPeerIframe = function() {
  assertNotNull(this.iframe_);
  var peer = this.getInnerPeer_();
  assertNotNull(peer);
  assertNotNull(peer.document);
***REMOVED***


***REMOVED***
***REMOVED*** Starts the connection. The connection happens asynchronously.
***REMOVED***
Driver.prototype.connect = function(fullLifeCycleTest,
    outerFrameReconnectSupported, innerFrameMigrationSupported, reverse) {
  if (!this.isTransportTestable_()) {
    asyncTestCase.continueTesting();
    return;
  }

  asyncTestCase.waitForAsync('parent and child connect');

  // Set the criteria for the initial handshake portion of the test.
  this.reinitializeDeferreds_();
  this.innerFrameResponseReceived_.awaitDeferred(
      this.outerFrameResponseReceived_);
  this.innerFrameResponseReceived_.addCallback(
      goog.bind(this.checkChannelNames_, this));

  if (fullLifeCycleTest) {
    this.innerFrameResponseReceived_.addCallback(
        goog.bind(this.testReconnects_, this,
            outerFrameReconnectSupported, innerFrameMigrationSupported));
  } else {
    this.innerFrameResponseReceived_.addCallback(
        goog.bind(asyncTestCase.continueTesting, asyncTestCase));
  }

  this.continueConnect_(reverse);
***REMOVED***


Driver.prototype.continueConnect_ = function(reverse) {
  // Wait until the peer is fully established.  Establishment is sometimes very
  // slow indeed, especially on virtual machines, so a fixed timeout is not
  // suitable.  This wait is required because we want to take precise control
  // of the channel startup timing, and shouldn't be needed in production use,
  // where the inner frame's channel is typically not started by a DOM call as
  // it is here.
  if (!this.getInnerPeer_() || !this.getInnerPeer_().instantiateChannel) {
    window.setTimeout(goog.bind(this.continueConnect_, this, reverse), 100);
    return;
  }

  var connectFromOuterFrame = goog.bind(this.channel_.connect, this.channel_,
      goog.bind(this.outerFrameConnected_, this));
  var innerConfig = this.innerFrameCfg_;
  var connectFromInnerFrame = goog.bind(this.getInnerPeer_().instantiateChannel,
      this.getInnerPeer_(), innerConfig);

  // Take control of the timing and reverse of each frame's first SETUP call. If
  // these happen to fire right on top of each other, that tends to mask
  // problems that reliably occur when there is a short delay.
  window.setTimeout(connectFromOuterFrame, reverse ? 1 : 10);
  window.setTimeout(connectFromInnerFrame, reverse ? 10 : 1);
***REMOVED***


***REMOVED***
***REMOVED*** Called by the outer frame connection callback.
***REMOVED*** @private
***REMOVED***
Driver.prototype.outerFrameConnected_ = function() {
  var payload = this.outerFrameEchoPayload_ =
      goog.net.xpc.getRandomString(10);
  this.channel_.send('echo', payload);
***REMOVED***


***REMOVED***
***REMOVED*** Called by the inner frame connection callback.
***REMOVED***
Driver.prototype.innerFrameConnected = function() {
  var payload = this.innerFrameEchoPayload_ =
      goog.net.xpc.getRandomString(10);
  this.getInnerPeer_().sendEcho(payload);
***REMOVED***


***REMOVED***
***REMOVED*** The handler function for incoming echo requests.
***REMOVED*** @param {string} payload The message payload.
***REMOVED*** @private
***REMOVED***
Driver.prototype.echoHandler_ = function(payload) {
  assertTrue('outer frame should be connected', this.channel_.isConnected());
  var peer = this.getInnerPeer_();
  assertTrue('child should be connected', peer.isConnected());
  this.channel_.send('response', payload);
***REMOVED***


***REMOVED***
***REMOVED*** The handler function for incoming echo responses.
***REMOVED*** @param {string} payload The message payload.
***REMOVED*** @private
***REMOVED***
Driver.prototype.responseHandler_ = function(payload) {
  assertTrue('outer frame should be connected', this.channel_.isConnected());
  var peer = this.getInnerPeer_();
  assertTrue('child should be connected', peer.isConnected());
  assertEquals(this.outerFrameEchoPayload_, payload);
  this.outerFrameResponseReceived_.callback(true);
***REMOVED***


***REMOVED***
***REMOVED*** The handler function for incoming echo replies.
***REMOVED*** @param {string} payload The message payload.
***REMOVED***
Driver.prototype.innerFrameGotResponse = function(payload) {
  assertTrue('outer frame should be connected', this.channel_.isConnected());
  var peer = this.getInnerPeer_();
  assertTrue('child should be connected', peer.isConnected());
  assertEquals(this.innerFrameEchoPayload_, payload);
  this.innerFrameResponseReceived_.callback(true);
***REMOVED***


***REMOVED***
***REMOVED*** The second phase of the standard test, where reconnections of both the inner
***REMOVED*** and outer frames are performed.
***REMOVED*** @param {boolean} outerFrameReconnectSupported Whether outer frame reconnects
***REMOVED***     are supported, and should be tested.
***REMOVED*** @private
***REMOVED***
Driver.prototype.testReconnects_ = function(outerFrameReconnectSupported,
    innerFrameMigrationSupported) {
  G_testRunner.log('Performing inner frame reconnect');
  this.reinitializeDeferreds_();
  this.innerFrameResponseReceived_.addCallback(
      goog.bind(this.checkChannelNames_, this));

  if (outerFrameReconnectSupported) {
    this.innerFrameResponseReceived_.addCallback(
        goog.bind(this.performOuterFrameReconnect_, this,
            innerFrameMigrationSupported));
  } else if (innerFrameMigrationSupported) {
    this.innerFrameResponseReceived_.addCallback(
        goog.bind(this.migrateInnerFrame_, this));
  } else {
    this.innerFrameResponseReceived_.addCallback(
        goog.bind(asyncTestCase.continueTesting, asyncTestCase));
  }

  this.performInnerFrameReconnect_();
***REMOVED***


***REMOVED***
***REMOVED*** Initializes the deferreds and clears the echo payloads, ready for another
***REMOVED*** sub-test.
***REMOVED*** @private
***REMOVED***
Driver.prototype.reinitializeDeferreds_ = function() {
  this.innerFrameEchoPayload_ = null;
  this.outerFrameEchoPayload_ = null;
  this.innerFrameResponseReceived_.cancel();
  this.innerFrameResponseReceived_ = new goog.async.Deferred();
  this.outerFrameResponseReceived_.cancel();
  this.outerFrameResponseReceived_ = new goog.async.Deferred();
***REMOVED***


***REMOVED***
***REMOVED*** Get the inner frame to reconnect, and repeat the echo test.
***REMOVED*** @private
***REMOVED***
Driver.prototype.performInnerFrameReconnect_ = function() {
  var peer = this.getInnerPeer_();
  peer.instantiateChannel(this.innerFrameCfg_);
***REMOVED***


***REMOVED***
***REMOVED*** Get the outer frame to reconnect, and repeat the echo test.
***REMOVED*** @private
***REMOVED***
Driver.prototype.performOuterFrameReconnect_ = function(
    innerFrameMigrationSupported) {
  G_testRunner.log('Reconnecting outer frame');
  this.reinitializeDeferreds_();
  this.innerFrameResponseReceived_.addCallback(
      goog.bind(this.checkChannelNames_, this));
  if (innerFrameMigrationSupported) {
    this.outerFrameResponseReceived_.addCallback(
        goog.bind(this.migrateInnerFrame_, this));
  } else {
    this.outerFrameResponseReceived_.addCallback(
        goog.bind(asyncTestCase.continueTesting, asyncTestCase));
  }
  this.createChannel_();
  this.channel_.connect(goog.bind(this.outerFrameConnected_, this));
***REMOVED***


***REMOVED***
***REMOVED*** Migrate the inner frame to the alternate protocol version and reconnect it.
***REMOVED*** @private
***REMOVED***
Driver.prototype.migrateInnerFrame_ = function() {
  G_testRunner.log('Migrating inner frame');
  this.reinitializeDeferreds_();
  var innerFrameProtoVersion = this.innerFrameCfg_[
      goog.net.xpc.CfgFields.NATIVE_TRANSPORT_PROTOCOL_VERSION];
  this.innerFrameResponseReceived_.addCallback(
      goog.bind(this.checkChannelNames_, this));
  this.innerFrameResponseReceived_.addCallback(
      goog.bind(asyncTestCase.continueTesting, asyncTestCase));
  this.innerFrameCfg_[
      goog.net.xpc.CfgFields.NATIVE_TRANSPORT_PROTOCOL_VERSION] =
      innerFrameProtoVersion == 1 ? 2 : 1;
  this.performInnerFrameReconnect_();
***REMOVED***


***REMOVED***
***REMOVED*** Determines if the transport type for the channel is testable.
***REMOVED*** Some transports are misusing global state or making other
***REMOVED*** assumptions that cause connections to fail.
***REMOVED*** @return {boolean} Whether the transport is testable.
***REMOVED*** @private
***REMOVED***
Driver.prototype.isTransportTestable_ = function() {
  var testable = false;

  var transportType = this.channel_.determineTransportType_();
  switch (transportType) {
    case goog.net.xpc.TransportTypes.IFRAME_RELAY:
    case goog.net.xpc.TransportTypes.IFRAME_POLLING:
      testable = canAccessSameDomainIframe;
      break;
    case goog.net.xpc.TransportTypes.NATIVE_MESSAGING:
    case goog.net.xpc.TransportTypes.FLASH:
    case goog.net.xpc.TransportTypes.DIRECT:
    case goog.net.xpc.TransportTypes.NIX:
      testable = true;
      break;
  }

  return testable;
***REMOVED***


***REMOVED***
***REMOVED*** Connect the outer channel but not the inner one.  Wait a short time, then
***REMOVED*** dispose the outer channel and make sure it was torn down properly.
***REMOVED***
Driver.prototype.connectOuterAndDispose = function() {
  this.channel_.connect();
  window.setTimeout(goog.bind(this.disposeAndCheck_, this), 2000);
***REMOVED***


***REMOVED***
***REMOVED*** Dispose the cross-page channel. Check that the transport was also
***REMOVED*** disposed, and allow to run briefly to make sure no timers which will cause
***REMOVED*** failures are still running.
***REMOVED*** @private
***REMOVED***
Driver.prototype.disposeAndCheck_ = function() {
  assertFalse(this.channel_.isConnected());
  var transport = this.channel_.transport_;
  this.channel_.dispose();
  assertNull(this.channel_.transport_);
  assertTrue(this.channel_.isDisposed());
  assertTrue(transport.isDisposed());

  // Let any errors caused by erroneous retries happen.
  window.setTimeout(goog.bind(asyncTestCase.continueTesting, asyncTestCase),
      2000);
***REMOVED***
