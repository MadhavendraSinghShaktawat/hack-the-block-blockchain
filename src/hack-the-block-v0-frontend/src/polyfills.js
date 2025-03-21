// This file contains polyfills needed by the dfinity libraries

// Global polyfills
if (typeof window !== 'undefined') {
  window.global = window;
}

// Process polyfill
if (typeof window !== 'undefined' && !window.process) {
  window.process = {
    env: {},
    browser: true,
  };
}

export default {}; 