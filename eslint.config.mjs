import eslintConfigPrettier from "eslint-config-prettier";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/dist",
      "**/publishing-test-dist/",
      "test/fixutres",
      "docs/script.js",
    ],
  },
  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/camelcase": "off",
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier
);
