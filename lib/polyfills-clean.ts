// Global polyfills for React Native
import '@craftzdog/react-native-buffer';
import 'react-native-get-random-values'; // This must be first
import 'react-native-url-polyfill/auto';
import 'text-encoding-polyfill';

// Declare global types
declare const global: any;

// Polyfill stream module completely
const streamBrowserify = require('stream-browserify');
global.stream = streamBrowserify;

// Buffer polyfill
const BufferPolyfill = require('@craftzdog/react-native-buffer');
global.Buffer = BufferPolyfill.Buffer;

// Process polyfill
global.process = require('process/browser');

console.log('All polyfills loaded successfully');
