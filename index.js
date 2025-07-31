import '@craftzdog/react-native-buffer';
import 'react-native-crypto';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import 'text-encoding-polyfill';

// First import stream polyfill (must be before other polyfills)
import './stream-polyfill';

// Import our comprehensive polyfills
import './lib/node-polyfills';

// Add polyfills explicitly and ensure they're properly initialized
global.Buffer = require('@craftzdog/react-native-buffer').Buffer;
global.process = require('process/browser');

// Fix for cipher-base and other crypto modules
if (typeof global.crypto !== 'object') {
  global.crypto = require('react-native-crypto');
}

// Polyfill https and http
global.https = require('https-browserify');
global.http = require('stream-http');

// Create special handler for Node.js built-in modules
const nodeModules = {
  stream: require('stream-browserify'),
  crypto: require('react-native-crypto'),
  https: require('https-browserify'),
  http: require('stream-http'),
  buffer: { Buffer: global.Buffer },
  util: require('util'),
};

// Create a custom require function that handles Node.js built-in modules
const originalRequire = global.require || ((m) => { throw new Error(`Cannot find module '${m}'`); });
global.require = (moduleName) => {
  if (nodeModules[moduleName]) {
    return nodeModules[moduleName];
  }
  return originalRequire(moduleName);
};

// Now import our app
import { ExpoRoot } from 'expo-router';

export default ExpoRoot;
