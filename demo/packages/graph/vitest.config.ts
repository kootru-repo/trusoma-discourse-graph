import { realpathSync } from "node:fs";
import { defineConfig } from "vitest/config";

// the real path, so a drive letter typed in another case cannot load vitest twice (Windows)
export default defineConfig({
  root: realpathSync.native(process.cwd()),
  test: {
    include: ["test/*.test.ts"],
    testTimeout: 120000,
    hookTimeout: 120000,
    fileParallelism: false,
  },
});
