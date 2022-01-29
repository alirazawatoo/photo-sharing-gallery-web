const js = require("@eslint/js");
const globals = require("globals");
const react = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");

module.exports = [
  { ignores: ["dist/**", "coverage/**"] },
  js.configs.recommended,
  {
    files: ["src/refactor-this/**/*.js"],
    plugins: { react, "react-hooks": reactHooks },
    languageOptions: {
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: globals.browser,
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react/prop-types": "off",
    },
  },
  {
    files: ["src/do-not-refactor/**/*.js", "*.config.js", "jest.setup.js"],
    languageOptions: { sourceType: "commonjs", globals: globals.node },
  },
  {
    files: ["**/__tests__/**/*.js"],
    languageOptions: { globals: { ...globals.jest, ...globals.node } },
  },
];
