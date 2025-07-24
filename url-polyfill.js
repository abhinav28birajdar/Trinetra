// Custom URL polyfill for stream-http compatibility
import 'react-native-url-polyfill/auto';

// Provide Node.js-like URL.parse method
const url = {
  parse: function(urlString) {
    try {
      const parsed = new URL(urlString);
      return {
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: parsed.port || (parsed.protocol === 'https:' ? '443' : '80'),
        pathname: parsed.pathname,
        search: parsed.search,
        hash: parsed.hash,
        host: parsed.host,
        href: parsed.href,
        auth: null // Basic implementation
      };
    } catch (e) {
      return null;
    }
  },
  
  format: function(urlObject) {
    if (typeof urlObject === 'string') return urlObject;
    
    let url = '';
    if (urlObject.protocol) url += urlObject.protocol;
    if (urlObject.hostname) {
      url += '//' + urlObject.hostname;
      if (urlObject.port) url += ':' + urlObject.port;
    }
    if (urlObject.pathname) url += urlObject.pathname;
    if (urlObject.search) url += urlObject.search;
    if (urlObject.hash) url += urlObject.hash;
    
    return url;
  },
  
  resolve: function(from, to) {
    try {
      return new URL(to, from).href;
    } catch (e) {
      return to;
    }
  }
};

export default url;
export const parse = url.parse;
export const format = url.format;
export const resolve = url.resolve;
