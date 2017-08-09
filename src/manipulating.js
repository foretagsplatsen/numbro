/*!
 * manipulating.js
 * version : 2.0.0
 * author : Benjamin Van Ryseghem
 * license : MIT
 * https://benjamin.vanryseghem.com
 */

// Todo: add BigNumber support (https://github.com/MikeMcl/bignumber.js/)

function multiplier(x) {
    let parts = x.toString().split(".");
    let mantissa = parts[1];

    if (!mantissa) {
        return 1;
    }

    return Math.pow(10, mantissa.length);
}

function correctionFactor(...args) {
    return args.reduce((prev, next) => {
        let mp = multiplier(prev);
        let mn = multiplier(next);
        return mp > mn ? mp : mn;
    }, -Infinity);
}

function add(n, other, numbro) {
    let value = other;

    if (numbro.isNumbro(other)) {
        value = other.value();
    }

    let factor = correctionFactor(n._value, value);

    function callback(acc, number) {
        return acc + factor * number;
    }

    n._value = [n._value, value].reduce(callback, 0) / factor;
    return n;
}

function subtract(n, other, numbro) {
    let value = other;

    if (numbro.isNumbro(other)) {
        value = other.value();
    }

    let factor = correctionFactor(n._value, value);

    function callback(acc, number) {
        return acc - factor * number;
    }

    n._value = [value].reduce(callback, n._value * factor) / factor;
    return n;
}

function multiply(n, other, numbro) {
    let value = other;

    if (numbro.isNumbro(other)) {
        value = other.value();
    }

    function callback(accum, curr) {
        let factor = correctionFactor(accum, curr);
        let result = accum * factor;
        result *= curr * factor;
        result /= factor * factor;

        return result;
    }

    n._value = [n._value, value].reduce(callback, 1);
    return n;
}

function divide(n, other, numbro) {
    let value = other;

    if (numbro.isNumbro(other)) {
        value = other.value();
    }

    function callback(accum, curr) {
        let factor = correctionFactor(accum, curr);
        return (accum * factor) / (curr * factor);
    }

    n._value = [n._value, value].reduce(callback);
    return n;
}

function set(n, input) {
    n._value = input;
    return n;
}

module.exports = numbro => ({
    add: (n, other) => add(n, other, numbro),
    subtract: (n, other) => subtract(n, other, numbro),
    multiply: (n, other) => multiply(n, other, numbro),
    divide: (n, other) => divide(n, other, numbro),
    set
});
