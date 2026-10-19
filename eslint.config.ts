import js from "@eslint/js";
import ts from "typescript-eslint";
import svelte from "eslint-plugin-svelte";

export default ts.config(
  {
    ignores: [
      "dist/**",
      ".prerender/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      "src/lib/**",
      "**/*.js",
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs["flat/recommended"],
  {
    languageOptions: {
      globals: {
        document: "readonly",
        HTMLElement: "readonly",
        process: "readonly",
      },
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: { parserOptions: { parser: ts.parser } },
  },
);
