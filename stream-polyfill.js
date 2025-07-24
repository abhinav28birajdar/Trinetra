// WebSocket polyfill for React Native
// This resolves the ws module import issue

const StreamPolyfill = require('stream-browserify');

// Create a custom stream module that ws expects
const stream = {
  ...StreamPolyfill,
  Readable: StreamPolyfill.Readable,
  Writable: StreamPolyfill.Writable,
  Transform: StreamPolyfill.Transform,
  PassThrough: StreamPolyfill.PassThrough,
  pipeline: StreamPolyfill.pipeline,
  finished: StreamPolyfill.finished,
};

module.exports = stream;
