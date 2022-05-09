/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  env: {
    node: true,
    "vue/setup-compiler-macros": true,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: ["prettier"],
  extends: ["plugin:vue/vue3-recommended", "eslint:recommended", "@vue/eslint-config-prettier"],
  overrides: [
    {
      files: ["cypress/integration/**.spec.{js,ts,jsx,tsx}"],
      extends: ["plugin:cypress/recommended"],
    },
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "prettier/prettier": "warn",
  },
};
