import { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/cdk.out/"],
  coverageReporters: ["text", "lcov", "cobertura"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "@app/lib/(.*)": "<rootDir>/src/lib/$1",
    "@env/(.*)": "<rootDir>/env/$1",
    "@cdk/(.*)": "<rootDir>/resources/$1",
    "@lib/(.*)": "<rootDir>/src/lib/$1",
    "@db/(.*)": "<rootDir>/src/db/$1",
    "@auth/(.*)": "<rootDir>/src/auth/$1",
  },
  testMatch: [
    "**/!(*+(.)integration)+(*.)+(spec|test).[jt]s?(x)",
    "**/*.integration.+(spec|test).[jt]s?(x)",
  ],
};

export default config;
