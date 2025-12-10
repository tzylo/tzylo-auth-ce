const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/integration/*.test.ts"],
  moduleNameMapper: {
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@config/(.*)$": "<rootDir>/src/config/$1",
    "^@db/(.*)$": "<rootDir>/src/db/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
  },
  transform: {
    ...tsJestTransformCfg,
  },
   globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.json"
    }
  },
  setupFilesAfterEnv: ["<rootDir>/tests/integration/setup.ts"],
};
