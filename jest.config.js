module.exports = {
  // A list of paths to directories that Jest should use to search for files in.
  roots: ['<rootDir>/src'],

  // An array of glob patterns indicating a set of files for which coverage information should be collected. If a file matches the specified glob pattern, coverage information will be collected for it even if no tests exist for this file and it's never required in the test suite.
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.{ts,tsx}',
    '!src/**/*.types.{ts,tsx}',
    '!src/assets/**/*.{ts,tsx}',
    '!src/service-worker/**/*.{ts,tsx}'
  ],

  // A list of paths to modules that run some code to configure or set up the testing environment. Each setupFile will be run once per test file. Since every test runs in its own environment, these scripts will be executed in the testing environment immediately before executing the test code itself.
  setupFiles: ['react-app-polyfill/jsdom'],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test file in the suite is executed. Since setupFiles executes before the test framework is installed in the environment, this script file presents you the opportunity of running some code immediately after the test framework has been installed in the environment.
  setupFilesAfterEnv: ['<rootDir>/src/config/test-setup.ts'],

  // The test environment that will be used for testing. The default environment in Jest is a browser-like environment through jsdom. If you are building a node service, you can use the node option to use a node-like environment instead.
  testEnvironment: 'jsdom',

  // The glob patterns Jest uses to detect test files.
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{spec,test}.{ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{ts,tsx}'
  ],

  transform: {
    // ts-jest:  A TypeScript preprocessor with source map support for Jest that lets you use Jest to test projects written in TypeScript.
    '^.+\\.(ts|tsx)$': ['ts-jest', { isolatedModules: true }]
  },

  // Jest to gracefully handle asset files such as stylesheets and images. Usually, these files aren't particularly useful in tests so we can safely mock them out.
  moduleNameMapper: {
    '\\.(css|sass|scss|less)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'jest-transform-stub',
    '^src/(.*)': ['<rootDir>/src/$1'],
    '^common/(.*)': '<rootDir>/src/common/$1',
    '^apps/(.*)': '<rootDir>/src/apps/$1',
    '^assets/(.*)': '<rootDir>/src/assets/$1',
    '^router/(.*)': '<rootDir>/src/router/$1',
    '^v2/(.*)': '<rootDir>/src/v2/$1'
  },

  // An array of regexp pattern strings that are matched against all source file paths before transformation. If the file path matches any of the patterns, it will not be transformed.
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$'
  ],

  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],

  reporters: [
    'default',
    [
      'jest-stare',
      {
        resultDir: 'jest-stare',
        reportTitle: 'SWLite',
        reportHeadline: 'SwLite',
        coverageLink: './coverage/lcov-report/index.html',
        jestStareConfigJson: 'jest-stare.json',
        jestGlobalConfigJson: 'globalStuff.json'
      }
    ]
  ],
  collectCoverage: true
  // coverageThreshold: {
  //   global: {
  //     statements: 70,
  //     branches: 70,
  //     functions: 70,
  //     lines: 70
  //   }
  // }
};
