// Global polyfills for React Native
import '@craftzdog/react-native-buffer';
import 'react-native-get-random-values'; // This must be first
import 'react-native-url-polyfill/auto';
import 'text-encoding-polyfill';

// Declare global types
declare const global: any;

// Buffer polyfill
const BufferPolyfill = require('@craftzdog/react-native-buffer');
global.Buffer = BufferPolyfill.Buffer;

// Process polyfill
global.process = require('process/browser');

// Stream polyfill using stream-browserify package
try {
  const streamBrowserify = require('stream-browserify');
  global.stream = streamBrowserify;
  
  // Additional stream polyfills
  global.Stream = streamBrowserify;
  if (!global.stream.Readable) {
    global.stream.Readable = require('readable-stream').Readable;
  }
} catch (error) {
  console.warn('Stream polyfill not available:', error);
}

// Additional Node.js polyfills
global.crypto = require('crypto-browserify');
global.util = require('util');

console.log('All polyfills loaded successfully');
