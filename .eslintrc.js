const disabled = 0;
const warning = 1;
const error = 2;

module.exports = {
    "root": true,
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "impliedStrict": true
    },
    "env": {
        "node": true,
        "jasmine": true,
        "es6": true
    },
    "rules": {
        // "no-strict": error,
        "semi": [error, "always"],
        "no-var": error,
        "no-useless-constructor": error,
        "arrow-spacing": error,
        "prefer-arrow-callback": warning,
        "prefer-reflect": warning,
        "prefer-rest-params": warning,
        "prefer-spread": warning,
        "prefer-template": error,
        "no-confusing-arrow": warning,
        "quotes": [error, "double"]
    }
};
