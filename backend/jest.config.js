export default {
    testEnvironment: 'node',
    moduleFileExtensions: ['js'],
    testMatch: ['**/tests/**/*.test.js'],
    verbose: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    transform: {
        '^.+\\.js$': ['babel-jest']
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^(\\.{1,2}/.*)\\.js$': '$1'
    },
    testPathIgnorePatterns: ['/node_modules/'],
    setupFilesAfterEnv: ['./jest.setup.js'],
    roots: ['<rootDir>'],
    modulePaths: ['<rootDir>']
};