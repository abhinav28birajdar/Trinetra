// Stream polyfill for React Native
// This resolves Node.js stream module imports

const StreamPolyfill = require('stream-browserify');

// Ensure Transform is properly exported for cipher-base compatibility
const stream = {
  ...StreamPolyfill,
  Readable: StreamPolyfill.Readable,
  Writable: StreamPolyfill.Writable,
  Transform: StreamPolyfill.Transform,
  PassThrough: StreamPolyfill.PassThrough,
  Duplex: StreamPolyfill.Duplex,
  pipeline: StreamPolyfill.pipeline,
  finished: StreamPolyfill.finished,
};

// Explicitly export Transform for compatibility with cipher-base
stream.Transform = StreamPolyfill.Transform;

module.exports = stream;
