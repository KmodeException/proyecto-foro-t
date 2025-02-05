export default {
    testEnvironment: 'node',
    moduleFileExtensions: ['js'],
    testMatch: ['**/tests/**/*.test.js'],
    verbose: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1'
    }
};