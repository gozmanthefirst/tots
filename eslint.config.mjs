;
// @ts-check

import { FlatCompat } from "@eslint/eslintrc";
import boundaries from "eslint-plugin-boundaries";





const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  // Boundaries Plugin Config
  {
    plugins: {
      boundaries,
    },
    settings: {
      "boundaries/include": ["src/**/*"],
      "boundaries/elements": [
        {
          mode: "full",
          type: "global",
          pattern: ["src/global/**/*", "src/shared/**/*", "src/styles/**/*"],
        },
        {
          mode: "full",
          type: "provider",
          pattern: ["src/providers/**/*"],
        },
        {
          mode: "full",
          type: "feature",
          capture: ["featureName"],
          pattern: ["src/features/*/**/*"],
        },
        {
          mode: "full",
          type: "app",
          capture: ["_", "fileName"],
          pattern: ["src/app/**/*"],
        },
        {
          mode: "full",
          type: "neverImport",
          pattern: ["src/*"],
        },
      ],
    },
    rules: {
      "boundaries/no-unknown": ["error"],
      "boundaries/no-unknown-files": ["error"],
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            // Allow imports from a global folder to a global file
            {
              from: ["global"],
              allow: ["global"],
            },

            // Allow imports from a global or feature folder to a provider file
            {
              from: ["provider"],
              allow: ["global", "feature"],
            },

            // Allow imports from a global folder to a feature file
            // Allow imports from a specific feature folder to a feature file in that folder
            {
              from: ["feature"],
              allow: [
                "global",
                "provider",
                ["feature", { featureName: "${from.featureName}" }],
              ],
            },

            // Allow imports from a global folder or a feature folder to an app file or to neverImport files
            {
              from: ["app", "neverImport"],
              allow: ["global", "provider", "feature"],
            },

            // Allow imports from a .css file to an app file
            // {
            //   from: ["app"],
            //   allow: [["app", { fileName: "*.css" }]],
            // },
          ],
        },
      ],
    },
  },

  // Main Config
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
    },
  }),
];

export default eslintConfig;