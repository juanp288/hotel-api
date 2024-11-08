import { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  modulePaths: ['<rootDir>'],
  clearMocks: true,
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.service.(t|j)s',
    'src/**/*.controller.(t|j)s',
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
};

export default config;
