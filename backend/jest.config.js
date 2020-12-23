module.exports = {
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  collectCoverageFrom: ['src/**/*.js', '!test/db-handler.js'],
  coverageReporters: ['text', 'json', 'lcov'],
};
