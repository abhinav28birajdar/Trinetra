const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname);

// Add resolver configuration to handle Node.js modules
config.resolver.alias = {
  'crypto': 'react-native-crypto',
  'stream': 'stream-browserify',
  '_stream_duplex': 'readable-stream/duplex',
  '_stream_passthrough': 'readable-stream/passthrough',
  '_stream_readable': 'readable-stream/readable',
  '_stream_transform': 'readable-stream/transform',
  '_stream_writable': 'readable-stream/writable',
};

config.resolver.fallback = {
  'crypto': 'react-native-crypto',
  'stream': 'stream-browserify',
  'string_decoder': 'string_decoder',
  'http': 'stream-http',
  'https': false, // Disable https-browserify and use fetch instead
  'buffer': '@craftzdog/react-native-buffer',
  'util': 'util',
  'events': 'events',
  'process': 'process/browser',
  'zlib': false, // Disable zlib as it's not needed for basic WebSocket functionality
  '_stream_duplex': 'readable-stream/duplex',
  '_stream_passthrough': 'readable-stream/passthrough',
  '_stream_readable': 'readable-stream/readable',
  '_stream_transform': 'readable-stream/transform',
  '_stream_writable': 'readable-stream/writable',
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
