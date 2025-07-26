import '@craftzdog/react-native-buffer';
import 'react-native-crypto';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import 'text-encoding-polyfill';

// Add stream polyfill explicitly
global.stream = require('stream-browserify');
global.Buffer = require('@craftzdog/react-native-buffer').Buffer;
global.process = require('process/browser');

// Also polyfill for any direct imports
import { Stream } from 'stream-browserify';
global.Stream = Stream;

// Now import our app
import { ExpoRoot } from 'expo-router';

export default ExpoRoot;
