module.exports = {
  transform: {'^.+\\.ts?$': 'ts-jest'},
  testEnvironment: 'node',
  testRegex: '\.(test|spec)\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  coverageReporters: ['html', ["lcovonly", {"projectRoot": __dirname}], 'text-summary'],
};
