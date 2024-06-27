import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";


export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true },  "sourceType": "module",
  "project": "./tsconfig.json", "extends": [
  "plugin:react/recommended",
  "standard-with-typescript",
  "prettier" // Ditambahkan
],} } },
  {languageOptions: { globals: globals.browser }},
  ...tseslint.configs.recommended,
  pluginReactConfig,
];