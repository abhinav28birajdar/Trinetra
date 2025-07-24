// Global polyfills for React Native
import '@craftzdog/react-native-buffer';
import 'react-native-get-random-values'; // This must be first
import 'react-native-url-polyfill/auto';
import 'text-encoding-polyfill';

// Declare global types
declare const global: any;

// Use our custom stream polyfill
const streamPolyfill = require('../stream-polyfill.js');
global.stream = streamPolyfill;

// Buffer polyfill
const BufferPolyfill = require('@craftzdog/react-native-buffer');
global.Buffer = BufferPolyfill.Buffer;

// Process polyfill
global.process = require('process/browser');

console.log('All polyfills loaded successfully');
