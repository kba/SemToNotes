// Copyright 2011 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Mock filesystem objects. These are all in the same file to
***REMOVED*** avoid circular dependency issues.
***REMOVED***
***REMOVED***

goog.provide('goog.testing.fs.DirectoryEntry');
goog.provide('goog.testing.fs.Entry');
goog.provide('goog.testing.fs.FileEntry');

goog.require('goog.Timer');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.async.Deferred');
goog.require('goog.fs.DirectoryEntry');
goog.require('goog.fs.DirectoryEntryImpl');
goog.require('goog.fs.Entry');
goog.require('goog.fs.Error');
goog.require('goog.fs.FileEntry');
goog.require('goog.functions');
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.testing.fs.File');
goog.require('goog.testing.fs.FileWriter');



***REMOVED***
***REMOVED*** A mock filesystem entry object.
***REMOVED***
***REMOVED*** @param {!goog.testing.fs.FileSystem} fs The filesystem containing this entry.
***REMOVED*** @param {!goog.testing.fs.DirectoryEntry} parent The directory entry directly
***REMOVED***     containing this entry.
***REMOVED*** @param {string} name The name of this entry.
***REMOVED***
***REMOVED*** @implements {goog.fs.Entry}
***REMOVED***
goog.testing.fs.Entry = function(fs, parent, name) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** This entry's filesystem.
  ***REMOVED*** @type {!goog.testing.fs.FileSystem}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.fs_ = fs;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The name of this entry.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.name_ = name;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The parent of this entry.
  ***REMOVED*** @type {!goog.testing.fs.DirectoryEntry}
 ***REMOVED*****REMOVED***
  this.parent = parent;
***REMOVED***


***REMOVED***
***REMOVED*** Whether or not this entry has been deleted.
***REMOVED*** @type {boolean}
***REMOVED***
goog.testing.fs.Entry.prototype.deleted = false;


***REMOVED*** @override***REMOVED***
goog.testing.fs.Entry.prototype.isFile = goog.abstractMethod;


***REMOVED*** @override***REMOVED***
goog.testing.fs.Entry.prototype.isDirectory = goog.abstractMethod;


***REMOVED*** @override***REMOVED***
goog.testing.fs.Entry.prototype.getName = function() {
  return this.name_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.fs.Entry.prototype.getFullPath = function() {
  if (this.getName() == '' || this.parent.getName() == '') {
    // The root directory has an empty name
    return '/' + this.name_;
  } else {
    return this.parent.getFullPath() + '/' + this.name_;
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.testing.fs.FileSystem}
***REMOVED*** @override
***REMOVED***
goog.testing.fs.Entry.prototype.getFileSystem = function() {
  return this.fs_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.fs.Entry.prototype.getLastModified = goog.abstractMethod;


***REMOVED*** @override***REMOVED***
goog.testing.fs.Entry.prototype.getMetadata = goog.abstractMethod;


***REMOVED*** @override***REMOVED***
goog.testing.fs.Entry.prototype.moveTo = function(parent, opt_newName) {
  var msg = 'moving ' + this.getFullPath() + ' into ' + parent.getFullPath() +
      (opt_newName ? ', renaming to ' + opt_newName : '');
  var newFile;
  return this.checkNotDeleted(msg).
      addCallback(function() { return this.copyTo(parent, opt_newName); }).
      addCallback(function(file) {
        newFile = file;
        return this.remove();
      }).addCallback(function() { return newFile; });
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.fs.Entry.prototype.copyTo = function(parent, opt_newName) {
  goog.asserts.assert(parent instanceof goog.testing.fs.DirectoryEntry);
  var msg = 'copying ' + this.getFullPath() + ' into ' + parent.getFullPath() +
      (opt_newName ? ', renaming to ' + opt_newName : '');
  return this.checkNotDeleted(msg).addCallback(function() {
    var name = opt_newName || this.getName();
    var entry = this.clone();
    parent.children[name] = entry;
    parent.lastModifiedTimestamp_ = goog.now();
    entry.name_ = name;
    entry.parent = parent;
    return entry;
  });
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.testing.fs.Entry} A shallow copy of this entry object.
***REMOVED***
goog.testing.fs.Entry.prototype.clone = goog.abstractMethod;


***REMOVED*** @override***REMOVED***
goog.testing.fs.Entry.prototype.toUrl = function(opt_mimetype) {
  return 'fakefilesystem:' + this.getFullPath();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.fs.Entry.prototype.toUri = goog.testing.fs.Entry.prototype.toUrl;


***REMOVED*** @override***REMOVED***
goog.testing.fs.Entry.prototype.wrapEntry = goog.abstractMethod;


***REMOVED*** @override***REMOVED***
goog.testing.fs.Entry.prototype.remove = function() {
  var msg = 'removing ' + this.getFullPath();
  return this.checkNotDeleted(msg).addCallback(function() {
    delete this.parent.children[this.getName()];
    this.parent.lastModifiedTimestamp_ = goog.now();
    this.deleted = true;
    return;
  });
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.fs.Entry.prototype.getParent = function() {
  var msg = 'getting parent of ' + this.getFullPath();
  return this.checkNotDeleted(msg).
      addCallback(function() { return this.parent; });
***REMOVED***


***REMOVED***
***REMOVED*** Return a deferred that will call its errback if this entry has been deleted.
***REMOVED*** In addition, the deferred will only run after a timeout of 0, and all its
***REMOVED*** callbacks will run with the entry as "this".
***REMOVED***
***REMOVED*** @param {string} action The name of the action being performed. For error
***REMOVED***     reporting.
***REMOVED*** @return {!goog.async.Deferred} The deferred that will be called after a
***REMOVED***     timeout of 0.
***REMOVED*** @protected
***REMOVED***
goog.testing.fs.Entry.prototype.checkNotDeleted = function(action) {
  var d = new goog.async.Deferred(undefined, this);
  goog.Timer.callOnce(function() {
    if (this.deleted) {
      var err = new goog.fs.Error(
         ***REMOVED*****REMOVED*** @type {!FileError}***REMOVED*** ({'name': 'NotFoundError'}),
          action);
      d.errback(err);
    } else {
      d.callback();
    }
  }, 0, this);
  return d;
***REMOVED***



***REMOVED***
***REMOVED*** A mock directory entry object.
***REMOVED***
***REMOVED*** @param {!goog.testing.fs.FileSystem} fs The filesystem containing this entry.
***REMOVED*** @param {goog.testing.fs.DirectoryEntry} parent The directory entry directly
***REMOVED***     containing this entry. If this is null, that means this is the root
***REMOVED***     directory and so is its own parent.
***REMOVED*** @param {string} name The name of this entry.
***REMOVED*** @param {!Object.<!goog.testing.fs.Entry>} children The map of child names to
***REMOVED***     entry objects.
***REMOVED***
***REMOVED*** @extends {goog.testing.fs.Entry}
***REMOVED*** @implements {goog.fs.DirectoryEntry}
***REMOVED*** @final
***REMOVED***
goog.testing.fs.DirectoryEntry = function(fs, parent, name, children) {
  goog.testing.fs.DirectoryEntry.base(
      this, 'constructor', fs, parent || this, name);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The map of child names to entry objects.
  ***REMOVED*** @type {!Object.<!goog.testing.fs.Entry>}
 ***REMOVED*****REMOVED***
  this.children = children;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The modification time of the directory. Measured using goog.now, which may
  ***REMOVED*** be overridden with mock time providers.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.lastModifiedTimestamp_ = goog.now();
***REMOVED***
goog.inherits(goog.testing.fs.DirectoryEntry, goog.testing.fs.Entry);


***REMOVED***
***REMOVED*** Constructs and returns the metadata object for this entry.
***REMOVED*** @return {{modificationTime: Date}} The metadata object.
***REMOVED*** @private
***REMOVED***
goog.testing.fs.DirectoryEntry.prototype.getMetadata_ = function() {
  return {
    'modificationTime': new Date(this.lastModifiedTimestamp_)
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.fs.DirectoryEntry.prototype.isFile = function() {
  return false;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.fs.DirectoryEntry.prototype.isDirectory = function() {
  return true;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.fs.DirectoryEntry.prototype.getLastModified = function() {
  var msg = 'reading last modified date for ' + this.getFullPath();
  return this.checkNotDeleted(msg).
      addCallback(function() {return new Date(this.lastModifiedTimestamp_)});
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.fs.DirectoryEntry.prototype.getMetadata = function() {
  var msg = 'reading metadata for ' + this.getFullPath();
  return this.checkNotDeleted(msg).
      addCallback(function() {return this.getMetadata_()});
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.fs.DirectoryEntry.prototype.clone = function() {
  return new goog.testing.fs.DirectoryEntry(
      this.getFileSystem(), this.parent, this.getName(), this.children);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.fs.DirectoryEntry.prototype.remove = function() {
  if (!goog.object.isEmpty(this.children)) {
    var d = new goog.async.Deferred();
    goog.Timer.callOnce(function() {
      d.errback(new goog.fs.Error(
         ***REMOVED*****REMOVED*** @type {!FileError}***REMOVED*** ({'name': 'InvalidModificationError'}),
          'removing ' + this.getFullPath()));
    }, 0, this);
    return d;
  } else if (this != this.getFileSystem().getRoot()) {
    return goog.testing.fs.DirectoryEntry.base(this, 'remove');
  } else {
    // Root directory, do nothing.
    return goog.async.Deferred.succeed();
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.fs.DirectoryEntry.prototype.getFile = function(
    path, opt_behavior) {
  var msg = 'loading file ' + path + ' from ' + this.getFullPath();
  opt_behavior = opt_behavior || goog.fs.DirectoryEntry.Behavior.DEFAULT;
  return this.checkNotDeleted(msg).addCallback(function() {
    try {
      return goog.async.Deferred.succeed(this.getFileSync(path, opt_behavior));
    } catch (e) {
      return goog.async.Deferred.fail(e);
    }
  });
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.fs.DirectoryEntry.prototype.getDirectory = function(
    path, opt_behavior) {
  var msg = 'loading directory ' + path + ' from ' + this.getFullPath();
  opt_behavior = opt_behavior || goog.fs.DirectoryEntry.Behavior.DEFAULT;
  return this.checkNotDeleted(msg).addCallback(function() {
    try {
      return goog.async.Deferred.succeed(
          this.getDirectorySync(path, opt_behavior));
    } catch (e) {
      return goog.async.Deferred.fail(e);
    }
  });
***REMOVED***


***REMOVED***
***REMOVED*** Get a file entry synchronously, without waiting for a Deferred to resolve.
***REMOVED***
***REMOVED*** @param {string} path The path to the file, relative to this directory.
***REMOVED*** @param {goog.fs.DirectoryEntry.Behavior=} opt_behavior The behavior for
***REMOVED***     loading the file.
***REMOVED*** @param {string=} opt_data The string data encapsulated by the blob.
***REMOVED*** @param {string=} opt_type The mime type of the blob.
***REMOVED*** @return {!goog.testing.fs.FileEntry} The loaded file.
***REMOVED***
goog.testing.fs.DirectoryEntry.prototype.getFileSync = function(
    path, opt_behavior, opt_data, opt_type) {
  opt_behavior = opt_behavior || goog.fs.DirectoryEntry.Behavior.DEFAULT;
  return (***REMOVED*** @type {!goog.testing.fs.FileEntry}***REMOVED*** (this.getEntry_(
      path, opt_behavior, true /* isFile***REMOVED***,
      goog.bind(function(parent, name) {
        return new goog.testing.fs.FileEntry(
            this.getFileSystem(), parent, name,
            goog.isDef(opt_data) ? opt_data : '', opt_type);
      }, this))));
***REMOVED***


***REMOVED***
***REMOVED*** Creates a file synchronously. This is a shorthand for getFileSync, useful for
***REMOVED*** setting up tests.
***REMOVED***
***REMOVED*** @param {string} path The path to the file, relative to this directory.
***REMOVED*** @return {!goog.testing.fs.FileEntry} The created file.
***REMOVED***
goog.testing.fs.DirectoryEntry.prototype.createFileSync = function(path) {
  return this.getFileSync(path, goog.fs.DirectoryEntry.Behavior.CREATE);
***REMOVED***


***REMOVED***
***REMOVED*** Get a directory synchronously, without waiting for a Deferred to resolve.
***REMOVED***
***REMOVED*** @param {string} path The path to the directory, relative to this one.
***REMOVED*** @param {goog.fs.DirectoryEntry.Behavior=} opt_behavior The behavior for
***REMOVED***     loading the directory.
***REMOVED*** @return {!goog.testing.fs.DirectoryEntry} The loaded directory.
***REMOVED***
goog.testing.fs.DirectoryEntry.prototype.getDirectorySync = function(
    path, opt_behavior) {
  opt_behavior = opt_behavior || goog.fs.DirectoryEntry.Behavior.DEFAULT;
  return (***REMOVED*** @type {!goog.testing.fs.DirectoryEntry}***REMOVED*** (this.getEntry_(
      path, opt_behavior, false /* isFile***REMOVED***,
      goog.bind(function(parent, name) {
        return new goog.testing.fs.DirectoryEntry(
            this.getFileSystem(), parent, name, {});
      }, this))));
***REMOVED***


***REMOVED***
***REMOVED*** Creates a directory synchronously. This is a shorthand for getFileSync,
***REMOVED*** useful for setting up tests.
***REMOVED***
***REMOVED*** @param {string} path The path to the directory, relative to this directory.
***REMOVED*** @return {!goog.testing.fs.DirectoryEntry} The created directory.
***REMOVED***
goog.testing.fs.DirectoryEntry.prototype.createDirectorySync = function(path) {
  return this.getDirectorySync(path, goog.fs.DirectoryEntry.Behavior.CREATE);
***REMOVED***


***REMOVED***
***REMOVED*** Get a file or directory entry from a path. This handles parsing the path for
***REMOVED*** subdirectories and throwing appropriate errors should something go wrong.
***REMOVED***
***REMOVED*** @param {string} path The path to the entry, relative to this directory.
***REMOVED*** @param {goog.fs.DirectoryEntry.Behavior} behavior The behavior for loading
***REMOVED***     the entry.
***REMOVED*** @param {boolean} isFile Whether a file or directory is being loaded.
***REMOVED*** @param {function(!goog.testing.fs.DirectoryEntry, string) :
***REMOVED***             !goog.testing.fs.Entry} createFn
***REMOVED***     The function for creating the entry if it doesn't yet exist. This is
***REMOVED***     passed the parent entry and the name of the new entry.
***REMOVED*** @return {!goog.testing.fs.Entry} The loaded entry.
***REMOVED*** @private
***REMOVED***
goog.testing.fs.DirectoryEntry.prototype.getEntry_ = function(
    path, behavior, isFile, createFn) {
  // Filter out leading, trailing, and duplicate slashes.
  var components = goog.array.filter(path.split('/'), goog.functions.identity);

  var basename =***REMOVED*****REMOVED*** @type {string}***REMOVED*** (goog.array.peek(components)) || '';
  var dir = goog.string.startsWith(path, '/') ?
      this.getFileSystem().getRoot() : this;

  goog.array.forEach(components.slice(0, -1), function(p) {
    var subdir = dir.children[p];
    if (!subdir) {
      throw new goog.fs.Error(
         ***REMOVED*****REMOVED*** @type {!FileError}***REMOVED*** ({'name': 'NotFoundError'}),
          'loading ' + path + ' from ' + this.getFullPath() + ' (directory ' +
          dir.getFullPath() + '/' + p + ')');
    }
    dir = subdir;
  }, this);

  // If there is no basename, the path must resolve to the root directory.
  var entry = basename ? dir.children[basename] : dir;

  if (!entry) {
    if (behavior == goog.fs.DirectoryEntry.Behavior.DEFAULT) {
      throw new goog.fs.Error(
         ***REMOVED*****REMOVED*** @type {!FileError}***REMOVED*** ({'name': 'NotFoundError'}),
          'loading ' + path + ' from ' + this.getFullPath());
    } else {
      goog.asserts.assert(
          behavior == goog.fs.DirectoryEntry.Behavior.CREATE ||
          behavior == goog.fs.DirectoryEntry.Behavior.CREATE_EXCLUSIVE);
      entry = createFn(dir, basename);
      dir.children[basename] = entry;
      this.lastModifiedTimestamp_ = goog.now();
      return entry;
    }
  } else if (behavior == goog.fs.DirectoryEntry.Behavior.CREATE_EXCLUSIVE) {
    throw new goog.fs.Error(
       ***REMOVED*****REMOVED*** @type {!FileError}***REMOVED*** ({'name': 'InvalidModificationError'}),
        'loading ' + path + ' from ' + this.getFullPath());
  } else if (entry.isFile() != isFile) {
    throw new goog.fs.Error(
       ***REMOVED*****REMOVED*** @type {!FileError}***REMOVED*** ({'name': 'TypeMismatchError'}),
        'loading ' + path + ' from ' + this.getFullPath());
  } else {
    if (behavior == goog.fs.DirectoryEntry.Behavior.CREATE) {
      this.lastModifiedTimestamp_ = goog.now();
    }
    return entry;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether this directory has a child with the given name.
***REMOVED***
***REMOVED*** @param {string} name The name of the entry to check for.
***REMOVED*** @return {boolean} Whether or not this has a child with the given name.
***REMOVED***
goog.testing.fs.DirectoryEntry.prototype.hasChild = function(name) {
  return name in this.children;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.fs.DirectoryEntry.prototype.removeRecursively = function() {
  var msg = 'removing ' + this.getFullPath() + ' recursively';
  return this.checkNotDeleted(msg).addCallback(function() {
    var d = goog.async.Deferred.succeed(null);
    goog.object.forEach(this.children, function(child) {
      d.awaitDeferred(
          child.isDirectory() ? child.removeRecursively() : child.remove());
    });
    d.addCallback(function() { return this.remove(); }, this);
    return d;
  });
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.fs.DirectoryEntry.prototype.listDirectory = function() {
  var msg = 'listing ' + this.getFullPath();
  return this.checkNotDeleted(msg).addCallback(function() {
    return goog.object.getValues(this.children);
  });
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.fs.DirectoryEntry.prototype.createPath =
    // This isn't really type-safe.
   ***REMOVED*****REMOVED*** @type {!Function}***REMOVED*** (goog.fs.DirectoryEntryImpl.prototype.createPath);



***REMOVED***
***REMOVED*** A mock file entry object.
***REMOVED***
***REMOVED*** @param {!goog.testing.fs.FileSystem} fs The filesystem containing this entry.
***REMOVED*** @param {!goog.testing.fs.DirectoryEntry} parent The directory entry directly
***REMOVED***     containing this entry.
***REMOVED*** @param {string} name The name of this entry.
***REMOVED*** @param {string} data The data initially contained in the file.
***REMOVED*** @param {string=} opt_type The mime type of the blob.
***REMOVED***
***REMOVED*** @extends {goog.testing.fs.Entry}
***REMOVED*** @implements {goog.fs.FileEntry}
***REMOVED*** @final
***REMOVED***
goog.testing.fs.FileEntry = function(fs, parent, name, data, opt_type) {
  goog.testing.fs.FileEntry.base(this, 'constructor', fs, parent, name);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The internal file blob referenced by this file entry.
  ***REMOVED*** @type {!goog.testing.fs.File}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.file_ =
      new goog.testing.fs.File(name, new Date(goog.now()), data, opt_type);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The metadata for file.
  ***REMOVED*** @type {{modificationTime: Date}}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.metadata_ = {
    'modificationTime': this.file_.lastModifiedDate
 ***REMOVED*****REMOVED***
***REMOVED***
goog.inherits(goog.testing.fs.FileEntry, goog.testing.fs.Entry);


***REMOVED*** @override***REMOVED***
goog.testing.fs.FileEntry.prototype.isFile = function() {
  return true;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.fs.FileEntry.prototype.isDirectory = function() {
  return false;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.fs.FileEntry.prototype.clone = function() {
  return new goog.testing.fs.FileEntry(
      this.getFileSystem(), this.parent,
      this.getName(), this.fileSync().toString());
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.fs.FileEntry.prototype.getLastModified = function() {
  return this.file().addCallback(function(file) {
    return file.lastModifiedDate;
  });
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.fs.FileEntry.prototype.getMetadata = function() {
  var msg = 'getting metadata for ' + this.getFullPath();
  return this.checkNotDeleted(msg).addCallback(function() {
    return this.metadata_;
  });
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.fs.FileEntry.prototype.createWriter = function() {
  var d = new goog.async.Deferred();
  goog.Timer.callOnce(
      goog.bind(d.callback, d, new goog.testing.fs.FileWriter(this)));
  return d;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.fs.FileEntry.prototype.file = function() {
  var msg = 'getting file for ' + this.getFullPath();
  return this.checkNotDeleted(msg).addCallback(function() {
    return this.fileSync();
  });
***REMOVED***


***REMOVED***
***REMOVED*** Get the internal file representation synchronously, without waiting for a
***REMOVED*** Deferred to resolve.
***REMOVED***
***REMOVED*** @return {!goog.testing.fs.File} The internal file blob referenced by this
***REMOVED***     FileEntry.
***REMOVED***
goog.testing.fs.FileEntry.prototype.fileSync = function() {
  return this.file_;
***REMOVED***
