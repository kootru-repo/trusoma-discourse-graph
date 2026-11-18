import { config } from "@repo/eslint-config/base";

export default [
  ...config,
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: true,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
];
