const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname);

// Add resolver configuration to handle Node.js modules
config.resolver.extraNodeModules = {
  // Core Node.js modules with browser-compatible replacements
  'stream': require.resolve('stream-browserify'),
  'crypto': require.resolve('react-native-crypto'),
  'http': require.resolve('stream-http'),
  'https': require.resolve('https-browserify'),
  'buffer': require.resolve('@craftzdog/react-native-buffer'),
  'util': require.resolve('util'),
  'assert': require.resolve('assert'),
  'path': require.resolve('path-browserify'),
  'os': require.resolve('os-browserify/browser'),
  'process': require.resolve('process/browser'),
  'events': require.resolve('events'),
  'string_decoder': require.resolve('string_decoder'),
  'readable-stream': require.resolve('readable-stream'),
  'inherits': require.resolve('inherits'),
  'safe-buffer': require.resolve('safe-buffer'),
};

// Specific stream modules
config.resolver.alias = {
  'crypto': 'react-native-crypto',
  'stream': 'stream-browserify',
  '_stream_duplex': 'readable-stream/duplex',
  '_stream_passthrough': 'readable-stream/passthrough',
  '_stream_readable': 'readable-stream/readable',
  '_stream_transform': 'readable-stream/transform',
  '_stream_writable': 'readable-stream/writable',
};

// Ensure node_modules are resolved correctly
config.resolver.platforms = ['native', 'android', 'ios', 'web'];

// Add asset extensions
config.resolver.assetExts = [...config.resolver.assetExts, 'db', 'mp3', 'ttf', 'obj', 'png', 'jpg', 'json'];

// Add transformer configuration for better handling
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    ...config.transformer.minifierConfig,
    keep_fnames: true,
    mangle: {
      keep_fnames: true,
    },
  },
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

// Log the configuration
console.log('Metro configuration with Node.js polyfills loaded');

module.exports = withNativeWind(config, { input: './global.css' });
