export default {

  collectCoverage: true,

  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,jsx}',
  ],

  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/src/index.js',
    '<rootDir>/src/api.js',
  ],

  coverageDirectory: '<rootDir>/coverage',

  coverageProvider: 'v8',

  testEnvironment: 'jsdom',

  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
  ],

  transform: {},

  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
