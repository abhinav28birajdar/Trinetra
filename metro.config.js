const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const path = require('path');
 
const config = getDefaultConfig(__dirname);

// Add resolver configuration to handle Node.js modules
config.resolver.alias = {
  'crypto': 'crypto-browserify',
  'stream': path.resolve(__dirname, 'stream-polyfill.js'),
  'http': 'stream-http',
  'https': 'https-browserify',
  'buffer': '@craftzdog/react-native-buffer',
  'util': 'util',
  'events': 'events',
  'process': 'process/browser',
  'url': 'react-native-url-polyfill',
  'zlib': false, // Disable zlib as it's not needed for basic WebSocket functionality
};

config.resolver.alias = {
  'url': path.resolve(__dirname, 'url-polyfill.js'),
};

config.resolver.fallback = {
  'crypto': 'crypto-browserify',
  'stream': path.resolve(__dirname, 'stream-polyfill.js'),
  'http': 'stream-http',
  'https': 'https-browserify',
  'buffer': '@craftzdog/react-native-buffer',
  'util': 'util',
  'events': 'events',
  'process': 'process/browser',
  'zlib': false, // Disable zlib as it's not needed for basic WebSocket functionality
};

// Ensure node_modules are resolved correctly
config.resolver.platforms = ['native', 'android', 'ios', 'web'];

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
};

module.exports = withNativeWind(config, { input: './global.css' });
