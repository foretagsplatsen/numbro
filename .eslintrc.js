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
        "array-bracket-newline": ["error", {"multiline": true}],
        "array-bracket-spacing": ["error", "never"],
        "array-callback-return": error,
        "arrow-spacing": error,
        "comma-dangle": error,
        "comma-spacing": ["error", {"before": false, "after": true}],
        "consistent-return": error,
        "default-case": error,
        "eqeqeq": error,
        "func-style": ["error", "declaration", {"allowArrowFunctions": true}],
        "handle-callback-err": error,
        "init-declarations": ["error", "always"],
        "key-spacing": ["error", {"beforeColon": false, "afterColon": true}],
        "keyword-spacing": ["error", {"before": true}],
        "linebreak-style": [error, "unix"],
        "no-confusing-arrow": error,
        "no-else-return": error,
        "no-eval": error,
        "no-implied-eval": error,
        "no-labels": error,
        "no-loop-func": error,
        "no-multi-spaces": error,
        "no-sequences": error,
        "no-shadow": error,
        "no-sync": error,
        "no-template-curly-in-string": error,
        "no-throw-literal": error,
        "no-trailing-spaces": error,
        "no-use-before-define": [error, "nofunc"],
        "no-useless-constructor": error,
        "no-useless-return": error,
        "no-var": error,
        "no-with": error,
        "one-var": [error, "never"],
        "prefer-arrow-callback": error,
        "prefer-reflect": error,
        "prefer-rest-params": error,
        "prefer-spread": error,
        "prefer-template": error,
        "quotes": [error, "double"],
        "semi": [error, "always"],
        "strict": [error, "never"],
        "yoda": [error, "never", {"exceptRange": true}]
    }
};
