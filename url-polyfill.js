// URL polyfill implementation
import 'react-native-url-polyfill/auto';

// Ensure the global URL object is available
if (typeof global.URL !== 'function') {
  global.URL = require('react-native-url-polyfill').URL;
}

// Provide an empty URLSearchParams if needed
if (typeof global.URLSearchParams !== 'function') {
  global.URLSearchParams = require('react-native-url-polyfill').URLSearchParams;
}

// Export the URL-related classes
export default {
  URL: global.URL,
  URLSearchParams: global.URLSearchParams,
};
