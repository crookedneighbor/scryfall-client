import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    restoreMocks: true,
    testTimeout: 9000,
    alias: {
      Api: resolve(__dirname, "src/api-routes"),
      Lib: resolve(__dirname, "src/lib"),
      Models: resolve(__dirname, "/src/models"),
      Types: resolve(__dirname, "src/types"),
      Fixtures: resolve(__dirname, "test/fixtures"),
    },
  },
});
