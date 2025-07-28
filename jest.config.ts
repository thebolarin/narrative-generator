import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testMatch: ['**/*.test.ts'],
};

export default config;