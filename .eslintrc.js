module.exports = {
  plugins: ["react", "prettier", "import", "jsx-a11y", "react-hooks"],
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "standard",
    "prettier"
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js','test'],
  rules: {
    "react/prop-types": 0,
    "no-underscore-dangle": 0,
    "camelcase": "off",
    "no-new": "off",
    "react-hooks/exhaustive-deps": "off",
    "react-hooks/rules-of-hooks": "error",
  },
  "globals": {
    "window": true,
    "document": true,
    "localStorage": true,
    "FormData": true,
    "FileReader": true,
    "Blob": true,
    "caches": true
  }
};
