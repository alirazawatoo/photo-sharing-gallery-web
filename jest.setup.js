require("@testing-library/jest-dom");

// jsdom lacks TextEncoder, which react-router 7 uses at import time.
const { TextEncoder, TextDecoder } = require("util");
Object.assign(global, { TextEncoder, TextDecoder });
