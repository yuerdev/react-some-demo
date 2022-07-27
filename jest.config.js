export default {
  "testEnvironment": "jsdom",
  "maxConcurrency": 10,
  "transform": {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
  "moduleNameMapper": {
    "^@yuer/([^/]+)$": "<rootDir>/@yuer/$1/index.ts",
    "chalk": "chalk/source/index.js",
    "#ansi-styles": "chalk/source/vendor/ansi-styles/index.js",
    "#supports-color": "chalk/source/vendor/supports-color/index.js"
  },
  "moduleFileExtensions": [
    "tsx",
    "ts",
    "json",
    "jsx",
    "js",
  ],
  "extensionsToTreatAsEsm": [
    ".tsx",
    ".ts",
  ],
  "modulePaths": [
    "<rootDir>",
  ],
  "testPathIgnorePatterns": [
    "/node_modules/",
  ],
  "testRegex": ".*/__tests__/.+\\.(generator|test|spec)\\.(ts|tsx)$",
};