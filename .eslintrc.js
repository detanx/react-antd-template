module.exports = {
    "root": true,
    "env": {
        "node": true,
        "browser": true,
        "es6": true
    },
    "extends": [
        "airbnb-base",
        "prettier",
        "plugin:prettier/recommended",
        "plugin:react/recommended",
        "eslint:recommended",
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "parser": 'babel-eslint',
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "prettier",
    ],
    "rules": {
        "no-console": process.env.NODE_ENV === 'production' ? 2 : 0
    },
    "settings": {
        "react": {
            "version": "detect"
        }
    }
};