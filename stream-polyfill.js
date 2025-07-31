// This file provides specific polyfills for Node.js stream module
// which is used by cipher-base and other crypto-related packages

// First, import the stream browserify library
import { Duplex, PassThrough, Readable, Stream, Transform, Writable } from 'stream-browserify';

// Make sure global.stream is defined
global.stream = require('stream-browserify');

// Assign all stream constructors to the global namespace
// This ensures that any package trying to use require('stream') will get these
global.Stream = Stream;
global.Readable = Readable;
global.Writable = Writable;
global.Duplex = Duplex;
global.Transform = Transform;
global.PassThrough = PassThrough;

// Create a custom implementation for the module.exports of 'stream'
const streamModule = {
  Stream,
  Readable,
  Writable,
  Duplex,
  Transform,
  PassThrough,
  // Add any additional properties used by the packages
  default: Stream
};

// Add stream as a global module that can be required
if (typeof global.require === 'function') {
  // Some environments might already have a require function
  const originalRequire = global.require;
  global.require = (name) => {
    if (name === 'stream') {
      return streamModule;
    }
    return originalRequire(name);
  };
} else {
  // Create a minimal require function just for our polyfills
  global.require = (name) => {
    if (name === 'stream') {
      return streamModule;
    }
    throw new Error(`Cannot find module '${name}'`);
  };
}

export default streamModule;
