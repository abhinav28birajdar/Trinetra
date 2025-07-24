const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname);

// Add resolver configuration to handle Node.js modules
config.resolver.alias = {
  'crypto': 'react-native-get-random-values',
  'stream': 'stream-browserify',
  'buffer': '@craftzdog/react-native-buffer',
  'util': 'util',
  'events': 'events',
  'process': 'process/browser',
};

config.resolver.fallback = {
  'crypto': 'react-native-get-random-values',
  'stream': 'stream-browserify',
  'buffer': '@craftzdog/react-native-buffer',
  'util': 'util',
  'events': 'events',
  'process': 'process/browser',
};

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

// Ensure polyfills are resolved first
config.resolver.platforms = ['native', 'android', 'ios', 'web'];
 
module.exports = withNativeWind(config, { input: './global.css' });
