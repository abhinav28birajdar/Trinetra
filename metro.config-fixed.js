// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for importing Node.js modules
config.resolver.extraNodeModules = {
  // Provide empty implementations or browser-compatible versions for Node.js built-in modules
  stream: require.resolve('stream-browserify'),
  crypto: require.resolve('react-native-crypto'),
  https: require.resolve('https-browserify'),
  http: require.resolve('stream-http'),
  util: require.resolve('util'),
  assert: require.resolve('assert'),
  path: require.resolve('path-browserify'),
  fs: require.resolve('expo-file-system'),
  os: require.resolve('os-browserify/browser'),
  buffer: require.resolve('@craftzdog/react-native-buffer'),
  // Add other Node.js built-in modules as needed
};

// Add support for importing from polyfill files
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];

// Fix for "Unable to resolve module [module-name]" errors
config.resolver.assetExts = [...config.resolver.assetExts, 'db', 'mp3', 'ttf', 'obj', 'png', 'jpg', 'json'];

// Use the fixed module resolution
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
