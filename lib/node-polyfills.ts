// This file provides polyfills for Node.js modules that are not available in React Native

// Import necessary polyfills
import '@craftzdog/react-native-buffer';
import 'react-native-get-random-values';
import { polyfillWebCrypto } from 'react-native-get-random-values';
import * as streamBrowserify from 'stream-browserify';

// Import additional Node.js polyfill modules
import * as assert from 'assert';
import * as https from 'https-browserify';
import * as inherits from 'inherits';
import * as os from 'os-browserify/browser';
import * as path from 'path-browserify';
import * as crypto from 'react-native-crypto';
import * as safeBuffer from 'safe-buffer';
import * as http from 'stream-http';
import * as util from 'util';

// Initialize a map of Node.js built-in modules to their browser-compatible equivalents
const nodeBuiltins = {
  stream: streamBrowserify,
  crypto: crypto,
  https: https,
  http: http,
  util: util,
  assert: assert,
  path: path,
  os: os,
  inherits: inherits,
  'safe-buffer': safeBuffer,
  buffer: { Buffer: global.Buffer },
  fs: {}, // Empty implementation (will throw errors if used)
  zlib: {}, // Empty implementation (will throw errors if used)
  dns: {}, // Empty implementation (will throw errors if used)
};

// Apply all polyfills to the global object
const applyPolyfills = () => {
  // Ensure Buffer is available globally
  if (typeof global.Buffer !== 'function') {
    global.Buffer = require('@craftzdog/react-native-buffer').Buffer;
  }

  // Ensure process is available globally
  if (typeof global.process === 'undefined') {
    global.process = require('process/browser');
  }

  // Ensure stream is available globally
  if (typeof global.stream === 'undefined') {
    global.stream = streamBrowserify;
  }

  // Ensure all stream classes are available globally
  Object.keys(streamBrowserify).forEach(key => {
    global[key] = streamBrowserify[key];
  });

  // Ensure crypto is available globally
  if (typeof global.crypto !== 'object') {
    polyfillWebCrypto();
  }

  // Ensure TextEncoder and TextDecoder are available
  if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = require('text-encoding-polyfill').TextEncoder;
  }

  if (typeof global.TextDecoder === 'undefined') {
    global.TextDecoder = require('text-encoding-polyfill').TextDecoder;
  }

  // Setup a custom require function to handle Node.js built-in modules
  const originalRequire = global.require || ((moduleName: string) => {
    throw new Error(`Cannot find module '${moduleName}'`);
  });

  // Use 'any' type to avoid TypeScript errors with NodeRequire interface
  (global as any).require = (moduleName: string) => {
    if (nodeBuiltins[moduleName]) {
      return nodeBuiltins[moduleName];
    }
    return originalRequire(moduleName);
  };
};

// Apply all polyfills immediately
applyPolyfills();

// Export the polyfilled modules
export default {
  ...nodeBuiltins,
  Buffer: global.Buffer,
  process: global.process,
  TextEncoder: global.TextEncoder,
  TextDecoder: global.TextDecoder,
};
