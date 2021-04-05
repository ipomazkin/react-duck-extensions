module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    project: './tsconfig.json',
  },
  settings: {},
  "globals": {
    "document": true,
    "window": true
  },
  "env": {
    "jest": true
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
    "airbnb-typescript-prettier",
  ],

  rules: {
    "@typescript-eslint/no-empty-interface": 0,
    "@typescript-eslint/no-this-alias": 0,
    "indent": [2, 2, {"SwitchCase": 1}],
    "@typescript-eslint/no-unused-vars": 0,
    "react/static-property-placement": 0,
    "max-len": ["error", {
      code: 120,
      tabWidth: 2,
    }],
    "import/prefer-default-export": 0,
    "no-underscore-dangle": 0,
    "no-plusplus": 0,
    "import/no-named-default": 0,
    "no-return-assign": 0,
    "import/no-extraneous-dependencies": 0,
    "consistent-return": 0,
    "no-param-reassign": 0,
  }
};
