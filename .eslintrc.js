module.exports = {
  "env": {
    "commonjs": true,
    "es6": true,
    "node": true
  },
  "extends": "standard",
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018
  },
  "plugins": [
    "mocha"
  ],
  "rules": {
    "lines-between-class-members": ["error", "always"],
    "mocha/no-exclusive-tests": "error",
  }
};
